import os
import re
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

def load_medical_history(patient_name):
    file_path = "data/medical_histories.json"
    
    if os.path.exists(file_path):
        with open(file_path, 'r') as f:
            all_patient_data = json.load(f)
        
        # Convert the patient name to the appropriate format (firstname_lastname)
        patient_key = patient_name.lower().replace(" ", "_")
        
        # Check if the patient exists in the data
        if patient_key in all_patient_data:
            return all_patient_data[patient_key]
        else:
            raise ValueError(f"Medical history for {patient_name} not found.")
    else:
        raise FileNotFoundError("Medical histories file not found.")


def save_session(session_id, messages):
    if os.path.exists(DATA_FILE):
        with open(DATA_FILE, "r") as f:
            data = json.load(f)
    else:
        data = {}
    
    data[session_id] = messages

    with open(DATA_FILE, "w") as f:
        json.dump(data, f, indent=2)
        
def extract_name(data):
    message = data['message']  # Get the message from the dictionary
    
    # Use regular expression to find the name after "Name: " and before the first newline
    match = re.search(r"Name:\s*(.*?)(\n|$)", message)
    
    if match:
        return match.group(1).strip()  # Return the name, stripping any extra spaces
    else:
        return None  # Return None if no match is found

def symptom_intake_agent(session_id, data):
    messages = load_session(session_id)

    print(data)
    if not messages:
        # Start with the system role message
        # append the medical history to the messages for the LLM to have some context
        
        patient_name = extract_name(data)  # You can dynamically pull this from the data
        try:
            medical_history = load_medical_history(patient_name)
        except (FileNotFoundError, ValueError) as e:
            return {"reply": str(e), "status": "error", "timestamp": datetime.now().isoformat(), session_id: session_id}

        # Add the medical history to the system prompt
        medical_history_str = json.dumps(medical_history, indent=4)  # Convert to string
        
        system_prompt = f"""
        The patient is {patient_name}. Here is their medical history:
        {medical_history_str}

        {SYMPTOM_AGENT_SYSTEM_PROMPT}
        """
        
        messages.append({"role": "system", "content": system_prompt})

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

    response = requests.post(url, headers=headers, json=payload, verify=False)
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