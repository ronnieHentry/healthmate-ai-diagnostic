


import os
import requests
from dotenv import load_dotenv
from fastapi.responses import JSONResponse

load_dotenv()
GROQ_API_KEY = os.getenv("GROQ_API_KEY3")


def get_groq_response(prompt):
    url = 'https://api.groq.com/openai/v1/chat/completions'
    headers = {
        'Authorization': f'Bearer {GROQ_API_KEY}',
        'Content-Type': 'application/json'
    }
    payload = {
        "model": "llama3-70b-8192",
        "messages": [
            {"role": "user", "content": prompt}
        ],
        "temperature": 0.7,
        "max_tokens": 256
    }
    response = requests.post(url, headers=headers, json=payload, timeout=30, verify=False)
    response.raise_for_status()
    return response.json()['choices'][0]['message']['content']

# Helper to extract JSON from LLM response (like diagnosis_agent)
import re
import json
def extract_json(text):
    match = re.search(r"\[.*\]", text, re.DOTALL)
    if match:
        return json.loads(match.group(0))
    raise ValueError("No valid JSON array found in response.")

def get_wellbeing_tips(username=None):
    # Load user medical history
    med_hist = None
    if username:
        data_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../data'))
        med_hist_file = os.path.join(data_dir, 'medical_histories.json')
        if os.path.exists(med_hist_file):
            with open(med_hist_file, 'r', encoding='utf-8') as f:
                histories = json.load(f)
            med_hist = histories.get(username)

    if med_hist:
        med_hist_str = json.dumps(med_hist, ensure_ascii=False, indent=2)
        prompt = (
            f"The following is the user's medical history:\n{med_hist_str}\n"
            "Based on this, give 6 short, personalized wellbeing tips that are specifically related to diet and nutrition. "
            "Each tip should recommend a specific food or dietary habit that can help with the user's conditions or risks (e.g., oranges for vitamin C if the user has a history of colds). "
            "Respond ONLY as a JSON array of objects, each with 'icon' and 'text' keys. "
            "Example: [ {\"icon\": \"🍊\", \"text\": \"Eat oranges for vitamin C to boost immunity\"}, ... ]"
        )
    else:
        prompt = (
            "Give me 6 short wellbeing tips for a healthy lifestyle, focusing only on diet and nutrition. "
            "Each tip should recommend a specific food or dietary habit and its benefit. "
            "Respond ONLY as a JSON array of objects, each with 'icon' and 'text' keys. "
            "Example: [ {\"icon\": \"🍊\", \"text\": \"Eat oranges for vitamin C to boost immunity\"}, ... ]"
        )
    try:
        llm_response = get_groq_response(prompt)
        tips = extract_json(llm_response)
        # Validate structure
        if isinstance(tips, list) and all(isinstance(t, dict) and 'icon' in t and 'text' in t for t in tips):
            return JSONResponse(status_code=200, content=tips)
        else:
            return JSONResponse(status_code=500, content={"error": "LLM response not in expected JSON format.", "raw": llm_response})
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})
