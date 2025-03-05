from transformers import AutoModelForCausalLM, AutoTokenizer, AutoModelForSeq2SeqLM
import gradio as gr
import torch
from IndicTransToolkit import IndicProcessor

# Load the model and tokenizer for the causal language model
model_name = "Qwen/Qwen2.5-1.5B-Instruct"

model = AutoModelForCausalLM.from_pretrained(
    model_name,
    torch_dtype="auto",
    device_map="auto"
)

tokenizer = AutoTokenizer.from_pretrained(model_name)

# Load the translation models and tokenizers
DEVICE = "cuda" if torch.cuda.is_available() else "cpu"
src_lang, tgt_lang = "eng_Latn", "kan_Knda"
model_name_trans_indic_en = "ai4bharat/indictrans2-indic-en-dist-200M"
model_name_trans_en_indic = "ai4bharat/indictrans2-en-indic-dist-200M"

tokenizer_trans_indic_en = AutoTokenizer.from_pretrained(model_name_trans_indic_en, trust_remote_code=True)
model_trans_indic_en = AutoModelForSeq2SeqLM.from_pretrained(
    model_name_trans_indic_en,
    trust_remote_code=True,
    torch_dtype=torch.float16,  # performance might slightly vary for bfloat16
    attn_implementation="flash_attention_2",
    device_map="auto"
)

tokenizer_trans_en_indic = AutoTokenizer.from_pretrained(model_name_trans_en_indic, trust_remote_code=True)
model_trans_en_indic = AutoModelForSeq2SeqLM.from_pretrained(
    model_name_trans_en_indic,
    trust_remote_code=True,
    torch_dtype=torch.float16,  # performance might slightly vary for bfloat16
    attn_implementation="flash_attention_2",
    device_map="auto"
)

ip = IndicProcessor(inference=True)

def generate_response(prompt):
    messages = [
        {"role": "system", "content": "You are Dhwani, built for Indian languages. You are a helpful assistant. Provide a concise response in one sentence maximum to the user's query."},
        {"role": "user", "content": prompt}
    ]

    print(prompt)
    text = tokenizer.apply_chat_template(
        messages,
        tokenize=False,
        add_generation_prompt=True
    )
    model_inputs = tokenizer([text], return_tensors="pt").to(model.device)

    generated_ids = model.generate(
        **model_inputs,
        max_new_tokens=512
    )
    generated_ids = [
        output_ids[len(input_ids):] for input_ids, output_ids in zip(model_inputs.input_ids, generated_ids)
    ]

    response = tokenizer.batch_decode(generated_ids, skip_special_tokens=True)[0]
    return response

def translate_text(text, src_lang, tgt_lang):
    if src_lang == "kan_Knda" and tgt_lang == "eng_Latn":
        tokenizer_trans = tokenizer_trans_indic_en
        model_trans = model_trans_indic_en
    elif src_lang == "eng_Latn" and tgt_lang == "kan_Knda":
        tokenizer_trans = tokenizer_trans_en_indic
        model_trans = model_trans_en_indic
    else:
        raise ValueError("Unsupported language pair")

    batch = ip.preprocess_batch(
        [text],
        src_lang=src_lang,
        tgt_lang=tgt_lang,
    )
    inputs = tokenizer_trans(
        batch,
        truncation=True,
        padding="longest",
        return_tensors="pt",
        return_attention_mask=True,
    ).to(DEVICE)

    with torch.no_grad():
        generated_tokens = model_trans.generate(
            **inputs,
            use_cache=True,
            min_length=0,
            max_length=256,
            num_beams=5,
            num_return_sequences=1,
        )

    with tokenizer_trans.as_target_tokenizer():
        generated_tokens = tokenizer_trans.batch_decode(
            generated_tokens.detach().cpu().tolist(),
            skip_special_tokens=True,
            clean_up_tokenization_spaces=True,
        )

    translations = ip.postprocess_batch(generated_tokens, lang=tgt_lang)

    print('translation- input')
    print(text)

    print('translation - output')
    print(translations[0])
    return translations[0]

def send_llm(query):
    translated_query = translate_text(query, src_lang='kan_Knda', tgt_lang='eng_Latn')

    query_answer = generate_response(translated_query)

    translated_answer = translate_text(query_answer, src_lang='eng_Latn', tgt_lang='kan_Knda')

    return translated_answer

# Create the Gradio interface
with gr.Blocks(title="Indian language Query") as demo:
    gr.Markdown("# Dhwani AI- Text Query / ಧ್ವಾನಿ AI- ಪಠ್ಯ ಪ್ರಶ್ನೆ")

    query_input = gr.Textbox(label="Enter your text query / ನಿಮ್ಮ ಪ್ರಶ್ನೆಯನ್ನು ನಮೂದಿಸಿ", lines=2, placeholder="ಕರ್ನಾಟಕದ ರಾಜಧಾನಿ ಯಾವುದು ?")
    submit_button = gr.Button("Submit")
    dhwani_output = gr.Textbox(label="Answer / ಉತ್ತರ", interactive=False)

    submit_button.click(
        fn=send_llm,
        inputs=query_input,
        outputs=dhwani_output
    )

# Launch the interface with share=True
demo.launch(share=False)