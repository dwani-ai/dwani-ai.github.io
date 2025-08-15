# dwani.ai - knowledge from curiosity

### Overview

dwani.ai is a Document Analytics Platform

- Designed for Indian + European languages.

-  It can be self-hosted and
provides multimodal inference, supporting text, images, documents, and speech

---

Website -> [dwani.ai](https://dwani.ai)

Live API Demo -> [app.dwani.ai](https://app.dwani.ai)

[Download App on Google Play](
https://play.google.com/store/apps/details?id=com.slabstech.dhwani.voiceai&pcampaignid=web_share)

--- 
#### Research Goals

- Measure and improve the Time to First Token Generation (TTFTG) for model architectures in ASR, Translation, and TTS systems.
- Develop and enhance a Kannada voice model that meets industry standards set by OpenAI, Google, ElevenLabs, xAI
- Create robust voice solutions for Indian languages, with a specific emphasis on Kannada.


## Project Video
    
- dwani.ai - Android App Demo
[![Watch the video](https://img.youtube.com/vi/TbplM-lWSL4/hqdefault.jpg)](https://youtube.com/shorts/TbplM-lWSL4)

- dwani.ai - Intoduction to Project
[![Watch the video](https://img.youtube.com/vi/kqZZZjbeNVk/hqdefault.jpg)](https://youtu.be/kqZZZjbeNVk)


## Models and Tools

The project utilizes the following open-source tools:

| Open-Source Tool                       | Source Repository                                          | 
|---------------------------------------|-------------------------------------------------------------|
| Automatic Speech Recognition : ASR   | [ASR Indic Server](https://github.com/slabstech/asr-indic-server) | 
| Text to Speech : TTS                  | [TTS Indic Server](https://github.com/slabstech/tts-indic-server)  | 
| Translation                           | [Indic Translate Server](https://github.com/slabstech/indic-translate-server) | 
| Document Parser                       | [Indic Document Server](https://github.com/slabstech/docs-indic-server) |
| Dwani Server | [Dwani Server](https://github.com/slabstech/dhwani-server) | 
| Dwani Android | [Android](https://github.com/slabstech/dhwani-android) |
| Large Language Model                  | [LLM Indic Server](https://github.com/slabstech/llm-indic-server_cpu) | 


## Architecture

| Answer Engine| Answer Engine with Translation                                 | Voice Translation                          |
|----------|-----------------------------------------------|---------------------------------------------|
| ![Answer Engine](docs/workflow/kannada-answer-engine.drawio.png "Engine") | ![Answer Engine Translation](docs/workflow/kannada-answer-engine-translate.png "Engine") | ![Voice Translation](docs/workflow/voice-translation.drawio.png "Voice Translation") |

## Features

| Feature                      | Description                                                                 |  Components          | 
|------------------------------|-----------------------------------------------------------------------------|-----------|
| Kannada Voice AI                | Provides answers to voice queries using a LLM                     | LLM                 | 
| Text Translate               | Translates text from one language to another.                                |  Translation         |
| Text Query                   | Allows querying text data for specific information.                          | LLM                 | 
| Voice to Text Translation    | Converts spoken language to text and translates it.                          |  ASR, Translation    |
| PDF Translate                | Translates content from PDF documents.                                       |  | Translation         |
| Text to Speech           | Generates speech from text.                                                  |  TTS                 |
| Voice to Voice Translation   | Converts spoken language to text, translates it, and then generates speech.   |  ASR, Translation, TTS|
| Answer Engine with Translate| Provides answers to queries with translation capabilities.                   |  ASR, LLM, Translation, TTS| 

## Contact
- For any questions or issues, please open an issue on GitHub or contact us via email.
- For collaborations
  - Join the discord group - [invite link](https://discord.gg/WZMCerEZ2P) 
- For business queries, Email : sachin (at) dwani (dot) ai



