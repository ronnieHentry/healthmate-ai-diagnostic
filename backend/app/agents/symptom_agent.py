import os
import json
from datetime import datetime
import requests
from dotenv import load_dotenv
from app.utils.prompt import SYMPTOM_AGENT_SYSTEM_PROMPT

load_dotenv()
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

DATA_FILE = "data/sessions.json"


# Ensure the directory exists
os.makedirs(os.path.dirname(DATA_FILE), exist_ok=True)

# Create the file if it doesn't exist
if not os.path.exists(DATA_FILE):
    with open(DATA_FILE, 'w') as f:
        json.dump({}, f)
else:
    with open(DATA_FILE, 'r') as f:
        try:
            content = json.load(f)
            if not isinstance(content, dict):
                raise ValueError
        except (json.JSONDecodeError, ValueError):
            # Overwrite invalid or incorrect structure
            with open(DATA_FILE, 'w') as wf:
                json.dump({}, wf)


def load_session(session_id):
    if os.path.exists(DATA_FILE):
        with open(DATA_FILE, "r") as f:
            data = json.load(f)
            return data.get(session_id, [])
    return []

def get_medical_history(user_id):
    with open("data/history.json") as f:
        db = json.load(f)
    return db.get(user_id.lower().replace(" ", "_"), {})


def save_session(session_id, messages):
    if os.path.exists(DATA_FILE):
        with open(DATA_FILE, "r") as f:
            data = json.load(f)
    else:
        data = {}
    
    data[session_id] = messages

    with open(DATA_FILE, "w") as f:
        json.dump(data, f, indent=2)

def symptom_intake_agent(session_id, data):
    messages = load_session(session_id)

    if not messages:
        # Start with the system role message
        # fetch the medical history of the patient from the database...
        # append the medical history to the messages for the LLM to have some context
        messages.append({"role": "system", "content": SYMPTOM_AGENT_SYSTEM_PROMPT})

    user_input = data.get("message", "").strip()

    if not user_input:
        return {
            "reply": "No user input provided.",
            "history": messages,
            "timestamp": datetime.now().isoformat()
        }

    messages.append({"role": "user", "content": user_input})

    url = "https://api.groq.com/openai/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json"
    }

    payload = {
        "model": "llama3-70b-8192",
        "messages": messages,
        "temperature": 0.7
    }

    response = requests.post(url, headers=headers, json=payload)
    response.raise_for_status()
    reply = response.json()['choices'][0]['message']

    messages.append(reply)
    save_session(session_id, messages)

    # Check if all intake data is provided (e.g., symptoms, duration, etc.)
    if "All clear" in reply["content"]:
        # Generate the diagnosis and doctor suggestions
        return {
            "status": "diagnosis-in-progress",
            session_id: session_id
        }

    # If more data is needed, return an in-progress status
    return {
        "reply": reply["content"],
        "history": messages,
        "status": "in-progress",
        "timestamp": datetime.now().isoformat(),
        session_id: session_id
    }
