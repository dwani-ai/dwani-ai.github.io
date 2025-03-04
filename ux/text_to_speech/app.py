import gradio as gr
import requests
import json
import logging

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

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

# Function to send text input to the API and retrieve the audio file
def get_audio(input_text, voice_description_id):
    try:
        # Find the selected voice description
        selected_description = next((desc for desc in voice_descriptions if desc['userdomain_voice'] == voice_description_id), None)
        
        if selected_description:
            voice_description = selected_description['voice_description']
            output_file_name = selected_description['output_file_name']
        else:
            logger.error(f"Voice description not found for ID: {voice_description_id}")
            return f"Error: Voice description not found"
        
        # Define the API endpoint and headers
        url = "https://gaganyatri-indic-all-server.hf.space/v1/audio/speech"
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
            with open(output_file_name, "wb") as audio_file:
                for chunk in response.iter_content(chunk_size=1024):
                    if chunk:
                        audio_file.write(chunk)
            
            logger.info(f"Audio file saved to: {output_file_name}")
            
            # Return the path to the saved audio file
            return output_file_name
        else:
            logger.error(f"API request failed. Status code: {response.status_code}, {response.text}")
            return f"Error: {response.status_code}, {response.text}"
    except requests.exceptions.RequestException as e:
        logger.error(f"Request exception: {e}")
        return f"Request error: {e}"
    except Exception as e:
        logger.error(f"General exception: {e}")
        return f"Error: {e}"

# Load voice descriptions from JSON file
voice_descriptions = load_voice_descriptions('voice_description_indian.json')

# Extract IDs and descriptions for dropdown menu
dropdown_choices = [(desc['userdomain_voice'], f"{desc['userdomain_voice']}: {desc['voice_description'][:50]}...") for desc in voice_descriptions]

# Define the Gradio interface
with gr.Blocks() as demo:
    gr.Markdown("### Text-to-Speech Generator")
    
    with gr.Row():
        input_text = gr.Textbox(label="Enter Text", placeholder="Type your text here...")
    
    with gr.Row():
        voice_dropdown = gr.Dropdown(
            choices=[choice[0] for choice in dropdown_choices],
            label="Select Voice Description",
            type="value",
            value=dropdown_choices[0][0] if dropdown_choices else None,
            interactive=True,
        )
    
    with gr.Row():
        output_audio = gr.Audio(label="Generated Audio")
    
    submit_button = gr.Button("Generate Audio")
    
    def process_request(input_text, voice_description_id):
        return get_audio(input_text, voice_description_id)
    
    submit_button.click(
        process_request,
        inputs=[input_text, voice_dropdown],
        outputs=[output_audio]
    )

# Launch the Gradio demo
try:
    demo.launch()
except Exception as e:
    logger.error(f"Failed to launch Gradio demo: {e}")
