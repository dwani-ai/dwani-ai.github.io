import torch
import nemo.collections.asr as nemo_asr
from fastapi import FastAPI, File, UploadFile, HTTPException, Query, Depends, Body, HTTPException, Response

from fastapi.responses import RedirectResponse, JSONResponse, StreamingResponse
from pydantic import BaseModel
from pydub import AudioSegment
import os
import tempfile
import subprocess
import io
import logging
from logging.handlers import RotatingFileHandler
from time import time, perf_counter
from typing import List, Dict, OrderedDict, Annotated, Any
import argparse
import uvicorn
from transformers import AutoModelForSeq2SeqLM, AutoTokenizer
from IndicTransToolkit import IndicProcessor
from contextlib import asynccontextmanager
import zipfile
import soundfile as sf
from parler_tts import ParlerTTSForConditionalGeneration
from transformers import AutoTokenizer, AutoFeatureExtractor, set_seed
import numpy as np
from tts_config import SPEED, ResponseFormat, config
from logger import logger

# Configure logging with log rotation
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        RotatingFileHandler("transcription_api.log", maxBytes=10*1024*1024, backupCount=5), # 10MB per file, keep 5 backup files
        logging.StreamHandler() # This will also print logs to the console
    ]
)

DEVICE = "cuda" if torch.cuda.is_available() else "cpu"


# ASR Model Manager
class ASRModelManager:
    def __init__(self, default_language="kn", device_type="cuda"):
        self.default_language = default_language
        self.device_type = device_type
        self.model_language = {
            "kannada": "kn",
            "hindi": "hi",
            "malayalam": "ml",
            "assamese": "as",
            "bengali": "bn",
            "bodo": "brx",
            "dogri": "doi",
            "gujarati": "gu",
            "kashmiri": "ks",
            "konkani": "kok",
            "maithili": "mai",
            "manipuri": "mni",
            "marathi": "mr",
            "nepali": "ne",
            "odia": "or",
            "punjabi": "pa",
            "sanskrit": "sa",
            "santali": "sat",
            "sindhi": "sd",
            "tamil": "ta",
            "telugu": "te",
            "urdu": "ur"
        }
        self.config_models = {
            "as": "ai4bharat/indicconformer_stt_as_hybrid_rnnt_large",
            "bn": "ai4bharat/indicconformer_stt_bn_hybrid_rnnt_large",
            "brx": "ai4bharat/indicconformer_stt_brx_hybrid_rnnt_large",
            "doi": "ai4bharat/indicconformer_stt_doi_hybrid_rnnt_large",
            "gu": "ai4bharat/indicconformer_stt_gu_hybrid_rnnt_large",
            "hi": "ai4bharat/indicconformer_stt_hi_hybrid_rnnt_large",
            "kn": "ai4bharat/indicconformer_stt_kn_hybrid_rnnt_large",
            "ks": "ai4bharat/indicconformer_stt_ks_hybrid_rnnt_large",
            "kok": "ai4bharat/indicconformer_stt_kok_hybrid_rnnt_large",
            "mai": "ai4bharat/indicconformer_stt_mai_hybrid_rnnt_large",
            "ml": "ai4bharat/indicconformer_stt_ml_hybrid_rnnt_large",
            "mni": "ai4bharat/indicconformer_stt_mni_hybrid_rnnt_large",
            "mr": "ai4bharat/indicconformer_stt_mr_hybrid_rnnt_large",
            "ne": "ai4bharat/indicconformer_stt_ne_hybrid_rnnt_large",
            "or": "ai4bharat/indicconformer_stt_or_hybrid_rnnt_large",
            "pa": "ai4bharat/indicconformer_stt_pa_hybrid_rnnt_large",
            "sa": "ai4bharat/indicconformer_stt_sa_hybrid_rnnt_large",
            "sat": "ai4bharat/indicconformer_stt_sat_hybrid_rnnt_large",
            "sd": "ai4bharat/indicconformer_stt_sd_hybrid_rnnt_large",
            "ta": "ai4bharat/indicconformer_stt_ta_hybrid_rnnt_large",
            "te": "ai4bharat/indicconformer_stt_te_hybrid_rnnt_large",
            "ur": "ai4bharat/indicconformer_stt_ur_hybrid_rnnt_large"
        }
        self.model = self.load_model(self.default_language)

    def load_model(self, language_id="kn"):
        model_name = self.config_models.get(language_id, self.config_models["kn"])
        
        model = nemo_asr.models.ASRModel.from_pretrained(model_name)
        

        device = torch.device(self.device_type if torch.cuda.is_available() and self.device_type == "cuda" else "cpu")
        model.freeze() # inference mode
        model = model.to(device) # transfer model to device

        return model

    def split_audio(self, file_path, chunk_duration_ms=15000):
        """
        Splits an audio file into chunks of specified duration if the audio duration exceeds the chunk duration.

        :param file_path: Path to the audio file.
        :param chunk_duration_ms: Duration of each chunk in milliseconds (default is 15000 ms or 15 seconds).
        """
        # Load the audio file
        audio = AudioSegment.from_file(file_path)

        # Get the duration of the audio in milliseconds
        duration_ms = len(audio)

        # Check if the duration is more than the specified chunk duration
        if duration_ms > chunk_duration_ms:
            # Calculate the number of chunks needed
            num_chunks = duration_ms // chunk_duration_ms
            if duration_ms % chunk_duration_ms != 0:
                num_chunks += 1

            # Split the audio into chunks
            chunks = [audio[i*chunk_duration_ms:(i+1)*chunk_duration_ms] for i in range(num_chunks)]

            # Create a directory to save the chunks
            output_dir = "audio_chunks"
            os.makedirs(output_dir, exist_ok=True)

            # Export each chunk to separate files
            chunk_file_paths = []
            for i, chunk in enumerate(chunks):
                chunk_file_path = os.path.join(output_dir, f"chunk_{i}.wav")
                chunk.export(chunk_file_path, format="wav")
                chunk_file_paths.append(chunk_file_path)
                print(f"Chunk {i} exported successfully to {chunk_file_path}.")

            return chunk_file_paths
        else:
            return [file_path]

