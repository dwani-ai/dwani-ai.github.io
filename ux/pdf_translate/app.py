import gradio as gr
import os
import requests
import json
import logging
from PyPDF2 import PdfReader
from mistralai import Mistral

# Set up logging
logging.basicConfig(filename='execution.log', level=logging.INFO,
                    format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

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

def get_endpoint(use_gpu, use_localhost, service_type):
    logging.info(f"Getting endpoint for service: {service_type}, use_gpu: {use_gpu}, use_localhost: {use_localhost}")
    device_type_ep = "" if use_gpu else "-cpu"
    if use_localhost:
        port_mapping = {
            "asr": 10860,
            "translate": 8860,
            "tts": 9860  # Added TTS service port
        }
        base_url = f'http://localhost:{port_mapping[service_type]}'
    else:
        base_url = f'https://gaganyatri-{service_type}-indic-server{device_type_ep}.hf.space'
    logging.info(f"Endpoint for {service_type}: {base_url}")
    return base_url

def extract_text_from_pdf(pdf_path):
    logging.info(f"Extracting text from PDF: {pdf_path}")
    try:
        reader = PdfReader(pdf_path)
        text = ""
        for page in reader.pages:
            text += page.extract_text() + "\n"
        logging.info(f"Text extraction successful: {text}")
        return text
    except Exception as e:
        logging.error(f"Text extraction failed: {e}")
        return ""

def translate_text(transcription, src_lang, tgt_lang, use_gpu=False, use_localhost=False):
    logging.info(f"Translating text: {transcription}, src_lang: {src_lang}, tgt_lang: {tgt_lang}, use_gpu: {use_gpu}, use_localhost: {use_localhost}")
    base_url = get_endpoint(use_gpu, use_localhost, "translate")
    device_type = "cuda" if use_gpu else "cpu"
    url = f'{base_url}/translate?src_lang={src_lang}&tgt_lang={tgt_lang}&device_type={device_type}'
    headers = {
        'accept': 'application/json',
        'Content-Type': 'application/json'
    }
    data = {
        "sentences": [transcription],
        "src_lang": src_lang,
        "tgt_lang": tgt_lang
    }
    try:
        response = requests.post(url, headers=headers, data=json.dumps(data))
        response.raise_for_status()
        logging.info(f"Translation successful: {response.json()}")
        return response.json()
    except requests.exceptions.RequestException as e:
        logging.error(f"Translation failed: {e}")
        return {"translations": [""]}

def get_audio(input_text, voice_description="Anu speaks with a high pitch at a normal pace in a clear, close-sounding environment. Her neutral tone is captured with excellent audio quality."):
    try:
        # Define the API endpoint and headers
        url = "https://gaganyatri-tts-indic-server.hf.space/v1/audio/speech"  # Note: Added http://
        headers = {
            "accept": "application/json",
            "Content-Type": "application/json"
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

def send_to_mistral(translated_text):
    api_key = os.environ["MISTRAL_API_KEY"]
    model = "mistral-large-latest"
    client = Mistral(api_key=api_key)
    chat_response = client.chat.complete(
        model=model,
        messages=[
            {
                "role": "user",
                "content": translated_text,
            },
        ]
    )
    return chat_response.choices[0].message.content

# Create the Gradio interface
with gr.Blocks(title="Dhwani - PDF to Text Translation") as demo:
    gr.Markdown("# PDF to Text Translation")
    gr.Markdown("Upload a PDF file and translate its text to your required Indian Language")

    translate_src_language = gr.Dropdown(
        choices=list(language_mapping.keys()),
        label="Source Language - Fixed",
        value="Kannada",
        interactive=False
    )
    translate_tgt_language = gr.Dropdown(
        choices=list(language_mapping.keys()),
        label="Target Language",
        value="English"
    )
    pdf_input = gr.File(type="filepath", file_types=[".pdf"], label="Upload PDF file")
    transcription_output = gr.Textbox(label="Extracted Text", interactive=False)
    translation_output = gr.Textbox(label="Translated Text", interactive=False)
    mistral_output = gr.Textbox(label="Mistral API Response", interactive=False)
    tts_output = gr.Audio(label="Generated Audio", interactive=False)
    voice_description = gr.Textbox(
        label="Voice Description",
        placeholder="A female speaker delivers a slightly expressive and animated speech with a moderate speed and pitch. The recording is of very high quality, with the speakers voice sounding clear and very close up",
        lines=2,
    )
    enable_tts_checkbox = gr.Checkbox(label="Enable Text-to-Speech", value=False, interactive=False)
    use_gpu_checkbox = gr.Checkbox(label="Use GPU", value=False, interactive=False)
    use_localhost_checkbox = gr.Checkbox(label="Use Localhost", value=False, interactive=False)

    def on_transcription_complete(transcription, src_lang, tgt_lang, use_gpu, use_localhost):
        src_lang_id = language_mapping[src_lang]
        tgt_lang_id = language_mapping[tgt_lang]
        logging.info(f"Transcription complete: {transcription}, src_lang: {src_lang_id}, tgt_lang: {tgt_lang_id}, use_gpu: {use_gpu}, use_localhost: {use_localhost}")
        translation = translate_text(transcription, src_lang_id, tgt_lang_id, use_gpu, use_localhost)
        translated_text = translation['translations'][0]
        return translated_text

    def process_pdf(pdf_path, use_gpu, use_localhost):
        logging.info(f"Processing PDF from {pdf_path}, use_gpu: {use_gpu}, use_localhost: {use_localhost}")
        transcription = extract_text_from_pdf(pdf_path)
        return transcription

    def reload_endpoint_info(use_gpu, use_localhost):
        logging.info(f"Reloading endpoint info, use_gpu: {use_gpu}, use_localhost: {use_localhost}")
        # This function can be used to reload or reconfigure endpoints if needed
        return

    def on_translation_complete(translated_text, voice_description, enable_tts):
        mistral_response = send_to_mistral(translated_text)
        if enable_tts:
            audio_file_path = get_audio(mistral_response, voice_description)
        else:
            audio_file_path = None
        return mistral_response, audio_file_path

    pdf_input.upload(
        fn=process_pdf,
        inputs=[pdf_input, use_gpu_checkbox, use_localhost_checkbox],
        outputs=transcription_output
    )

    transcription_output.change(
        fn=on_transcription_complete,
        inputs=[transcription_output, translate_src_language, translate_tgt_language, use_gpu_checkbox, use_localhost_checkbox],
        outputs=translation_output
    )

    translation_output.change(
        fn=on_translation_complete,
        inputs=[translation_output, voice_description, enable_tts_checkbox],
        outputs=[mistral_output, tts_output]
    )

    translate_tgt_language.change(
        fn=reload_endpoint_info,
        inputs=[use_gpu_checkbox, use_localhost_checkbox]
    )

# Launch the interface
demo.launch()