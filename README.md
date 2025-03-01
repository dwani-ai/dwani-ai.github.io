## Dhwani - Voice Mode For Kannada


- Dhwani is a self-hosted platform designed to provide Voice mode interaction for Kannada and Indian languages.

- This platform leverages various tools and models to parse, transcribe, and improve conversation ultimately providing high-quality audio interactions 

- An experiment to build a production grade inference pipeline 

- [Voice Demo](https://huggingface.co/spaces/gaganyatri/dhwani)


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


<!-- 

- TTS - Text to Speech
```
curl -X 'POST' \
  'https://gaganyatri-tts-indic-server-cpu.hf.space/v1/audio/speech' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{"input": "ಉದ್ಯಾನದಲ್ಲಿ ಮಕ್ಕಳ ಆಟವಾಡುತ್ತಿದ್ದಾರೆ ಮತ್ತು ಪಕ್ಷಿಗಳು ಚಿಲಿಪಿಲಿ ಮಾಡುತ್ತಿವೆ.", "voice": "A female speaker delivers a slightly expressive and animated speech with a moderate speed and pitch. The recording is of very high quality, with the speakers voice sounding clear and very close up.",, "response_type": "wav"}'  -o audio_kannada_gpu_cloud.wav
```

- ASR - Automatic Speech Recognition
```
curl -X 'POST' \
  'https://gaganyatri-asr-indic-server-cpu.hf.space/transcribe/?language=kannada' \
  -H 'accept: application/json' \
  -H 'Content-Type: multipart/form-data' \
  -F 'file=@audio_kannada_gpu_cloud.wav;type=audio/x-wav'
```


- Translate - Kannada to Hindi
```
curl -X 'POST' \
  'https://gaganyatri-translate-indic-server-cpu.hf.space/translate?src_lang=kan_Knda&tgt_lang=eng_Latn&device_type=cpu' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "sentences": [
    "ನಮಸ್ಕಾರ, ಹೇಗಿದ್ದೀರಾ?", "ಶುಭೋದಯ!"
  ],
  "src_lang": "kan_Knda",
  "tgt_lang": "eng_Latn"
}'
```

-->