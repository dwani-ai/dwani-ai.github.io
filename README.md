# Dhwani - Your Kannada Speaking Voice Buddy

## Overview

Dhwani is a self-hosted GenAI platform designed to provide voice mode interaction for Kannada and other Indian languages. 

## Research Goals

- Measure and improve the Time to First Token Generation (TTFTG) for model architectures in ASR, Translation, and TTS systems.
- Develop and enhance a Kannada voice model that meets industry standards set by OpenAI, Google, ElevenLabs, xAI
- Create robust voice solutions for Indian languages, with a specific emphasis on Kannada.


## Project Video
    
- Dhwani - Android App Demo
[![Watch the video](https://img.youtube.com/vi/VqFdZAkR_a0/hqdefault.jpg)](https://youtube.com/shorts/VqFdZAkR_a0)

- Dhwani - Intoduction to Project
[![Watch the video](https://img.youtube.com/vi/kqZZZjbeNVk/hqdefault.jpg)](https://youtu.be/kqZZZjbeNVk)

  

- [Pitch Deck](https://docs.google.com/presentation/d/e/2PACX-1vQxLtbL_kXOqHgAHqcFTg8hDP7Dw3lt64U336J0f9CgYQPKDJVqONd3F4Js1XiCvk_LDpbijshQ5mM6/pub?start=false&loop=false&delayms=3000)


## Models and Tools

The project utilizes the following open-source tools:

| Open-Source Tool                       | Source Repository                                          | 
|---------------------------------------|-------------------------------------------------------------|
| Automatic Speech Recognition : ASR   | [ASR Indic Server](https://github.com/slabstech/asr-indic-server) | 
| Text to Speech : TTS                  | [TTS Indic Server](https://github.com/slabstech/tts-indic-server)  | 
| Translation                           | [Indic Translate Server](https://github.com/slabstech/indic-translate-server) | 
| Document Parser                       | [Indic Document Server](https://github.com/slabstech/docs-indic-server) |
| Dhwani Server | [Dhwani Server](https://github.com/slabstech/dhwani-server) | 
| Dhwani Android | [Android](https://github.com/slabstech/dhwani-android) |
| Large Language Model                  | [LLM Indic Server](https://github.com/slabstech/llm-indic-server_cpu) | 


## Architecture

| Answer Engine| Answer Engine with Translation                                 | Voice Translation                          |
|----------|-----------------------------------------------|---------------------------------------------|
| ![Answer Engine](docs/workflow/kannada-answer-engine.drawio.png "Engine") | ![Answer Engine Translation](docs/workflow/kannada-answer-engine-translate.png "Engine") | ![Voice Translation](docs/workflow/voice-translation.drawio.png "Voice Translation") |

## Features

| Feature                      | Description                                                                 |  Components          | Source Code       | Hardware       |
|------------------------------|-----------------------------------------------------------------------------|-----------|---------------------|---------------|
| Kannada Voice AI                | Provides answers to voice queries using a LLM                     | LLM                 | [API](ux/answer_engine/app.py) // [APP](ux/answer_engine/local/app.py)          | CPU / GPU |
| Text Translate               | Translates text from one language to another.                                |  Translation         | [Link](ux/text_translate/app.py)          | CPU / GPU | 
| Text Query                   | Allows querying text data for specific information.                          | LLM                 | [Link](ux/text_query/app.py)          | CPU / GPU |
| Voice to Text Translation    | Converts spoken language to text and translates it.                          |  ASR, Translation    | [Link](ux/voice_to_text_translation/app.py)          | CPU / GPU |
| PDF Translate                | Translates content from PDF documents.                                       |  | Translation         |           | GPU |
| Text to Speech           | Generates speech from text.                                                  |  TTS                 | [Link](ux/text_to_speech/app.py)          | GPU |
| Voice to Voice Translation   | Converts spoken language to text, translates it, and then generates speech.   |  ASR, Translation, TTS| [Link](ux/voice_to_voice_translation/app.py)          | GPU |
| Answer Engine with Translate| Provides answers to queries with translation capabilities.                   |  ASR, LLM, Translation, TTS|  [Link](ux/answer_engine_translate/app.py)          | GPU|

## Contact
- For any questions or issues, please open an issue on GitHub or contact us via email.
- For collaborations
  - Join the discord group - [invite link](https://discord.gg/WZMCerEZ2P) 
- For business queries, Email : info (at) slabstech (dot) com


<!-- 

- [Link](https://github.com/sachinsshetty/onwards/blob/main/idea/2025/2025-02-24-gpu-access.md)

- [Doc](https://docs.google.com/document/d/e/2PACX-1vRRNjjDrbjAGDQgUWtA5LR0TzwviNn61GYpn3Xm0-WKZrjjTyH2GhDdyY80pNp82oQdAfb60auQvVRW/pub)


-->
