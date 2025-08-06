import os
import requests
import json
from datetime import datetime
from dotenv import load_dotenv
from app.utils.prompt import DIAGNOSIS_AGENT_PROMPT
import re

load_dotenv()
GROQ_API_KEY = os.getenv("GROQ_API_KEY2")

DATA_FILE = "data/sessions.json"
DIAGNOSIS_REPORT_FILE = "data/report.json"
MEDICAL_HISTORY_FILE = "data/medical_histories.json"

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
        
def load_medical_history(patient_name):
    file_path = MEDICAL_HISTORY_FILE
    
    if os.path.exists(file_path):
        with open(file_path, "r") as f:
            all_patient_data = json.load(f)
        
        patient_key = patient_name
        
        # Check if the patient exists in the data
        if patient_key in all_patient_data:
            return all_patient_data[patient_key]
        else:
            raise ValueError(f"Medical history for {patient_name} not found.")
    else:
        raise FileNotFoundError("Medical histories file not found.")


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

# Diagnosis agent that generates the diagnosis report
def diagnosis_agent(session_id):
    messages = load_session(session_id)
    if not messages:
        return {
            "reply": "Error: No symptom intake data found.",
            "status": "error",
            "timestamp": datetime.now().isoformat()
        }

    # Extract the patient's name from the session ID (this assumes it's part of the session key)
    patient_name_match = re.match(r"([a-zA-Z]+_[a-zA-Z]+)-\d+", session_id)
    if not patient_name_match:
        return {
            "reply": "Error: Could not extract patient name from session ID.",
            "status": "error",
            "timestamp": datetime.now().isoformat()
        }

    # Extract patient name (e.g., "jimmy_james") from session ID
    patient_name = patient_name_match.group(1)

    try:
        # Load the medical history for the patient
        medical_history = load_medical_history(patient_name)
    except (FileNotFoundError, ValueError) as e:
        return {
            "reply": str(e),
            "status": "error",
            "timestamp": datetime.now().isoformat(),
            "session_id": session_id
        }

    # If the last message from assistant includes "All clear", prompt the user to generate a report
    if messages[-1]["role"] == "assistant" and "All clear" in messages[-1]["content"]:
        messages.append({
            "role": "user",
            "content": "Please now generate the preliminary health summary report based on the information we've discussed."
        })

    # Filter out system messages
    non_system_messages = [msg for msg in messages if msg["role"] != "system"]

    # Create a system prompt with medical history context
    medical_history_str = json.dumps(medical_history, indent=4)  # Convert medical history to string

    diagnosis_prompt = {
        "role": "system",
        "content": f"""
        The patient is {patient_name}. Here is their medical history:
        {medical_history_str}

        {DIAGNOSIS_AGENT_PROMPT}
        """
    }

    # Add diagnosis prompt to the messages
    new_messages = [diagnosis_prompt] + non_system_messages

    # Step 1: Get raw diagnosis report from Groq API
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

    # Save the diagnosis report
    save_diagnosis_report(session_id, diagnosis_report)
    save_session(session_id, messages)

    # Update summarized history using history_agent
    try:
        from app.agents.history_agent import get_user_history
        # Use patient_name as user_key
        get_user_history(patient_name)
    except Exception as e:
        print(f"Error updating summarized history: {e}")

    return {
        "diagnosis_raw": diagnosis_report,
        "diagnosis_structured": structured_report,
        "session_id": session_id,
        "timestamp": datetime.now().isoformat()
    }