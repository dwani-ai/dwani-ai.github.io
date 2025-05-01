# Dwani - Your Kannada Speaking Voice Buddy

## Overview

Dwani is a self-hosted GenAI platform designed to provide voice mode interaction for Kannada and other Indian languages. 


Website -> [dwani.ai](https://dwani.ai)

[Download App on Google Play](
https://play.google.com/store/apps/details?id=com.slabstech.dhwani.voiceai&pcampaignid=web_share)

## Research Goals

- Measure and improve the Time to First Token Generation (TTFTG) for model architectures in ASR, Translation, and TTS systems.
- Develop and enhance a Kannada voice model that meets industry standards set by OpenAI, Google, ElevenLabs, xAI
- Create robust voice solutions for Indian languages, with a specific emphasis on Kannada.


## Project Video
    
- Dwani - Android App Demo
[![Watch the video](https://img.youtube.com/vi/TbplM-lWSL4/hqdefault.jpg)](https://youtube.com/shorts/TbplM-lWSL4)

- Dwani - Intoduction to Project
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


<!-- 

- [Link](https://github.com/sachinsshetty/onwards/blob/main/idea/2025/2025-02-24-gpu-access.md)

- [Doc](https://docs.google.com/document/d/e/2PACX-1vRRNjjDrbjAGDQgUWtA5LR0TzwviNn61GYpn3Xm0-WKZrjjTyH2GhDdyY80pNp82oQdAfb60auQvVRW/pub)


-->

--
<details> 



<summary>


### Dwani: Empowering 50M Kannada Speakers with Voice Technology
</summary>

Dialect barriers: Voice assistants (e.g., Siri, Alexa) struggle with German dialects, excluding speakers like Anna, a visually impaired grandmother in Munich.


## The Problem

Picture Shyamala, a Kannada-speaking farmer from Karnataka, unable to use voice apps—they don’t understand her language. For 50 million Kannada speakers, technology feels out of reach, excluding them from digital access and opportunities.

Dwani changes that. Our open-source voice assistant speaks Kannada fluently, helping people like Shyamala with everyday tasks—asking questions, translating, or describing images—all in their native tongue. It’s private, works offline, and runs on affordable devices, designed with Karnataka’s heart in mind.

We’re live on the Play Store with 10,000+ downloads and a growing community. Dwani’s built to scale, ready to serve 1 billion voices across India’s 22 languages in a market craving local solutions.

No one else offers Kannada voice tech—Dwani’s unique, community-driven, and culturally true.

We’re seeking €100,000 to reach 100,000 users and refine our tech, partnering to include millions in the digital world.

Let’s give 50 million voices a chance to be heard. Join us.


</details> 


<details> 



<summary>

### Dwani: Empowering 50M German Speakers with Voice Technology

</summary>
## The Problem
Imagine Anna, a visually impaired grandmother in Munich, unable to use voice assistants like Siri or Alexa because they don’t understand her German dialect or respect her privacy. Over 50 million German speakers face this reality: excluded from digital access due to English-centric tech, cloud-based data risks, and limited accessibility for non-English speakers and people with disabilities.

## The Vision
Dwani bridges this gap, empowering 50M+ German speakers across Germany, Austria, and Switzerland with voice technology that’s accessible, private, and tailored to their language and culture. From Anna to students in Berlin, we envision a world where everyone’s voice is heard.

## The Solution
Dwani is a German-speaking voice assistant that’s open-source, privacy-first, and community-driven. Key features include:
- Fluent German voice queries (e.g., “Was ist das Wetter in Berlin?”).
- Real-time translation and German document summaries.
- On-premise setup for data security.

Built with AI (ASR, TTS, LLMs), Dwani ensures natural, dialect-aware interactions.

## Market Opportunity
- **Immediate**: 50M+ German speakers in Germany (80M population), Austria (9M), Switzerland (5M).
- **Future**: Scalable to 300M+ European users across 10+ languages.
- **Trend**: Growing demand for regional, privacy-focused tech solutions.

## Competitive Advantage
Unlike Siri or Alexa, Dwani is:
- **German-first**: Tailored for dialects and culture.
- **Privacy-focused**: On-premise for secure, offline use.
- **Open-source**: Transparent and community-driven.
- **Scalable**: Ready for other European languages.

## Traction
- Live on Google Play Store with a German interface.
- 1,000+ beta users testing in German-speaking regions.
- 500+ GitHub stars for open-source repos.

## Business Model
- **Enterprise**: License Dwani for German businesses (healthcare, education).
- **Partnerships**: Collaborate with German tech firms and universities.
- **Freemium**: Free basic features; premium for unlimited use.

## Financials & Ask
- **Current Costs**: €7,500/month (€2,500 servers, €5,000 salaries).
- **Seeking**: €100,000 seed funding for a 12-month runway to:
  - Enhance AI accuracy (50%).
  - Develop German-focused features (30%).
  - Reach 100,000 users (20%).

## Roadmap (2025)
- **Q1**: Launch real-time German voice AI.
- **Q2**: Support Austrian/Swiss German dialects.
- **Q3**: Roll out enterprise solutions.
- **Q4**: Achieve 100,000 German users.

## Team
- **Sachin Shetty**: Software Engineer (GenAI, full-stack), passionate about accessible voice tech for German speakers.

## Call to Action
Join us to bring Dwani to Anna and millions of German speakers. Let’s make voice technology inclusive, private, and German-first.

</details> 

---
