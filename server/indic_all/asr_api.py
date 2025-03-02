import torch
import nemo.collections.asr as nemo_asr
from fastapi import FastAPI, File, UploadFile, HTTPException, Query
from fastapi.responses import RedirectResponse
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from pydub import AudioSegment
import os
import tempfile
import subprocess
import asyncio
import io
import logging
from logging.handlers import RotatingFileHandler
from time import time
from typing import List
import argparse
import uvicorn

# Configure logging with log rotation
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        RotatingFileHandler("transcription_api.log", maxBytes=10*1024*1024, backupCount=5), # 10MB per file, keep 5 backup files
        logging.StreamHandler() # This will also print logs to the console
    ]
)

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

app = FastAPI()
asr_manager = ASRModelManager()

# Define the response model
class TranscriptionResponse(BaseModel):
    text: str

class BatchTranscriptionResponse(BaseModel):
    transcriptions: List[str]

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

            #with torch.amp.autocast('cuda', dtype=torch.bfloat16):
            #    rnnt_texts = asr_manager.model.transcribe(chunk_file_paths, batch_size=1, language_id=language_id)
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

@app.get("/")
async def home():
    return RedirectResponse(url="/docs")

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

            #with torch.amp.autocast('cuda', dtype=torch.bfloat16):
            #    rnnt_texts = asr_manager.model.transcribe(tmp_file_paths, batch_size=len(files), language_id=language_id)
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

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Run the FastAPI server for ASR.")
    parser.add_argument("--port", type=int, default=8888, help="Port to run the server on.")
    parser.add_argument("--language", type=str, default="kn", help="Default language for the ASR model.")
    parser.add_argument("--host", type=str, default="0.0.0.0", help="Host to run the server on.")
    parser.add_argument("--device", type=str, default="cuda", help="Device type to run the model on (cuda or cpu).")
    args = parser.parse_args()

    asr_manager = ASRModelManager(default_language=args.language, device_type=args.device)
    uvicorn.run(app, host=args.host, port=args.port)