# Translation Model Manager
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
            torch_dtype=torch.float16, # performance might slightly vary for bfloat16
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

# Initialize IndicProcessor
ip = IndicProcessor(inference=True)

# Initialize FastAPI app

# Initialize ASR and Translation Model Managers
asr_manager = ASRModelManager()
model_manager = ModelManager()

# Define the response models
class TranscriptionResponse(BaseModel):
    text: str

class BatchTranscriptionResponse(BaseModel):
    transcriptions: List[str]

class TranslationRequest(BaseModel):
    sentences: List[str]
    src_lang: str
    tgt_lang: str

class TranslationResponse(BaseModel):
    translations: List[str]

def get_translate_manager(src_lang: str, tgt_lang: str) -> TranslateManager:
    return model_manager.get_model(src_lang, tgt_lang)


# TTS Integration
if torch.cuda.is_available():
    device = "cuda:0"
    logger.info("GPU will be used for inference")
else:
    device = "cpu"
    logger.info("CPU will be used for inference")
torch_dtype = torch.float16 if device != "cpu" else torch.float32

# Check CUDA availability and version
cuda_available = torch.cuda.is_available()
cuda_version = torch.version.cuda if cuda_available else None
if torch.cuda.is_available():
    device = torch.cuda.current_device()
    capability = torch.cuda.get_device_capability(device)
    compute_capability_float = float(f"{capability[0]}.{capability[1]}")
    print(f"CUDA version: {cuda_version}")
    print(f"CUDA Compute Capability: {compute_capability_float}")
else:
    print("CUDA is not available on this system.")

class TTSModelManager:
    def __init__(self):
        self.model_tokenizer: OrderedDict[
            str, tuple[ParlerTTSForConditionalGeneration, AutoTokenizer]
        ] = OrderedDict()

    def load_model(
        self, model_name: str
    ) -> tuple[ParlerTTSForConditionalGeneration, AutoTokenizer]:
        logger.debug(f"Loading {model_name}...")
        start = perf_counter()
        model = ParlerTTSForConditionalGeneration.from_pretrained(model_name).to(
            device,
            dtype=torch_dtype,
        )
        tokenizer = AutoTokenizer.from_pretrained(model_name)
        description_tokenizer = AutoTokenizer.from_pretrained(model.config.text_encoder._name_or_path)
        logger.info(
            f"Loaded {model_name} and tokenizer in {perf_counter() - start:.2f} seconds"
        )
        return model, tokenizer, description_tokenizer

    def get_or_load_model(
        self, model_name: str
    ) -> tuple[ParlerTTSForConditionalGeneration, Any]:
        if model_name not in self.model_tokenizer:
            logger.info(f"Model {model_name} isn't already loaded")
            if len(self.model_tokenizer) == config.max_models:
                logger.info("Unloading the oldest loaded model")
                del self.model_tokenizer[next(iter(self.model_tokenizer))]
            self.model_tokenizer[model_name] = self.load_model(model_name)
        return self.model_tokenizer[model_name]

