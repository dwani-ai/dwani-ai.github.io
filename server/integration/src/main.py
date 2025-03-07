from fastapi import FastAPI, Request, HTTPException, Depends, status
from fastapi.responses import RedirectResponse
from fastapi.security import APIKeyHeader
from pydantic import BaseModel, field_validator
from pydantic_settings import BaseSettings
from transformers import AutoModelForCausalLM, AutoTokenizer, AutoModelForSeq2SeqLM, set_seed

import torch
import argparse
import logging
from slowapi import Limiter
from slowapi.util import get_remote_address
from IndicTransToolkit import IndicProcessor
import numpy as np

# Configuration Settings
class Settings(BaseSettings):
    model_name: str = "Qwen/Qwen2.5-3B-Instruct"
    max_tokens: int = 512
    host: str = "0.0.0.0"
    port: int = 7860
    log_level: str = "info"

settings = Settings()

# Setup logging
logging.basicConfig(level=settings.log_level.upper())
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="Dhwani API",
    description="AI Chat API supporting Indian languages",
    version="1.0.0"
)

# Rate limiting setup
limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter

# Model and tokenizer as global variables
model = None
tokenizer = None
model_trans_indic_en = None
tokenizer_trans_indic_en = None
model_trans_en_indic = None
tokenizer_trans_en_indic = None

# Device setup
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# Initialize IndicProcessor
ip = IndicProcessor(inference=True)

# Load the causal LM model and tokenizer
model = AutoModelForCausalLM.from_pretrained(
    settings.model_name,
    torch_dtype=torch.float16,
    device_map="auto",
    trust_remote_code=True,
    low_cpu_mem_usage=True
).to(device)
tokenizer = AutoTokenizer.from_pretrained(settings.model_name)

# Load the translation models and tokenizers
src_lang, tgt_lang = "eng_Latn", "kan_Knda"
model_name_trans_indic_en = "ai4bharat/indictrans2-indic-en-dist-200M"
model_name_trans_en_indic = "ai4bharat/indictrans2-en-indic-dist-200M"

tokenizer_trans_indic_en = AutoTokenizer.from_pretrained(model_name_trans_indic_en, trust_remote_code=True)
model_trans_indic_en = AutoModelForSeq2SeqLM.from_pretrained(
    model_name_trans_indic_en,
    trust_remote_code=True,
    torch_dtype=torch.float16,
    attn_implementation="flash_attention_2",
    device_map="auto"
)

tokenizer_trans_en_indic = AutoTokenizer.from_pretrained(model_name_trans_en_indic, trust_remote_code=True)
model_trans_en_indic = AutoModelForSeq2SeqLM.from_pretrained(
    model_name_trans_en_indic,
    trust_remote_code=True,
    torch_dtype=torch.float16,
    attn_implementation="flash_attention_2",
    device_map="auto"
)

logger.info("Models and tokenizers initialized successfully")

# Request and Response Models
class ChatRequest(BaseModel):
    prompt: str

    @field_validator('prompt')
    def prompt_must_be_valid(cls, v):
        if len(v) > 1000:
            raise ValueError("Prompt cannot exceed 1000 characters")
        return v.strip()

class ChatResponse(BaseModel):
    response: str

# API Key Authentication
API_KEY_NAME = "X-API-Key"
api_key_header = APIKeyHeader(name=API_KEY_NAME, auto_error=False)

async def get_api_key(api_key: str = Depends(api_key_header)):
    if api_key != "your-secure-api-key":  # Replace with env var in production
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid API Key"
        )
    return api_key

