import os
import requests
import json
from datetime import datetime
from dotenv import load_dotenv
from app.utils.prompt import DIAGNOSIS_AGENT_PROMPT
import re

load_dotenv()
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

DATA_FILE = "data/sessions.json"
DIAGNOSIS_REPORT_FILE = "data/report.json"

def load_session(session_id):
    if os.path.exists(DATA_FILE):
        with open(DATA_FILE, "r") as f:
            data = json.load(f)
            return data.get(session_id, [])
    return []

def save_session(session_id, messages):
    if os.path.exists(DATA_FILE):
        with open(DATA_FILE, "r") as f:
            data = json.load(f)
    else:
        data = {}
    
    data[session_id] = messages

    with open(DATA_FILE, "w") as f:
        json.dump(data, f, indent=2)

def load_diagnosis_reports():
    if os.path.exists(DIAGNOSIS_REPORT_FILE):
        with open(DIAGNOSIS_REPORT_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    return {}

def save_diagnosis_report(session_id, report_text):
    data = load_diagnosis_reports()
    data[session_id] = report_text
    with open(DIAGNOSIS_REPORT_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

def extract_json(text):
    # Remove triple backtick blocks like ```json ... ```
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
        },
        verify=False
    )
    response.raise_for_status()
    return response.json()["choices"][0]["message"]["content"]

def json_agent(input_text: str, json_format: dict) -> dict:
    format_str = json.dumps(json_format, indent=2)
    prompt = f"""
You are a helpful assistant that converts a natural-language medical report into structured JSON.

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

def diagnosis_agent(session_id):
    messages = load_session(session_id)
    if not messages:
        return {
            "reply": "Error: No symptom intake data found.",
            "status": "error",
            "timestamp": datetime.now().isoformat()
        }

    if messages[-1]["role"] == "assistant" and "All clear" in messages[-1]["content"]:
        messages.append({
            "role": "user",
            "content": "Please now generate the preliminary health summary report based on the information we've discussed."
        })

    non_system_messages = [msg for msg in messages if msg["role"] != "system"]

    diagnosis_prompt = {
        "role": "system",
        "content": DIAGNOSIS_AGENT_PROMPT
    }

    new_messages = [diagnosis_prompt] + non_system_messages

    # Step 1: Get raw diagnosis report
    diagnosis_report = call_groq(new_messages)

    # Step 2: Convert to structured JSON using json_agent
    json_format = {
        "possible_causes": [],
        "red_flags": [],
        "tests_suggested": [],
        "doctor_recommendation": "",
        "doctor_summary": ""
    }

    try:
        structured_report = json_agent(diagnosis_report, json_format)
    except Exception as e:
        structured_report = {"error": "Failed to parse structured JSON", "raw": diagnosis_report, "exception": str(e)}

    save_diagnosis_report(session_id, diagnosis_report)
    save_session(session_id, messages)

    return {
        "diagnosis_raw": diagnosis_report,
        "diagnosis_structured": structured_report,
        "session_id": session_id,
        "timestamp": datetime.now().isoformat()
    }
