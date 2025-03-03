# Dhwani - Voice AI For Kannada

## Overview

Dhwani is a self-hosted GenAI platform designed to provide voice mode interaction for Kannada and other Indian languages. 

## Research Goals

- Measure and improve the Time to First Token Generation (TTFTG) for model architectures in ASR, Translation, and TTS systems.
- Develop and enhance a Kannada voice model that meets industry standards set by OpenAI, Google, ElevenLabs, xAI
- Create robust voice solutions for Indian languages, with a specific emphasis on Kannada.

## Project Report

- [WebLink](https://github.com/sachinsshetty/onwards/blob/main/idea/2025/2025-02-24-gpu-access.md)


## Models and Tools

The project utilizes the following open-source tools:

| Open-Source Tool                       | Source Repository                                          | CPU / Available 24/7 - Free, Slow | GPU / Paused, On-demand, $0.05 /hour |
|---------------------------------------|-------------------------------------------------------------|----------------|----------------|
| Automatic Speech Recognition : ASR   | [ASR Indic Server](https://github.com/slabstech/asr-indic-server) | [HF Demo](https://huggingface.co/spaces/gaganyatri/asr_indic_server_cpu) |  - |
| Text to Speech : TTS                  | [TTS Indic Server](https://github.com/slabstech/tts-indic-server)  | Not suitable           | - |
| Translation                           | [Indic Translate Server](https://github.com/slabstech/indic-translate-server) | [HF Demo](https://huggingface.co/spaces/gaganyatri/translate_indic_server_cpu)          |            |
| Document Parser                           | [Indic Document Server](https://github.com/slabstech/docs-indic-server) | [HF Demo](https://huggingface.co/spaces/gaganyatri/docs_api_server_cpu)          |    -        |
|All in One Server - ASR + TTS + Translate | [indic-all-server](server/indic_all/) | Not Suitable | [ HF API](https://gaganyatri-indic-all-server.hf.space/docs) |

## Target Solution

| Answer Engine| Answer Engine with Translation                                 | Voice Translation                          |
|----------|-----------------------------------------------|---------------------------------------------|
| ![Answer Engine](docs/workflow/kannada-answer-engine.drawio.png "Engine") | ![Answer Engine Translation](docs/workflow/kannada-answer-engine-translate.png "Engine") | ![Voice Translation](docs/workflow/voice-translation.drawio.png "Voice Translation") |

## Demo for Testing Components

| Feature                      | Description                                                                 | Demo Link | Components          | Source Code       |
|------------------------------|-----------------------------------------------------------------------------|-----------|---------------------|-------------------|
| Answer Engine                | Provides answers to queries using a large language model.                     | [Link](https://huggingface.co/spaces/gaganyatri/dhwani-voice-model)  | LLM                 | [Link](ux/answer_engine/app.py)          |
| Answer Engine with Translate| Provides answers to queries with translation capabilities.                   |   [link](https://huggingface.co/spaces/gaganyatri/dhwani_voice_to_any) | LLM, Translation    | [Link](ux/answer_engine_translate/app.py)          |
| PDF Translate                | Translates content from PDF documents.                                       |  | Translation         |           |
| Text Translate               | Translates text from one language to another.                                |   | Translation         | [Link]()          |
| Voice Generation            | Generates speech from text.                                                  |   | TTS                 | [Link](ux/text_to_speech/app.py)          |
| Voice to Text Translation    | Converts spoken language to text and translates it.                          | [Link](https://huggingface.co/spaces/gaganyatri/dhwani)  | ASR, Translation    | [Link](ux/voice_to_text_translation/app.py)          |
| Voice to Voice Translation   | Converts spoken language to text, translates it, and then generates speech.   | [Link](https://huggingface.co/spaces/gaganyatri/dhwani-tts)  | ASR, Translation, TTS| [Link](ux/voice_to_voice_translation/app.py)          |
| Text Query                   | Allows querying text data for specific information.                          | [Link](https://huggingface.co/spaces/gaganyatri/dhwani_text_query)  | LLM                 | [Link](ux/text_query/app.py)          |





## Contact
- For any questions or issues, please open an issue on GitHub or contact us via email.
- For collaborations
  - Join the discord group - [invite link](https://discord.gg/WZMCerEZ2P) 
- For business queries, Email : info (at) slabstech (dot) com