import gradio as gr
import os
import requests
import json
import logging
from pydub import AudioSegment
from pydub.playback import play
from mistralai import Mistral
from dotenv import load_dotenv

from transformers import AutoModelForCausalLM, AutoTokenizer, AutoModelForSeq2SeqLM
import gradio as gr
import torch
from IndicTransToolkit import IndicProcessor
import spaces
from parler_tts import ParlerTTSForConditionalGeneration
import soundfile as sf



# Load the model and tokenizer for the causal language model
model_name = "Qwen/Qwen2.5-1.5B-Instruct"

model = AutoModelForCausalLM.from_pretrained(
    model_name,
    torch_dtype="auto",
    device_map="auto"
)

tokenizer = AutoTokenizer.from_pretrained(model_name)

# Load the translation models and tokenizers
DEVICE = "cuda" if torch.cuda.is_available() else "cpu"
src_lang, tgt_lang = "eng_Latn", "kan_Knda"
model_name_trans_indic_en = "ai4bharat/indictrans2-indic-en-dist-200M"
model_name_trans_en_indic = "ai4bharat/indictrans2-en-indic-dist-200M"

tokenizer_trans_indic_en = AutoTokenizer.from_pretrained(model_name_trans_indic_en, trust_remote_code=True)
model_trans_indic_en = AutoModelForSeq2SeqLM.from_pretrained(
    model_name_trans_indic_en,
    trust_remote_code=True,
    torch_dtype=torch.float16,  # performance might slightly vary for bfloat16
    attn_implementation="flash_attention_2",
    device_map="auto"
)

tokenizer_trans_en_indic = AutoTokenizer.from_pretrained(model_name_trans_en_indic, trust_remote_code=True)
model_trans_en_indic = AutoModelForSeq2SeqLM.from_pretrained(
    model_name_trans_en_indic,
    trust_remote_code=True,
    torch_dtype=torch.float16,  # performance might slightly vary for bfloat16
    attn_implementation="flash_attention_2",
    device_map="auto"
)

ip = IndicProcessor(inference=True)
@spaces.GPU
def generate_response(prompt):
    messages = [
        {"role": "system", "content": "You are Dhwani, built for Indian languages. You are a helpful assistant. Provide a concise response in one sentence maximum to the user's query."},
        {"role": "user", "content": prompt}
    ]

    print(prompt)
    text = tokenizer.apply_chat_template(
        messages,
        tokenize=False,
        add_generation_prompt=True
    )
    model_inputs = tokenizer([text], return_tensors="pt").to(model.device)

    generated_ids = model.generate(
        **model_inputs,
        max_new_tokens=512
    )
    generated_ids = [
        output_ids[len(input_ids):] for input_ids, output_ids in zip(model_inputs.input_ids, generated_ids)
    ]

    response = tokenizer.batch_decode(generated_ids, skip_special_tokens=True)[0]
    return response

@spaces.GPU
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
    ).to(DEVICE)

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

    print('translation- input')
    print(text)

    print('translation - output')
    print(translations[0])
    return translations[0]

def send_llm(query):
    translated_query = translate_text(query, src_lang='kan_Knda', tgt_lang='eng_Latn')

    query_answer = generate_response(translated_query)

    translated_answer = translate_text(query_answer, src_lang='eng_Latn', tgt_lang='kan_Knda')

    return translated_answer


# Load environment variables from .env file
load_dotenv()

