For Translation 

  'https://gaganyatri-indic-all-server.hf.space/translate?src_lang=kan_Knda&tgt_lang=eng_Latn&device_type=cuda' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "sentences": [
     "ನಮಸ್ಕಾರ, ಹೇಗಿದ್ದೀರಾ?", "ಶುಭೋದಯ!"
  ],
  "src_lang": "kan_Knda",
  "tgt_lang": "eng_Latn"
}'
{"translations":["Hello, how are you?","Good morning!"]}


For TTS

curl -X 'POST'   'https://gaganyatri-indic-all-server.hf.space/v1/audio/speech'   -H 'accept: application/json'   -H 'Content-Type: application/json'   -d '{"input": "ಉದ್ಯಾನದಲ್ಲಿ ಮಕ್ಕಳ ಆಟವಾಡುತ್ತಿದ್ದಾರೆ ಮತ್ತು ಪಕ್ಷಿಗಳು ಚಿಲಿಪಿಲಿ ಮಾಡುತ್ತಿವೆ.", "voice": "A female speaker delivers a slightly expressive and animated speech with a moderate speed and pitch. The recording is of very high quality, with the speakers voice sounding clear and very close up."}'  -o audio_kannada_gpu_cloud.mp3
