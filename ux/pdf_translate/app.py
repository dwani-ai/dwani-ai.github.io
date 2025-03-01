import gradio as gr
import os
import requests
import json
import logging

# Set up logging
logging.basicConfig(filename='execution.log', level=logging.INFO,
                    format='%(asctime)s - %(levelname)s - %(message)s')

def get_endpoint(use_gpu, use_localhost, service_type):
    logging.info(f"Getting endpoint for service: {service_type}, use_gpu: {use_gpu}, use_localhost: {use_localhost}")
    device_type_ep = "" if use_gpu else "-cpu"
    if use_localhost:
        port_mapping = {
            "asr": 8860,
            "translate": 10860,
            "tts": 9860
        }
        base_url = f'http://localhost:{port_mapping[service_type]}'
    else:
        base_url = f'https://gaganyatri-{service_type}-indic-server{device_type_ep}.hf.space'
    logging.info(f"Endpoint for {service_type}: {base_url}")
    return base_url

def transcribe_audio(audio_path, use_gpu, use_localhost):
    logging.info(f"Transcribing audio from {audio_path}, use_gpu: {use_gpu}, use_localhost: {use_localhost}")
    base_url = get_endpoint(use_gpu, use_localhost, "asr")
    url = f'{base_url}/transcribe/?language=kannada'
    files = {'file': open(audio_path, 'rb')}
    try:
        response = requests.post(url, files=files)
        response.raise_for_status()
        transcription = response.json()
        logging.info(f"Transcription successful: {transcription}")
        return transcription.get('text', '')
    except requests.exceptions.RequestException as e:
        logging.error(f"Transcription failed: {e}")
        return ""

def translate_text(transcription, use_gpu, use_localhost):
    logging.info(f"Translating text: {transcription}, use_gpu: {use_gpu}, use_localhost: {use_localhost}")
    base_url = get_endpoint(use_gpu, use_localhost, "translate")
    device_type = "cuda" if use_gpu else "cpu"
    url = f'{base_url}/translate?src_lang=kan_Knda&tgt_lang=hin_Deva&device_type={device_type}'
    headers = {
        'accept': 'application/json',
        'Content-Type': 'application/json'
    }
    data = {
        "sentences": [transcription],
        "src_lang": "kan_Knda",
        "tgt_lang": "hin_Deva"
    }
    try:
        response = requests.post(url, headers=headers, data=json.dumps(data))
        response.raise_for_status()
        logging.info(f"Translation successful: {response.json()}")
        return response.json()
    except requests.exceptions.RequestException as e:
        logging.error(f"Translation failed: {e}")
        return {"translations": [""]}

def text_to_speech(translated_text, use_gpu, use_localhost):
    logging.info(f"Converting text to speech: {translated_text}, use_gpu: {use_gpu}, use_localhost: {use_localhost}")
    base_url = get_endpoint(use_gpu, use_localhost, "tts")
    url = f'{base_url}/v1/audio/speech'
    headers = {
        'accept': 'application/json',
        'Content-Type': 'application/json'
    }

    data = {
        "input": translated_text,
        "voice": "A female speaker delivers a slightly expressive and animated speech with a moderate speed and pitch. The recording is of very high quality, with the speakers voice sounding clear and very close up.",
        "response_type": "wav"
    }
    try:
        response = requests.post(url, headers=headers, data=json.dumps(data))
        response.raise_for_status()
        audio_path = "translated_audio.wav"
        with open(audio_path, 'wb') as f:
            f.write(response.content)
        logging.info(f"Text to speech successful, audio saved to {audio_path}")
        return audio_path, "Yes"
    except requests.exceptions.RequestException as e:
        logging.error(f"Text to speech failed: {e}")
        return None, "No"

# Create the Gradio interface
with gr.Blocks(title="Voice Recorder and Player") as demo:
    gr.Markdown("# Voice Recorder and Player")
    gr.Markdown("Record your voice or upload a WAV file and play it back!")

    audio_input = gr.Microphone(type="filepath", label="Record your voice")
    audio_upload = gr.File(type="filepath", file_types=[".wav"], label="Upload WAV file")
    audio_output = gr.Audio(type="filepath", label="Playback", interactive=False)
    transcription_output = gr.Textbox(label="Transcription Result", interactive=False)
    translation_output = gr.Textbox(label="Translated Text", interactive=False)
    tts_audio_output = gr.Audio(type="filepath", label="TTS Playback", interactive=False)
    tts_success_output = gr.Textbox(label="TTS Success", interactive=False)
    use_gpu_checkbox = gr.Checkbox(label="Use GPU", value=False)
    use_localhost_checkbox = gr.Checkbox(label="Use Localhost", value=False)

    def on_transcription_complete(transcription, use_gpu, use_localhost):
        logging.info(f"Transcription complete: {transcription}, use_gpu: {use_gpu}, use_localhost: {use_localhost}")
        translation = translate_text(transcription, use_gpu, use_localhost)
        translated_text = translation['translations'][0]
        return translated_text

    def on_translation_complete(translated_text, use_gpu, use_localhost):
        logging.info(f"Translation complete: {translated_text}, use_gpu: {use_gpu}, use_localhost: {use_localhost}")
        tts_audio_path, success = text_to_speech(translated_text, use_gpu, use_localhost)
        return tts_audio_path, success

    def process_audio(audio_path, use_gpu, use_localhost):
        logging.info(f"Processing audio from {audio_path}, use_gpu: {use_gpu}, use_localhost: {use_localhost}")
        transcription = transcribe_audio(audio_path, use_gpu, use_localhost)
        return transcription

    audio_input.stop_recording(
        fn=process_audio,
        inputs=[audio_input, use_gpu_checkbox, use_localhost_checkbox],
        outputs=transcription_output
    )

    audio_upload.upload(
        fn=process_audio,
        inputs=[audio_upload, use_gpu_checkbox, use_localhost_checkbox],
        outputs=transcription_output
    )

    transcription_output.change(
        fn=on_transcription_complete,
        inputs=[transcription_output, use_gpu_checkbox, use_localhost_checkbox],
        outputs=translation_output
    )

    translation_output.change(
        fn=on_translation_complete,
        inputs=[translation_output, use_gpu_checkbox, use_localhost_checkbox],
        outputs=[tts_audio_output, tts_success_output]
    )

# Launch the interface
demo.launch()