tts_model_manager = TTSModelManager()

@asynccontextmanager
async def lifespan(_: FastAPI):
    if not config.lazy_load_model:
        tts_model_manager.get_or_load_model(config.model)
    yield

app = FastAPI(lifespan=lifespan)

def create_in_memory_zip(file_data):
    in_memory_zip = io.BytesIO()
    with zipfile.ZipFile(in_memory_zip, 'w') as zipf:
        for file_name, data in file_data.items():
            zipf.writestr(file_name, data)
    in_memory_zip.seek(0)
    return in_memory_zip

# Define a function to split text into smaller chunks
def chunk_text(text, chunk_size):
    words = text.split()
    chunks = []
    for i in range(0, len(words), chunk_size):
        chunks.append(' '.join(words[i:i + chunk_size]))
    return chunks

@app.post("/v1/audio/speech")
async def generate_audio(
    input: Annotated[str, Body()] = config.input,
    voice: Annotated[str, Body()] = config.voice,
    model: Annotated[str, Body()] = config.model,
    response_format: Annotated[ResponseFormat, Body(include_in_schema=False)] = config.response_format,
    speed: Annotated[float, Body(include_in_schema=False)] = SPEED,
) -> StreamingResponse:
    tts, tokenizer, description_tokenizer = tts_model_manager.get_or_load_model(model)
    if speed != SPEED:
        logger.warning(
            "Specifying speed isn't supported by this model. Audio will be generated with the default speed"
        )
    start = perf_counter()
    # Tokenize the voice description
    input_ids = description_tokenizer(voice, return_tensors="pt").input_ids.to(device)
    # Tokenize the input text
    prompt_input_ids = tokenizer(input, return_tensors="pt").input_ids.to(device)
    # Generate the audio
    generation = tts.generate(
        input_ids=input_ids, prompt_input_ids=prompt_input_ids
    ).to(torch.float32)
    audio_arr = generation.cpu().numpy().squeeze()
    # Ensure device is a string
    device_str = str(device)
    logger.info(
        f"Took {perf_counter() - start:.2f} seconds to generate audio for {len(input.split())} words using {device_str.upper()}"
    )
    # Create an in-memory file
    audio_buffer = io.BytesIO()
    sf.write(audio_buffer, audio_arr, tts.config.sampling_rate, format=response_format)
    audio_buffer.seek(0)
    return StreamingResponse(audio_buffer, media_type=f"audio/{response_format}")

