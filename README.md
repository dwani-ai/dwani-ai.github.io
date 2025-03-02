## Dhwani - Voice Mode For Kannada


- Dhwani is a self-hosted platform designed to provide Voice mode interaction for Kannada and Indian languages.

- This platform leverages various tools and models to parse, transcribe, and improve conversation ultimately providing high-quality audio interactions 

- An experiment to build a production grade inference pipeline 

- Project Report and Funding request for Dhwani
  - [WebLink] (https://github.com/sachinsshetty/onwards/blob/main/idea/2025/2025-02-24-gpu-access.md) 
  - [Document-WIP](https://docs.google.com/document/d/1idZAzXc65e5QtwTO4vW8gImqnKets_4N4OHLZOCZ9Q0/edit?tab=t.0) 

## Target Solution

| Answer Engine                                  | Voice Translation                          |
|-----------------------------------------------|---------------------------------------------|
| ![Answer Engine](docs/workflow/kannada-answer-engine.drawio.png "Engine") | ![Voice Translation](docs/workflow/voice-translation.drawio.png "Voice Translation") |


- Demo for Testing components for Dhwani for Accuracy and evaluation


| Feature                      | Description                                                                 | Demo Link | Components          | Source Code       |
|------------------------------|-----------------------------------------------------------------------------|-----------|---------------------|-------------------|
| Answer Engine                | Provides answers to queries using a large language model.                     |   | LLM                 | [Link](ux/answer_engine/app.py)          |
| Answer Engine with Translate| Provides answers to queries with translation capabilities.                   | [Link](https://huggingface.co/spaces/gaganyatri/dhwani-voice-model)  | LLM, Translation    | [Link](ux/answer_engine_translate/app.py)          |
| PDF Translate                | Translates content from PDF documents.                                       |  | Translation         |           |
| Text Translate               | Translates text from one language to another.                                |   | Translation         | [Link]()          |
| Voice Generation            | Generates speech from text.                                                  |   | TTS                 | [Link](ux/text_to_speech/app.py)          |
| Voice to Text Translation    | Converts spoken language to text and translates it.                          | [Link](https://huggingface.co/spaces/gaganyatri/dhwani-tts)  | ASR, Translation    | [Link](ux/voice_to_text_translation/app.py)          |
| Voice to Voice Translation   | Converts spoken language to text, translates it, and then generates speech.   | [Link](https://huggingface.co/spaces/gaganyatri/dhwani-tts)  | ASR, Translation, TTS| [Link](ux/voice_to_voice_translation/app.py)          |
| Text Query                   | Allows querying text data for specific information.                          | [Link](https://huggingface.co/spaces/gaganyatri/dhwani_text_query)  | LLM                 | [Link](ux/text_query/app.py)          |


