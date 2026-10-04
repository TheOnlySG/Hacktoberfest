import os
import json
from groq import Groq
from backend.config import settings

def get_groq_client():
    api_key = settings.GROQ_API_KEY
    if not api_key:
        api_key = os.environ.get("GROQ_API_KEY", "")
    return Groq(api_key=api_key)

def compile_passage(user_text: str, evidence_metadata: list, schema: dict) -> dict:
    if settings.USE_CACHED_AI:
        text_lower = (user_text or "").lower()
        if any(w in text_lower for w in ["upi", "payeasy", "northfield", "debited", "ramesh", "2,850", "2850"]):
            filename = 'case2_compiled.json'
        elif any(w in text_lower for w in ["pipe", "burst", "water", "flood", "avenue", "utility", "car", "submerged", "municipal", "mwd"]):
            filename = 'case3_compiled.json'
        else:
            filename = 'case1_compiled.json'

        cache_path = os.path.join(os.path.dirname(__file__), '../../protocol/examples', filename)
        if os.path.exists(cache_path):
            with open(cache_path, 'r') as f:
                return json.load(f)
        else:
            return {"error": f"Cached AI run {filename} not found."}

    client = get_groq_client()
    
    prompt_path = os.path.join(os.path.dirname(__file__), '../../ai/prompts/compiler.md')
    with open(prompt_path, 'r') as f:
        system_prompt = f.read()
        
    evidence_str = json.dumps(evidence_metadata, indent=2)
    prompt = system_prompt.format(evidence_metadata=evidence_str, user_text=user_text)

    # Note: Groq JSON mode doesn't strictly enforce schema structure natively like OpenAI structured outputs do,
    # so we pass the schema in the system prompt to guide it, alongside response_format={"type": "json_object"}.
    messages = [
        {"role": "system", "content": f"{prompt}\n\nSchema to conform to:\n{json.dumps(schema)}"},
        {"role": "user", "content": "Please compile the passage."}
    ]

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=messages,
        response_format={"type": "json_object"}
    )
    
    result = response.choices[0].message.content
    return json.loads(result)