# Set up logging
logging.basicConfig(filename='execution.log', level=logging.INFO,
                    format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Load configuration from config.json
with open('config.json', 'r') as config_file:
    config = json.load(config_file)

# Mapping of user-friendly language names to language IDs
language_mapping = {
    "Assamese": "asm_Beng",
    "Bengali": "ben_Beng",
    "Bodo": "brx_Deva",
    "Dogri": "doi_Deva",
    "English": "eng_Latn",
    "Gujarati": "guj_Gujr",
    "Hindi": "hin_Deva",
    "Kannada": "kan_Knda",
    "Kashmiri (Arabic)": "kas_Arab",
    "Kashmiri (Devanagari)": "kas_Deva",
    "Konkani": "gom_Deva",
    "Malayalam": "mal_Mlym",
    "Manipuri (Bengali)": "mni_Beng",
    "Manipuri (Meitei)": "mni_Mtei",
    "Maithili": "mai_Deva",
    "Marathi": "mar_Deva",
    "Nepali": "npi_Deva",
    "Odia": "ory_Orya",
    "Punjabi": "pan_Guru",
    "Sanskrit": "san_Deva",
    "Santali": "sat_Olck",
    "Sindhi (Arabic)": "snd_Arab",
    "Sindhi (Devanagari)": "snd_Deva",
    "Tamil": "tam_Taml",
    "Telugu": "tel_Telu",
    "Urdu": "urd_Arab"
}


# Load voice descriptions from JSON file
def load_voice_descriptions(file_path):
    try:
        with open(file_path, 'r') as file:
            return json.load(file)
    except FileNotFoundError:
        logger.error(f"File not found: {file_path}")
        return []
    except json.JSONDecodeError as e:
        logger.error(f"Failed to parse JSON: {e}")
        return []

# Initialize the model and tokenizers
device_tts = "cuda:0" if torch.cuda.is_available() else "cpu"
model_tts = ParlerTTSForConditionalGeneration.from_pretrained("ai4bharat/indic-parler-tts").to(device_tts)
tokenizer_tts = AutoTokenizer.from_pretrained("ai4bharat/indic-parler-tts")
description_tokenizer_tts = AutoTokenizer.from_pretrained(model_tts.config.text_encoder._name_or_path)


# Function to generate audio locally
@spaces.GPU
def generate_audio_locally(input_text, voice_description_id):
    try:
        # Find the selected voice description
        selected_description = next((desc for desc in voice_descriptions if desc['userdomain_voice'] == voice_description_id), None)

        if selected_description:
            voice_description = selected_description['voice_description']
            output_file_name = selected_description['output_file_name']
        else:
            logger.error(f"Voice description not found for ID: {voice_description_id}")
            return f"Error: Voice description not found"

        # Prepare the input
        description_input_ids = description_tokenizer_tts(voice_description, return_tensors="pt").to(device_tts)
        prompt_input_ids = tokenizer_tts(input_text, return_tensors="pt").to(device_tts)
        # Generate the audio
        generation = model_tts.generate(
            input_ids=description_input_ids.input_ids,
            attention_mask=description_input_ids.attention_mask,
            prompt_input_ids=prompt_input_ids.input_ids,
            prompt_attention_mask=prompt_input_ids.attention_mask
        )

        audio_arr = generation.cpu().numpy().squeeze()

        # Save the audio file
        sf.write(output_file_name, audio_arr, model.config.sampling_rate)
        logger.info(f"Audio file saved to: {output_file_name}")

        # Return the path to the saved audio file
        return output_file_name
    except Exception as e:
        logger.error(f"Error generating audio: {e}")
        return f"Error: {e}"

# Load voice descriptions from JSON file
voice_descriptions = load_voice_descriptions('voice_description_indian.json')

# Extract IDs and descriptions for dropdown menu
dropdown_choices = [(desc['userdomain_voice'], f"{desc['userdomain_voice']}: {desc['voice_description'][:50]}...") for desc in voice_descriptions]


def get_endpoint(use_gpu, use_localhost, service_type):
    logging.info(f"Getting endpoint for service: {service_type}, use_gpu: {use_gpu}, use_localhost: {use_localhost}")
    device_type_ep = "" if use_gpu else "-cpu"
    if use_localhost:
        base_url = f'http://localhost:{config["endpoints"][service_type]["localhost"]}'
    else:
        base_url = f'{os.getenv("REMOTE_ENDPOINT")}{device_type_ep}'
    logging.info(f"Endpoint for {service_type}: {base_url}")
    return base_url

def transcribe_audio(audio_path, use_gpu, use_localhost):
    logging.info(f"Transcribing audio from {audio_path}, use_gpu: {use_gpu}, use_localhost: {use_localhost}")
    base_url = 'https://gaganyatri-asr-indic-server-cpu.hf.space'
    url = f'{base_url}/transcribe/?language=kannada'
    files = {'file': open(audio_path, 'rb')}
    api_token = os.getenv("API_TOKEN")
    headers = {"Authorization": f"Bearer {api_token}"}
    try:
        response = requests.post(url, files=files, headers=headers)
        response.raise_for_status()
        transcription = response.json()
        logging.info(f"Transcription successful: {transcription}")
        return transcription.get('text', '')
    except requests.exceptions.RequestException as e:
        logging.error(f"Transcription failed: {e}")
        return ""

def get_audio(input_text, voice_description=config["voice_description"]):
    try:
        # Define the API endpoint and headers
        url = f'{os.getenv("REMOTE_ENDPOINT")}/v1/audio/speech'
        api_token = os.getenv("HF_TOKEN")
        headers = {
            "accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": f"Bearer {api_token}"
        }
        # Define the request payload
        payload = {
            "input": input_text,
            "voice": voice_description
        }
        # Send the POST request
        response = requests.post(url, json=payload, headers=headers, stream=True)
        # Check if the request was successful
        if response.status_code == 200:
            logger.info(f"API request successful. Status code: {response.status_code}")
            # Save the audio file
            audio_file_path = "output_audio.mp3"
            with open(audio_file_path, "wb") as audio_file:
                for chunk in response.iter_content(chunk_size=1024):
                    if chunk:
                        audio_file.write(chunk)
            logger.info(f"Audio file saved to: {audio_file_path}")
            # Return the path to the saved audio file
            return audio_file_path
        else:
            logger.error(f"API request failed. Status code: {response.status_code}, {response.text}")
            return f"Error: {response.status_code}, {response.text}"
    except requests.exceptions.RequestException as e:
        logger.error(f"Request exception: {e}")
        return f"Request error: {e}"
    except Exception as e:
        logger.error(f"General exception: {e}")
        return f"Error: {e}"

# Create the Gradio interface
with gr.Blocks(title="Dhwani - Voice AI for Kannada /ಕನ್ನಡಕ್ಕಾಗಿ ಧ್ವನಿ AI ") as demo:
    gr.Markdown("# Voice AI for Kannada")
    gr.Markdown("Record your voice and get your answer in Kannada/ ನಿಮ್ಮ ಧ್ವನಿಯನ್ನು ರೆಕಾರ್ಡ್ ಮಾಡಿ ಮತ್ತು ನಿಮ್ಮ ಉತ್ತರವನ್ನು ಕನ್ನಡದಲ್ಲಿ ಪಡೆಯಿರಿ")
    gr.Markdown("Click on Recording button, to ask your question / ನಿಮ್ಮ ಪ್ರಶ್ನೆಯನ್ನು ಕೇಳಲು ರೆಕಾರ್ಡಿಂಗ್ ಬಟನ್ ಮೇಲೆ ಕ್ಲಿಕ್ ಮಾಡಿ")
    gr.Markdown("Click on stop recording button, to submit your question/ ನಿಮ್ಮ ಪ್ರಶ್ನೆಯನ್ನು ಸಲ್ಲಿಸಲು ರೆಕಾರ್ಡಿಂಗ್ ನಿಲ್ಲಿಸು ಬಟನ್ ಮೇಲೆ ಕ್ಲಿಕ್ ಮಾಡಿ")

    audio_input = gr.Microphone(type="filepath", label="Record your voice")
    audio_output = gr.Audio(type="filepath", label="Playback", interactive=False)
    transcription_output = gr.Textbox(label="Transcription Result", interactive=False)
    mistral_output = gr.Textbox(label="Dhwani answer/ ಉತ್ತರ", interactive=False)
    tts_output = gr.Audio(label="Generated Audio", interactive=False)

    enable_tts_checkbox = gr.Checkbox(label="Enable Text-to-Speech", value=True, interactive=False, visible=False)
    use_gpu_checkbox = gr.Checkbox(label="Use GPU", value=True, interactive=True, visible=False)
    use_localhost_checkbox = gr.Checkbox(label="Use Localhost", value=False, interactive=False, visible=False)

    
    voice_dropdown = gr.Dropdown(
        choices=[choice[0] for choice in dropdown_choices],
        label="Select Voice Description",
        type="value",
        value=dropdown_choices[0][0] if dropdown_choices else None,
        interactive=True,
    )

    voice_description = gr.Textbox(value="Anu speaks with a high pitch at a normal pace in a clear, close-sounding environment. Her neutral tone is captured with excellent audio quality.", label="Voice Description", interactive=False, visible=False)

    def process_audio(audio_path, use_gpu, use_localhost):
        logging.info(f"Processing audio from {audio_path}, use_gpu: {use_gpu}, use_localhost: {use_localhost}")
        transcription = transcribe_audio(audio_path, use_gpu, use_localhost)
        return transcription

    def on_transcription_complete(transcription, voice_dropdown, enable_tts):
        mistral_response = send_llm(transcription)
        ''''''
        if enable_tts:
            audio_file_path = None
            audio_file_path = generate_audio_locally(mistral_response, voice_dropdown)
        else:
            audio_file_path = None
        return mistral_response, audio_file_path

    audio_input.stop_recording(
        fn=process_audio,
        inputs=[audio_input, use_gpu_checkbox, use_localhost_checkbox],
        outputs=transcription_output
    )

    transcription_output.change(
        fn=on_transcription_complete,
        inputs=[transcription_output, voice_dropdown, enable_tts_checkbox],
        outputs=[mistral_output, tts_output]
    )

# Launch the interface
demo.launch()