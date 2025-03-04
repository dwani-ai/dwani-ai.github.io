import gradio as gr
import os
import requests
import json
import logging
from mistralai import Mistral

# Set up logging
logging.basicConfig(filename='execution.log', level=logging.INFO,
                    format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

def chunk_text(text, chunk_size):
    words = text.split()
    chunks = []
    for i in range(0, len(words), chunk_size):
        chunks.append(' '.join(words[i:i + chunk_size]))
    return chunks

def get_endpoint(use_gpu, use_localhost, service_type):
    logging.info(f"Getting endpoint for service: {service_type}, use_gpu: {use_gpu}, use_localhost: {use_localhost}")
    device_type_ep = "" if use_gpu else "-cpu"
    if use_localhost:
        port_mapping = {
            "asr": 10860,
            "translate": 8860,
            "tts": 9860  # Added TTS service port
        }
        base_url = f'http://localhost:7860'
    else:
        base_url = f'https://gaganyatri-translate-indic-server-cpu.hf.space'
    logging.info(f"Endpoint for {service_type}: {base_url}")
    return base_url

def translate_text(transcription, src_lang, tgt_lang, use_gpu=False, use_localhost=False):
    logging.info(f"Translating text: {transcription}, src_lang: {src_lang}, tgt_lang: {tgt_lang}, use_gpu: {use_gpu}, use_localhost: {use_localhost}")
    base_url = get_endpoint(use_gpu, use_localhost, "translate")
    device_type = "cuda" if use_gpu else "cpu"
    url = f'{base_url}/translate?src_lang={src_lang}&tgt_lang={tgt_lang}&device_type={device_type}'
    headers = {
        'accept': 'application/json',
        'Content-Type': 'application/json'
    }

    chunk_size = 15
    chunked_text = chunk_text(transcription, chunk_size=chunk_size)

    data = {
        "sentences": chunked_text,
        "src_lang": src_lang,
        "tgt_lang": tgt_lang
    }
    try:
        response = requests.post(url, headers=headers, data=json.dumps(data))
        response.raise_for_status()
        logging.info(f"Translation successful: {response.json()}")

        translated_texts = response.json().get('translations', [])
        merged_translated_text = ' '.join(translated_texts)
        return {'translations': [merged_translated_text]}
    except requests.exceptions.RequestException as e:
        logging.error(f"Translation failed: {e}")
        return {"translations": [""]}

def send_llm(query):
    # Translate the query from Kannada to English
    translated_query = translate_text(query, src_lang='kan_Knda', tgt_lang='eng_Latn')
    translated_query_text = translated_query['translations'][0]

    url = 'https://gaganyatri-llm-indic-server-cpu.hf.space/chat'
    headers = {
        'accept': 'application/json',
        'Content-Type': 'application/json'
    }
    data = {
        "prompt": translated_query_text
    }

    try:
        # Send the POST request
        response = requests.post(url, headers=headers, data=json.dumps(data))
        response.raise_for_status()

        # Check if the response is valid JSON
        try:
            response_data = response.json()
        except json.JSONDecodeError:
            logging.error("Invalid JSON response from LLM server")
            return "Sorry, I couldn't process your request."

        llm_response = response_data.get('response', "Sorry, I couldn't process your request.")

        # Translate the response back to Kannada
        translated_response = translate_text(llm_response, src_lang='eng_Latn', tgt_lang='kan_Knda')
        translated_response_text = translated_response['translations'][0]

        return translated_response_text
    except requests.exceptions.RequestException as e:
        logging.error(f"LLM request failed: {e}")
        return "Sorry, I couldn't process your request."

# Create the Gradio interface
with gr.Blocks(title="Indian language Query") as demo:
    gr.Markdown("# LLM - Answer")
    gr.Markdown("Enter your query and get a response from the Mistral AI")

    query_input = gr.Textbox(label="Enter your query", lines=2, placeholder="ಕರ್ನಾಟಕದ ರಾಜಧಾನಿ ಯಾವುದು ?")
    submit_button = gr.Button("Submit")
    mistral_output = gr.Textbox(label="LLM Answer", interactive=False)

    submit_button.click(
        fn=send_llm,
        inputs=query_input,
        outputs=mistral_output
    )

# Launch the interface with share=True
demo.launch(share=True)