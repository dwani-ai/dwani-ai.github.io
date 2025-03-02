import time
from contextlib import asynccontextmanager
from typing import Annotated, Any, OrderedDict,List
import zipfile
import soundfile as sf
import torch
from fastapi import Body, FastAPI, HTTPException, Response
from parler_tts import ParlerTTSForConditionalGeneration
from transformers import AutoTokenizer, AutoFeatureExtractor, set_seed
import numpy as np
from config import SPEED, ResponseFormat, config
from logger import logger
import uvicorn
import argparse
from fastapi.responses import RedirectResponse
import io
import zipfile
from fastapi.responses import StreamingResponse
from typing import List
import numpy as np
import soundfile as sf
import time
import os
import logging



# https://github.com/huggingface/parler-tts?tab=readme-ov-file#usage
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


class ModelManager:
    def __init__(self):
        self.model_tokenizer: OrderedDict[
            str, tuple[ParlerTTSForConditionalGeneration, AutoTokenizer]
        ] = OrderedDict()

    def load_model(
        self, model_name: str
    ) -> tuple[ParlerTTSForConditionalGeneration, AutoTokenizer]:
        logger.debug(f"Loading {model_name}...")
        start = time.perf_counter()
        model = ParlerTTSForConditionalGeneration.from_pretrained(model_name).to(  # type: ignore
            device,  # type: ignore
            dtype=torch_dtype,
        )
        tokenizer = AutoTokenizer.from_pretrained(model_name)
        description_tokenizer = AutoTokenizer.from_pretrained(model.config.text_encoder._name_or_path)

        logger.info(
            f"Loaded {model_name} and tokenizer in {time.perf_counter() - start:.2f} seconds"
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


model_manager = ModelManager()


@asynccontextmanager
async def lifespan(_: FastAPI):
    if not config.lazy_load_model:
        model_manager.get_or_load_model(config.model)
    yield


app = FastAPI(lifespan=lifespan)

'''
@app.get("/health")
def health() -> Response:
    return Response(status_code=200, content="OK")


@app.get("/v1/models", response_model=list[Model])
def get_models() -> list[Model]:
    models = list(huggingface_hub.list_models(model_name="parler-tts"))
    models = [
        Model(
            id=model.id,
            created=int(model.created_at.timestamp()),
            object="model",
            owned_by=model.id.split("/")[0],
        )
        for model in models
        if model.created_at is not None
    ]
    return models


@app.get("/v1/models/{model_name:path}", response_model=Model)
def get_model(model_name: str) -> Model:
    models = list(huggingface_hub.list_models(model_name=model_name))
    if len(models) == 0:
        raise HTTPException(status_code=404, detail="Model doesn't exist")
    exact_match: ModelInfo | None = None
    for model in models:
        if model.id == model_name:
            exact_match = model
            break
    if exact_match is None:
        raise HTTPException(
            status_code=404,
            detail=f"Model doesn't exist. Possible matches: {', '.join([model.id for model in models])}",
        )
    assert exact_match.created_at is not None
    return Model(
        id=exact_match.id,
        created=int(exact_match.created_at.timestamp()),
        object="model",
        owned_by=exact_match.id.split("/")[0],
    )

'''
from fastapi.responses import StreamingResponse
import io

@app.post("/v1/audio/speech")
async def generate_audio(
    input: Annotated[str, Body()] = config.input,
    voice: Annotated[str, Body()] = config.voice,
    model: Annotated[str, Body()] = config.model,
    response_format: Annotated[ResponseFormat, Body(include_in_schema=False)] = config.response_format,
    speed: Annotated[float, Body(include_in_schema=False)] = SPEED,
) -> StreamingResponse:
    tts, tokenizer, description_tokenizer = model_manager.get_or_load_model(model)
    if speed != SPEED:
        logger.warning(
            "Specifying speed isn't supported by this model. Audio will be generated with the default speed"
        )
    start = time.perf_counter()

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
        f"Took {time.perf_counter() - start:.2f} seconds to generate audio for {len(input.split())} words using {device_str.upper()}"
    )

    # Create an in-memory file
    audio_buffer = io.BytesIO()
    sf.write(audio_buffer, audio_arr, tts.config.sampling_rate, format=response_format)
    audio_buffer.seek(0)

    return StreamingResponse(audio_buffer, media_type=f"audio/{response_format}")

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


@app.post("/v1/audio/speech_batch")
async def generate_audio_batch(
    input: Annotated[List[str], Body()] = config.input,
    voice: Annotated[List[str], Body()] = config.voice,
    model: Annotated[str, Body(include_in_schema=False)] = config.model,
    response_format: Annotated[ResponseFormat, Body()] = config.response_format,
    speed: Annotated[float, Body(include_in_schema=False)] = SPEED,
) -> StreamingResponse:
    tts, tokenizer, description_tokenizer = model_manager.get_or_load_model(model)
    if speed != SPEED:
        logger.warning(
            "Specifying speed isn't supported by this model. Audio will be generated with the default speed"
        )
    start = time.perf_counter()

    length_of_input_text = len(input)

    # Set chunk size for text processing
    chunk_size = 15  # Adjust this value based on your needs

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
        f"Took {time.perf_counter() - start:.2f} seconds to generate audio"
    )

    return StreamingResponse(in_memory_zip, media_type="application/zip")

@app.get("/")
async def home():
    return RedirectResponse(url="/docs")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Run the FastAPI server for TTS.")
    parser.add_argument("--port", type=int, default=7860, help="Port to run the server on.")
    parser.add_argument("--host", type=str, default="0.0.0.0", help="Host to run the server on.")
    parser.add_argument("--device", type=str, default="cuda", help="Device type to run the model on (cuda or cpu).")
    args = parser.parse_args()

    #asr_manager = ASRModelManager(device_type=args.device)
    uvicorn.run(app, host=args.host, port=args.port)