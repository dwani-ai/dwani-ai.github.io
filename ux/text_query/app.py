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

def send_to_mistral(query):
    api_key = os.environ["MISTRAL_API_KEY"]
    model = "mistral-saba-latest"
    client = Mistral(api_key=api_key)
    chat_response = client.chat.complete(
        model=model,
        messages=[
            {
                "role": "user",
                "content": query,
            },
        ]
    )
    return chat_response.choices[0].message.content

# Create the Gradio interface
with gr.Blocks(title="Indian language Query") as demo:
    gr.Markdown("# LLM - Answer")
    gr.Markdown("Enter your query and get a response from the Mistral AI")

    query_input = gr.Textbox(label="Enter your query", lines=2, placeholder="ಕರ್ನಾಟಕದ ರಾಜಧಾನಿ ಯಾವುದು ?")
    submit_button = gr.Button("Submit")
    mistral_output = gr.Textbox(label="LLM Answer", interactive=False)

    submit_button.click(
        fn=send_to_mistral,
        inputs=query_input,
        outputs=mistral_output
    )

# Launch the interface
demo.launch()