@app.post("/v1/audio/speech_batch")
async def generate_audio_batch(
    input: Annotated[List[str], Body()] = config.input,
    voice: Annotated[List[str], Body()] = config.voice,
    model: Annotated[str, Body(include_in_schema=False)] = config.model,
    response_format: Annotated[ResponseFormat, Body()] = config.response_format,
    speed: Annotated[float, Body(include_in_schema=False)] = SPEED,
) -> StreamingResponse:
    tts, tokenizer, description_tokenizer = tts_model_manager.get_or_load_model(model)
    if speed != SPEED:
        logger.warning(
            "Specifying speed isn't supported by this model. Audio will be generated with the default speed"
        )
    start = perf_counter()
    length_of_input_text = len(input)
    # Set chunk size for text processing
    chunk_size = 15 # Adjust this value based on your needs
    # Prepare inputs for the model
    all_chunks = []
    all_descriptions = []
    for i, text in enumerate(input):
        chunks = chunk_text(text, chunk_size)
        all_chunks.extend(chunks)
        all_descriptions.extend([voice[i]] * len(chunks))
    description_inputs = description_tokenizer(all_descriptions, return_tensors="pt", padding=True).to("cuda")
    prompts = tokenizer(all_chunks, return_tensors="pt", padding=True).to("cuda")
    set_seed(0)
    generation = tts.generate(
        input_ids=description_inputs.input_ids,
        attention_mask=description_inputs.attention_mask,
        prompt_input_ids=prompts.input_ids,
        prompt_attention_mask=prompts.attention_mask,
        do_sample=True,
        return_dict_in_generate=True,
    )
    # Concatenate audio outputs
    audio_outputs = []
    current_index = 0
    for i, text in enumerate(input):
        chunks = chunk_text(text, chunk_size)
        chunk_audios = []
        for j in range(len(chunks)):
            audio_arr = generation.sequences[current_index][:generation.audios_length[current_index]].cpu().numpy().squeeze()
            audio_arr = audio_arr.astype('float32')
            chunk_audios.append(audio_arr)
            current_index += 1
        combined_audio = np.concatenate(chunk_audios)
        audio_outputs.append(combined_audio)
    # Save the final audio outputs in memory
    file_data = {}
    for i, audio in enumerate(audio_outputs):
        file_name = f"out_{i}.{response_format}"
        audio_bytes = io.BytesIO()
        sf.write(audio_bytes, audio, tts.config.sampling_rate, format=response_format)
        audio_bytes.seek(0)
        file_data[file_name] = audio_bytes.read()
    # Create in-memory zip file
    in_memory_zip = create_in_memory_zip(file_data)
    logger.info(
        f"Took {perf_counter() - start:.2f} seconds to generate audio"
    )
    return StreamingResponse(in_memory_zip, media_type="application/zip")


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

@app.post("/transcribe/", response_model=TranscriptionResponse)
async def transcribe_audio(file: UploadFile = File(...), language: str = Query(..., enum=list(asr_manager.model_language.keys()))):
    start_time = time()
    try:
        # Check file extension
        file_extension = file.filename.split(".")[-1].lower()
        if file_extension not in ["wav", "mp3"]:
            logging.warning(f"Unsupported file format: {file_extension}")
            raise HTTPException(status_code=400, detail="Unsupported file format. Please upload a WAV or MP3 file.")

        # Read the file content
        file_content = await file.read()

        # Convert MP3 to WAV if necessary
        if file_extension == "mp3":
            audio = AudioSegment.from_mp3(io.BytesIO(file_content))
        else:
            audio = AudioSegment.from_wav(io.BytesIO(file_content))

        # Check the sample rate of the WAV file
        sample_rate = audio.frame_rate

        # Convert WAV to the required format using ffmpeg if necessary
        if sample_rate != 16000:
            audio = audio.set_frame_rate(16000).set_channels(1)

        # Export the audio to a temporary WAV file
        with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as tmp_file:
            audio.export(tmp_file.name, format="wav")
            tmp_file_path = tmp_file.name

        # Split the audio if necessary
        chunk_file_paths = asr_manager.split_audio(tmp_file_path)

        try:
            # Transcribe the audio
            language_id = asr_manager.model_language.get(language, asr_manager.default_language)

            if language_id != asr_manager.default_language:
                asr_manager.model = asr_manager.load_model(language_id)
                asr_manager.default_language = language_id

            asr_manager.model.cur_decoder = "rnnt"

            rnnt_texts = asr_manager.model.transcribe(chunk_file_paths, batch_size=1, language_id=language_id)

            # Flatten the list of transcriptions
            rnnt_text = " ".join([text for sublist in rnnt_texts for text in sublist])

            end_time = time()
            logging.info(f"Transcription completed in {end_time - start_time:.2f} seconds")
            return JSONResponse(content={"text": rnnt_text})
        except subprocess.CalledProcessError as e:
            logging.error(f"FFmpeg conversion failed: {str(e)}")
            raise HTTPException(status_code=500, detail=f"FFmpeg conversion failed: {str(e)}")
        except Exception as e:
            logging.error(f"An error occurred during processing: {str(e)}")
            raise HTTPException(status_code=500, detail=f"An error occurred during processing: {str(e)}")
        finally:
            # Clean up temporary files
            for chunk_file_path in chunk_file_paths:
                if os.path.exists(chunk_file_path):
                    os.remove(chunk_file_path)
    except HTTPException as e:
        logging.error(f"HTTPException: {str(e)}")
        raise e
    except Exception as e:
        logging.error(f"An unexpected error occurred: {str(e)}")
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred: {str(e)}")

