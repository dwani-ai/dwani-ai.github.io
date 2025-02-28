import gradio as gr
import os
import requests
import json

def transcribe_audio(audio_path, use_gpu):
    device_type_ep = "" if use_gpu else "-cpu"
    url = f'https://gaganyatri-asr-indic-server{device_type_ep}.hf.space/transcribe/?language=kannada'
    files = {'file': open(audio_path, 'rb')}
    response = requests.post(url, files=files)
    transcription = response.json()
    return transcription.get('text', '')

def translate_text(transcription, use_gpu):
    device_type_ep = "" if use_gpu else "-cpu"
    device_type = "cuda" if use_gpu else "cpu"
    url = f'https://gaganyatri-translate-indic-server{device_type_ep}.hf.space/translate?src_lang=kan_Knda&tgt_lang=hin_Deva&device_type={device_type}'
    headers = {
        'accept': 'application/json',
        'Content-Type': 'application/json'
    }
    data = {
        "sentences": [transcription],
        "src_lang": "kan_Knda",
        "tgt_lang": "hin_Deva"
    }
    response = requests.post(url, headers=headers, data=json.dumps(data))
    return response.json()

def text_to_speech(translated_text, use_gpu):
    device_type = "" if use_gpu else "-cpu"
    url = f'https://gaganyatri-tts-indic-server{device_type}.hf.space/v1/audio/speech'
    headers = {
        'accept': 'application/json',
        'Content-Type': 'application/json'
    }

    data = {
        "input": translated_text,
        "voice": "A female speaker delivers a slightly expressive and animated speech with a moderate speed and pitch. The recording is of very high quality, with the speakers voice sounding clear and very close up.",
        "response_type": "wav"
    }
    response = requests.post(url, headers=headers, data=json.dumps(data))
    audio_path = "translated_audio.wav"
    try:
        with open(audio_path, 'wb') as f:
            f.write(response.content)
        return audio_path, "Yes"
    except:
        return None, "No"

# Create the Gradio interface
with gr.Blocks(title="Voice Recorder and Player") as demo:
    gr.Markdown("# Voice Recorder and Player")
    gr.Markdown("Record your voice and play it back!")

    audio_input = gr.Microphone(type="filepath", label="Record your voice")
    audio_output = gr.Audio(type="filepath", label="Playback", interactive=False)
    transcription_output = gr.Textbox(label="Transcription Result", interactive=False)
    translation_output = gr.Textbox(label="Translated Text", interactive=False)
    tts_audio_output = gr.Audio(type="filepath", label="TTS Playback", interactive=False)
    tts_success_output = gr.Textbox(label="TTS Success", interactive=False)
    use_gpu_checkbox = gr.Checkbox(label="Use GPU", value=False)

    def on_transcription_complete(transcription, use_gpu):
        translation = translate_text(transcription, use_gpu)
        translated_text = translation['translations'][0]
        return translated_text

    def on_translation_complete(translated_text, use_gpu):
        tts_audio_path, success = text_to_speech(translated_text, use_gpu)
        return tts_audio_path, success

    audio_input.stop_recording(
        fn=transcribe_audio,
        inputs=[audio_input, use_gpu_checkbox],
        outputs=transcription_output
    )

    transcription_output.change(
        fn=on_transcription_complete,
        inputs=[transcription_output, use_gpu_checkbox],
        outputs=translation_output
    )

    translation_output.change(
        fn=on_translation_complete,
        inputs=[translation_output, use_gpu_checkbox],
        outputs=[tts_audio_output, tts_success_output]
    )

# Launch the interface
demo.launch()
