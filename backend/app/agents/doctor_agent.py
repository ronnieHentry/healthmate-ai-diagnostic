import os
import requests
import json
import re
from datetime import datetime
from dotenv import load_dotenv
from app.utils.prompt import DOCTOR_AGENT_PROMPT

load_dotenv()
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
DATA_FILE = "data/sessions.json"

def load_session(session_id):
    if os.path.exists(DATA_FILE):
        with open(DATA_FILE, "r") as f:
            data = json.load(f)
            return data.get(session_id, {})  # Expecting a dict now
    return {}

def extract_json(text):
    match = re.search(r"\{[\s\S]*\}", text)
    if match:
        return json.loads(match.group(0))
    raise ValueError("No valid JSON found in response.")

def call_groq(messages, model="llama3-70b-8192", temperature=0.7):
    response = requests.post(
        "https://api.groq.com/openai/v1/chat/completions",
        headers={
            "Authorization": f"Bearer {GROQ_API_KEY}",
            "Content-Type": "application/json"
        },
        json={
            "model": model,
            "messages": messages,
            "temperature": temperature
        }
    )
    response.raise_for_status()
    return response.json()["choices"][0]["message"]["content"]

def json_agent(input_text: str, json_format: dict) -> dict:
    format_str = json.dumps(json_format, indent=2)
    prompt = f"""
You are a helpful assistant that converts a natural-language doctor recommendation into structured JSON.

FORMAT:
{format_str}

TEXT:
{input_text}

INSTRUCTIONS:
- Match the keys in the format exactly.
- If any values are missing, use empty strings or empty lists.
- Output ONLY valid JSON with no extra text or formatting.
"""
    messages = [{"role": "user", "content": prompt}]
    raw_response = call_groq(messages, temperature=0.2)

    try:
        return extract_json(raw_response)
    except Exception as e:
        return {
            "error": "Failed to parse structured JSON",
            "raw": raw_response,
            "exception": str(e)
        }

def doctor_recommendation_agent(session_id):
    session_data = load_session(session_id)
    diagnosis_report = session_data.get("diagnosis_report", None)

    if not diagnosis_report:
        return {
            "reply": "Error: No diagnosis data found.",
            "status": "error",
            "timestamp": datetime.now().isoformat()
        }

    messages = [
        {"role": "system", "content": DOCTOR_AGENT_PROMPT},
        {"role": "user", "content": f"Here is the diagnosis report:\n{diagnosis_report}"}
    ]

    # Step 1: Get doctors suggestion (raw)
    doctors = call_groq(messages)

    # Step 2: Convert to structured JSON
json_format = {
  "recommendations": [
    {
      "hospital": "",
      "address": "",
      "doctor_name": "",
      "specialty": "",
      "contact": "",
      "rating": ""
    }
  ]
}


    structured_response = json_agent(doctors, json_format)

    return {
        "doctors_raw": doctors,
        "doctor_recommendation_structured": structured_response,
        "session_id": session_id,
        "timestamp": datetime.now().isoformat()
    }
