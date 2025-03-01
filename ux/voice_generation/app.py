
import gradio as gr
import requests
import numpy as np
from pydub import AudioSegment
from pydub.playback import play
import os

# Function to send text input to the API and retrieve the audio file
def get_audio(input_text, voice_description):
    # Define the API endpoint and headers
    url = "localhost:9860/v1/audio/speech"
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
        # Save the audio file
        audio_file_path = "output_audio.mp3"
        with open(audio_file_path, "wb") as audio_file:
            for chunk in response.iter_content(chunk_size=1024):
                if chunk:
                    audio_file.write(chunk)
        
        # Return the path to the saved audio file
        return audio_file_path
    else:
        return f"Error: {response.status_code}, {response.text}"

# Define the Gradio interface
demo = gr.Interface(
    fn=get_audio,
    inputs=[
        gr.Textbox(label="Enter Text", placeholder="Type your text here..."),
        gr.Textbox(
            label="Voice Description",
            placeholder="Enter voice description (e.g., 'A female speaker delivers...')",
            lines=2,
        ),
    ],
    outputs=gr.Audio(label="Generated Audio"),
)

# Launch the Gradio demo
demo.launch()