@app.post("/transcribe_batch/", response_model=BatchTranscriptionResponse)
async def transcribe_audio_batch(files: List[UploadFile] = File(...), language: str = Query(..., enum=list(asr_manager.model_language.keys()))):
    start_time = time()
    tmp_file_paths = []
    transcriptions = []
    try:
        for file in files:
            # Check file extension
            file_extension = file.filename.split(".")[-1].lower()
            if file_extension not in ["wav", "mp3"]:
                logging.warning(f"Unsupported file format: {file_extension}")
                raise HTTPException(status_code=400, detail="Unsupported file format. Please upload WAV or MP3 files.")

            # Read the file content
            file_content = await file.read()

            # Convert MP3 to WAV if necessary
            if file_extension == "mp3":
                audio = AudioSegment.from_mp3(io.BytesIO(file_content))
            else:
                audio = AudioSegment.from_wav(io.BytesIO(file_content))

            # Check the sample rate of the WAV file
            sample_rate = audio.frame_rate

            # Convert WAV to the required format using ffmpeg if necessary
            if sample_rate != 16000:
                audio = audio.set_frame_rate(16000).set_channels(1)

            # Export the audio to a temporary WAV file
            with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as tmp_file:
                audio.export(tmp_file.name, format="wav")
                tmp_file_path = tmp_file.name

            # Split the audio if necessary
            chunk_file_paths = asr_manager.split_audio(tmp_file_path)
            tmp_file_paths.extend(chunk_file_paths)

        logging.info(f"Temporary file paths: {tmp_file_paths}")
        try:
            # Transcribe the audio files in batch
            language_id = asr_manager.model_language.get(language, asr_manager.default_language)

            if language_id != asr_manager.default_language:
                asr_manager.model = asr_manager.load_model(language_id)
                asr_manager.default_language = language_id

            asr_manager.model.cur_decoder = "rnnt"

            rnnt_texts = asr_manager.model.transcribe(tmp_file_paths, batch_size=len(files), language_id=language_id)

            logging.info(f"Raw transcriptions from model: {rnnt_texts}")
            end_time = time()
            logging.info(f"Transcription completed in {end_time - start_time:.2f} seconds")

            # Flatten the list of transcriptions
            transcriptions = [text for sublist in rnnt_texts for text in sublist]
        except subprocess.CalledProcessError as e:
            logging.error(f"FFmpeg conversion failed: {str(e)}")
            raise HTTPException(status_code=500, detail=f"FFmpeg conversion failed: {str(e)}")
        except Exception as e:
            logging.error(f"An error occurred during processing: {str(e)}")
            raise HTTPException(status_code=500, detail=f"An error occurred during processing: {str(e)}")
        finally:
            # Clean up temporary files
            for tmp_file_path in tmp_file_paths:
                if os.path.exists(tmp_file_path):
                    os.remove(tmp_file_path)
    except HTTPException as e:
        logging.error(f"HTTPException: {str(e)}")
        raise e
    except Exception as e:
        logging.error(f"An unexpected error occurred: {str(e)}")
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred: {str(e)}")

    return JSONResponse(content={"transcriptions": transcriptions})


@app.get("/")
async def home():
    return RedirectResponse(url="/docs")

# Function to parse command-line arguments
def parse_args():
    parser = argparse.ArgumentParser(description="Translation Server")
    parser.add_argument("--port", type=int, default=7860, help="Port to run the server on.")
    parser.add_argument("--host", type=str, default="0.0.0.0", help="Host to run the server on.")
    parser.add_argument("--device", type=str, default="cuda", help="Device type to run the model on (cuda or cpu).")
    parser.add_argument("--use_distilled", action="store_true", help="Use distilled models instead of base models.")
    parser.add_argument("--is_lazy_loading", action="store_true", help="Enable lazy loading of models.")
    parser.add_argument("--asr_language", type=str, default="kn", help="Default language for the ASR model.")
    return parser.parse_args()

# Run the server using Uvicorn
if __name__ == "__main__":
    args = parse_args()
    device_type = args.device
    use_distilled = args.use_distilled
    is_lazy_loading = args.is_lazy_loading

    # Initialize the model managers
    #asr_manager = ASRModelManager(default_language=args.asr_language, device_type=device_type)
    model_manager = ModelManager(device_type, use_distilled, is_lazy_loading)

    uvicorn.run(app, host=args.host, port=args.port, log_level="info")