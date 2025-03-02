import torch
from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel
from transformers import AutoModelForSeq2SeqLM, AutoTokenizer
from IndicTransToolkit import IndicProcessor
from typing import List, Dict
import argparse
import os
from fastapi.responses import RedirectResponse
import uvicorn

# Recommended to run this on a GPU with flash_attn installed
# Don't set attn_implementation if you don't have flash_attn
DEVICE = "cuda" if torch.cuda.is_available() else "cpu"

class TranslateManager:
    def __init__(self, src_lang, tgt_lang, device_type=DEVICE, use_distilled=True):
        self.device_type = device_type
        self.tokenizer, self.model = self.initialize_model(src_lang, tgt_lang, use_distilled)

    def initialize_model(self, src_lang, tgt_lang, use_distilled):
        # Determine the model name based on the source and target languages and the model type
        if src_lang.startswith("eng") and not tgt_lang.startswith("eng"):
            model_name = "ai4bharat/indictrans2-en-indic-dist-200M" if use_distilled else "ai4bharat/indictrans2-en-indic-1B"
        elif not src_lang.startswith("eng") and tgt_lang.startswith("eng"):
            model_name = "ai4bharat/indictrans2-indic-en-dist-200M" if use_distilled else "ai4bharat/indictrans2-indic-en-1B"
        elif not src_lang.startswith("eng") and not tgt_lang.startswith("eng"):
            model_name = "ai4bharat/indictrans2-indic-indic-dist-320M" if use_distilled else "ai4bharat/indictrans2-indic-indic-1B"
        else:
            raise ValueError("Invalid language combination: English to English translation is not supported.")

        # Now model_name contains the correct model based on the source and target languages
        tokenizer = AutoTokenizer.from_pretrained(model_name, trust_remote_code=True)
        model = AutoModelForSeq2SeqLM.from_pretrained(
            model_name,
            trust_remote_code=True,
            torch_dtype=torch.float16,  # performance might slightly vary for bfloat16
            attn_implementation="flash_attention_2"
        ).to(self.device_type)
        return tokenizer, model

class ModelManager:
    def __init__(self, device_type=DEVICE, use_distilled=True, is_lazy_loading=False):
        self.models: Dict[str, TranslateManager] = {}
        self.device_type = device_type
        self.use_distilled = use_distilled
        self.is_lazy_loading = is_lazy_loading
        if not is_lazy_loading:
            self.preload_models()

    def preload_models(self):
        # Preload all models at startup
        self.models['eng_indic'] = TranslateManager('eng_Latn', 'kan_Knda', self.device_type, self.use_distilled)
        self.models['indic_eng'] = TranslateManager('kan_Knda', 'eng_Latn', self.device_type, self.use_distilled)
        self.models['indic_indic'] = TranslateManager('kan_Knda', 'hin_Deva', self.device_type, self.use_distilled)

    def get_model(self, src_lang, tgt_lang) -> TranslateManager:
        if src_lang.startswith("eng") and not tgt_lang.startswith("eng"):
            key = 'eng_indic'
        elif not src_lang.startswith("eng") and tgt_lang.startswith("eng"):
            key = 'indic_eng'
        elif not src_lang.startswith("eng") and not tgt_lang.startswith("eng"):
            key = 'indic_indic'
        else:
            raise ValueError("Invalid language combination: English to English translation is not supported.")

        if key not in self.models:
            if self.is_lazy_loading:
                if key == 'eng_indic':
                    self.models[key] = TranslateManager('eng_Latn', 'kan_Knda', self.device_type, self.use_distilled)
                elif key == 'indic_eng':
                    self.models[key] = TranslateManager('kan_Knda', 'eng_Latn', self.device_type, self.use_distilled)
                elif key == 'indic_indic':
                    self.models[key] = TranslateManager('kan_Knda', 'hin_Deva', self.device_type, self.use_distilled)
            else:
                raise ValueError(f"Model for {key} is not preloaded and lazy loading is disabled.")

        return self.models[key]

ip = IndicProcessor(inference=True)
app = FastAPI()
model_manager = ModelManager()

class TranslationRequest(BaseModel):
    sentences: List[str]
    src_lang: str
    tgt_lang: str

class TranslationResponse(BaseModel):
    translations: List[str]

def get_translate_manager(src_lang: str, tgt_lang: str) -> TranslateManager:
    return model_manager.get_model(src_lang, tgt_lang)

@app.get("/")
async def home():
    return RedirectResponse(url="/docs")

@app.post("/translate", response_model=TranslationResponse)
async def translate(request: TranslationRequest, translate_manager: TranslateManager = Depends(get_translate_manager)):
    input_sentences = request.sentences
    src_lang = request.src_lang
    tgt_lang = request.tgt_lang

    if not input_sentences:
        raise HTTPException(status_code=400, detail="Input sentences are required")

    batch = ip.preprocess_batch(
        input_sentences,
        src_lang=src_lang,
        tgt_lang=tgt_lang,
    )

    # Tokenize the sentences and generate input encodings
    inputs = translate_manager.tokenizer(
        batch,
        truncation=True,
        padding="longest",
        return_tensors="pt",
        return_attention_mask=True,
    ).to(translate_manager.device_type)

    # Generate translations using the model
    with torch.no_grad():
        generated_tokens = translate_manager.model.generate(
            **inputs,
            use_cache=True,
            min_length=0,
            max_length=256,
            num_beams=5,
            num_return_sequences=1,
        )

    # Decode the generated tokens into text
    with translate_manager.tokenizer.as_target_tokenizer():
        generated_tokens = translate_manager.tokenizer.batch_decode(
            generated_tokens.detach().cpu().tolist(),
            skip_special_tokens=True,
            clean_up_tokenization_spaces=True,
        )

    # Postprocess the translations, including entity replacement
    translations = ip.postprocess_batch(generated_tokens, lang=tgt_lang)
    return TranslationResponse(translations=translations)

# Function to parse command-line arguments
def parse_args():
    parser = argparse.ArgumentParser(description="Translation Server")
    parser.add_argument("--port", type=int, default=7860, help="Port to run the server on.")
    parser.add_argument("--host", type=str, default="0.0.0.0", help="Host to run the server on.")
    parser.add_argument("--device", type=str, default="cuda", help="Device type to run the model on (cuda or cpu).")
    parser.add_argument("--use_distilled", action="store_true", help="Use distilled models instead of base models.")
    parser.add_argument("--is_lazy_loading", action="store_true", help="Enable lazy loading of models.")
    return parser.parse_args()

# Run the server using Uvicorn
if __name__ == "__main__":
    args = parse_args()
    device_type = args.device
    use_distilled = args.use_distilled
    is_lazy_loading = args.is_lazy_loading

    # Initialize the model manager
    model_manager = ModelManager(device_type, use_distilled, is_lazy_loading)

    uvicorn.run(app, host=args.host, port=args.port, log_level="info")