import requests
from dotenv import load_dotenv
import re
import os

load_dotenv()
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

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
    from datetime import datetime
    import calendar
    report_path = os.path.join("data", "report.json")
    if not os.path.exists(report_path):
        return []
    with open(report_path, "r", encoding="utf-8") as f:
        all_reports = json.load(f)
    user_reports = [
        {"session_id": sid, "report": report}
        for sid, report in all_reports.items()
        if sid.lower().startswith(user_key.lower())
    ]
    result = []
    for entry in user_reports:
        summary = summarize_report(entry["report"])
        # If no date, use session_id timestamp
        if not summary.get("date") or not summary["date"]:
            # Always treat timestamp as milliseconds
            parts = entry["session_id"].split("-")
            if len(parts) > 1:
                try:
                    ts = int(parts[-1]) // 1000
                    dt = datetime.fromtimestamp(ts)
                    summary["date"] = dt.strftime("%b %d")  # Changed to show month and day
                    summary["fullDate"] = dt.strftime("%Y-%m-%d")
                except Exception:
                    summary["date"] = ""
                    summary["fullDate"] = ""
            else:
                summary["date"] = ""
                summary["fullDate"] = ""
        else:
            # If Groq returned a date, also try to add fullDate from session_id
            parts = entry["session_id"].split("-")
            if len(parts) > 1:
                try:
                    ts = int(parts[-1]) // 1000
                    dt = datetime.fromtimestamp(ts)
                    summary["fullDate"] = dt.strftime("%Y-%m-%d")
                except Exception:
                    summary["fullDate"] = ""
            else:
                summary["fullDate"] = ""
        result.append(summary)
    return result
