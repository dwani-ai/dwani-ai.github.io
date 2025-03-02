gunicorn -k uvicorn.workers.UvicornWorker src.india_all_api:app -w 4 -b 0.0.0.0:8000






Single GPU Setup 



- Use concept of Load balancer to utilise Single GPU for Multi LLM inference

- Multimodel Setup
    - LLM  (Text)-> Ollama server -> deepseek-r1 / qwen2.5b
    - VLM (Vision) -> Ollama server -> minicpm-v / moondream / qwen2.5-vl
    - TTS (Speech Generate) -> fastapi + pytorch -> parler-tts
    - STT (Speech Converter)-> fastapi + whisper
    - NMT (Translation) -> fastapi + pytorch -> indic-trans2
    - TTS-Audio (Music Generate) -> fastapi + pytorch -> audiogen + magnet

- Model - load and unload based on current task being executed for a full workflow

- Stage - Workflow
    - Stage 0 - Startup : Health Check
        - All model - unload
        - Check GPU memory availability
        - Log system status to file

    - Stage 1 : Text LLM -
        - Unload all models 
        - text_llm model load
        - Run prompts for data and create plan for next steps
        - Run context based chunking for batch optimisation
        - Unload all models

    - Stage 2 : NMT - Translate

    - Stage 3 - TTS - Speech
        - Unload all models
        - tts_parler model load
        - Generate Speech for all speaker and narrators with batch Run
        - Unload all models

    - Stage 4 : TTS - Music Generator
        - Run AudioGen module

    - Stage 5 : Evaluation
        - Check outputs via Evaluation
        - Combine Outputs from previous Steps
            - Send response to callback function
        - Run Evaluation for full output
            - if evaluation success
                - Show pass/green indicator
            - If failed
                - Re run failed module