# Translation function
def translate_text(text, src_lang, tgt_lang):
    if src_lang == "kan_Knda" and tgt_lang == "eng_Latn":
        tokenizer_trans = tokenizer_trans_indic_en
        model_trans = model_trans_indic_en
    elif src_lang == "eng_Latn" and tgt_lang == "kan_Knda":
        tokenizer_trans = tokenizer_trans_en_indic
        model_trans = model_trans_en_indic
    else:
        raise ValueError("Unsupported language pair")

    batch = ip.preprocess_batch(
        [text],
        src_lang=src_lang,
        tgt_lang=tgt_lang,
    )
    inputs = tokenizer_trans(
        batch,
        truncation=True,
        padding="longest",
        return_tensors="pt",
        return_attention_mask=True,
    ).to(device)

    with torch.no_grad():
        generated_tokens = model_trans.generate(
            **inputs,
            use_cache=True,
            min_length=0,
            max_length=256,
            num_beams=5,
            num_return_sequences=1,
        )

    with tokenizer_trans.as_target_tokenizer():
        generated_tokens = tokenizer_trans.batch_decode(
            generated_tokens.detach().cpu().tolist(),
            skip_special_tokens=True,
            clean_up_tokenization_spaces=True,
        )

    translations = ip.postprocess_batch(generated_tokens, lang=tgt_lang)
    return translations[0]

# Health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "healthy", "model": settings.model_name}

# Home redirect
@app.get("/")
async def home():
    return RedirectResponse(url="/docs")


# Define a function to split text into smaller chunks
def chunk_text(text, chunk_size):
    words = text.split()
    chunks = []
    for i in range(0, len(words), chunk_size):
        chunks.append(' '.join(words[i:i + chunk_size]))
    return chunks

from fastapi.responses import RedirectResponse, JSONResponse, StreamingResponse
from typing import List, Dict, OrderedDict, Annotated, Any
from fastapi import FastAPI, File, UploadFile, HTTPException, Query, Depends, Body, HTTPException, Response
from tts_config import SPEED, ResponseFormat, config
from logger import logger
import shutil
import soundfile as sf
from parler_tts import ParlerTTSForConditionalGeneration
from time import time, perf_counter
torch_dtype = torch.float16 if device != "cpu" else torch.float32
import io

class TTSModelManager:
    def __init__(self):
        self.tts_model_tokenizer: OrderedDict[
            str, tuple[ParlerTTSForConditionalGeneration, AutoTokenizer]
        ] = OrderedDict()

    def load_model(
        self, tts_model_name: str
    ) -> tuple[ParlerTTSForConditionalGeneration, AutoTokenizer]:
        logger.debug(f"Loading {tts_model_name}...")
        start = perf_counter()
        tts_model = ParlerTTSForConditionalGeneration.from_pretrained(tts_model_name).to(
            device,
            dtype=torch_dtype,
        )
        tts_tokenizer = AutoTokenizer.from_pretrained(tts_model_name)
        tts_description_tokenizer = AutoTokenizer.from_pretrained(tts_model.config.text_encoder._name_or_path)
        logger.info(
            f"Loaded {tts_model_name} and tokenizer in {perf_counter() - start:.2f} seconds"
        )
        return tts_model, tts_tokenizer, tts_description_tokenizer

    def get_or_load_model(
        self, tts_model_name: str
    ) -> tuple[ParlerTTSForConditionalGeneration, Any]:
        if tts_model_name not in self.tts_model_tokenizer:
            logger.info(f"Model {tts_model_name} isn't already loaded")
            if len(self.tts_model_tokenizer) == config.max_models:
                logger.info("Unloading the oldest loaded model")
                del self.tts_model_tokenizer[next(iter(self.tts_model_tokenizer))]
            self.tts_model_tokenizer[tts_model_name] = self.load_model(tts_model_name)
        return self.tts_model_tokenizer[tts_model_name]

tts_model_manager = TTSModelManager()

