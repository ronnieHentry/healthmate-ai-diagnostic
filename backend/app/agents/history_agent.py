import requests
from dotenv import load_dotenv
import re
import os

load_dotenv()
GROQ_API_KEY = os.getenv("GROQ_API_KEY3")

def summarize_report(report_text):
    """
    Use Groq AI to summarize the report into a short summary, title, and date (if possible).
    """
    prompt = f"""
You are a helpful assistant. Given the following medical diagnostic report, extract:
- A short, user-friendly summary (1-2 sentences, no markdown)
- The main title (chief complaint or main diagnosis, e.g. 'Cough', 'Headache', etc.)
- The date of the report (if not present, use today's date in 'Mon DD' format)

INSTRUCTIONS:
- Do NOT include the patient's name or demographic details in the summary. Focus only on the symptoms, findings, and recommendations.
- The summary should be concise and suitable for the patient to quickly recall the consultation.

Return a JSON object with keys: title, shortSummary, date.

Report:
{report_text}
"""
    url = "https://api.groq.com/openai/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json"
    }
    payload = {
        "model": "llama3-70b-8192",
        "messages": [{"role": "user", "content": prompt}],
        "temperature": 0.3
    }
    response = requests.post(url, headers=headers, json=payload, verify=False)
    response.raise_for_status()
    content = response.json()['choices'][0]['message']['content']
    # Try to extract JSON from the response
    match = re.search(r'\{[\s\S]*\}', content)
    if match:
        try:
            return json.loads(match.group(0))
        except Exception:
            pass
    # Fallback: return a generic summary
    return {"title": "Report", "shortSummary": content.strip(), "date": ""}
import os
import json

def get_user_history(user_key: str):
    """
    Fetch all previous consultation reports for a user from report.json and summarize them.
    Returns a list of dicts: {date, title, shortSummary}
    """
    summarized_path = os.path.join("data", "summarized_history.json")
    if not os.path.exists(summarized_path):
        return []
    with open(summarized_path, "r", encoding="utf-8") as f:
        all_histories = json.load(f)
    # Return the user's summarized history if present, else empty list
    return all_histories.get(user_key, [])