@app.post("/v1/audio/speech")
async def generate_audio(
    input: Annotated[str, Body()] = config.input,
    voice: Annotated[str, Body()] = config.voice,
    model: Annotated[str, Body()] = config.model,
    response_format: Annotated[ResponseFormat, Body(include_in_schema=False)] = config.response_format,
    speed: Annotated[float, Body(include_in_schema=False)] = SPEED,
) -> StreamingResponse:
    tts_model, tts_tokenizer, tts_description_tokenizer = tts_model_manager.get_or_load_model(model)
    if speed != SPEED:
        logger.warning(
            "Specifying speed isn't supported by this model. Audio will be generated with the default speed"
        )
    start = perf_counter()

    chunk_size = 15
    all_chunks = chunk_text(input, chunk_size)

    if(len(all_chunks) <= chunk_size ):
        # Tokenize the voice description
        input_ids = tts_description_tokenizer(voice, return_tensors="pt").input_ids.to(device)

        # Tokenize the input text
        prompt_input_ids = tts_tokenizer(input, return_tensors="pt").input_ids.to(device)

        # Generate the audio
        generation = tts_model.generate(
            input_ids=input_ids, prompt_input_ids=prompt_input_ids
        ).to(torch.float32)
        audio_arr = generation.cpu().numpy().squeeze()
    else:
        all_descriptions = voice * len(all_chunks)
        description_inputs = tts_description_tokenizer(all_descriptions, return_tensors="pt", padding=True).to("cuda")
        prompts = tts_tokenizer(all_chunks, return_tensors="pt", padding=True).to("cuda")

        set_seed(0)
        generation = tts_model.generate(
            input_ids=description_inputs.input_ids,
            attention_mask=description_inputs.attention_mask,
            prompt_input_ids=prompts.input_ids,
            prompt_attention_mask=prompts.attention_mask,
            do_sample=True,
            return_dict_in_generate=True,
        )
        chunk_audios = []

        for i, audio in enumerate(generation.sequences):
            audio_data = audio[:generation.audios_length].cpu().numpy().squeeze()
            chunk_audios.append(audio_data)
        combined_audio = np.concatenate(chunk_audios)
        audio_arr = combined_audio
            

    # Ensure device is a string
    device_str = str(device)
    logger.info(
        f"Took {perf_counter() - start:.2f} seconds to generate audio for {len(input.split())} words using {device_str.upper()}"
    )
    # Create an in-memory file
    audio_buffer = io.BytesIO()
    sf.write(audio_buffer, audio_arr, tts_model.config.sampling_rate, format=response_format)
    audio_buffer.seek(0)
    return StreamingResponse(audio_buffer, media_type=f"audio/{response_format}")

@app.post("/chat", response_model=ChatResponse)
@limiter.limit("100/minute")
async def chat(request: Request, chat_request: ChatRequest, api_key: str = Depends(get_api_key)):
    logger.info(f"Received prompt: {chat_request.prompt}")
    try:
        prompt = chat_request.prompt
        if not prompt:
            raise HTTPException(status_code=400, detail="Prompt cannot be empty")

        # Step 1: Translate Kannada prompt to English
        translated_prompt = translate_text(prompt, src_lang="kan_Knda", tgt_lang="eng_Latn")
        logger.info(f"Translated prompt to English: {translated_prompt}")

        # Step 2: Generate LLM response in English
        messages = [
            {"role": "system", "content": "You are Dhwani, a helpful assistant. Provide a concise response in one sentence maximum to the user's query."},
            {"role": "user", "content": translated_prompt}
        ]
        
        text = tokenizer.apply_chat_template(
            messages,
            tokenize=False,
            add_generation_prompt=True
        )
        model_inputs = tokenizer([text], return_tensors="pt").to(device)

        generated_ids = model.generate(
            **model_inputs,
            max_new_tokens=settings.max_tokens,
            do_sample=True,
            temperature=0.7
        )
        generated_ids = [
            output_ids[len(input_ids):] for input_ids, output_ids in zip(model_inputs.input_ids, generated_ids)
        ]

        response = tokenizer.batch_decode(generated_ids, skip_special_tokens=True)[0]
        logger.info(f"Generated English response: {response}")

        # Step 3: Translate English response to Kannada
        translated_response = translate_text(response, src_lang="eng_Latn", tgt_lang="kan_Knda")
        logger.info(f"Translated response to Kannada: {translated_response}")

        return ChatResponse(response=translated_response)
        
    except Exception as e:
        logger.error(f"Error processing request: {str(e)}")
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")

# Main execution
if __name__ == "__main__":
    import uvicorn
    
    parser = argparse.ArgumentParser(description="Run the FastAPI server for ASR.")
    parser.add_argument("--port", type=int, default=settings.port, help="Port to run the server on.")
    parser.add_argument("--host", type=str, default=settings.host, help="Host to run the server on.")
    args = parser.parse_args()

    uvicorn.run(app, host=args.host, port=args.port)