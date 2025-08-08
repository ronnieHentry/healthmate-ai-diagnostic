import json
from fastapi import APIRouter, Query
from pathlib import Path
import os
import requests

router = APIRouter()

# Helper to call Groq LLM for doctor specialties
def call_groq_for_doctors(report_text, template_doctors):
    api_key = os.getenv("GROQ_API_KEY2")
    prompt = f"""
You are a helpful health assistant. Based on the following diagnosis report, update the specialty field for each doctor in the template to be the most appropriate for the illness. Only change the 'specialty' field, keep the name and image the same. Output only a JSON array with the same structure as the template, but with new specialties.

Diagnosis Report:
{report_text}

Template Doctors:
{json.dumps(template_doctors, indent=2)}

Instructions:
- You MUST update the 'specialty' field for every doctor to be relevant for the diagnosis. Do NOT change the name or image fields.
- Output only valid JSON (array of doctors).
"""
    response = requests.post(
        "https://api.groq.com/openai/v1/chat/completions",
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        },
        json={
            "model": "llama3-70b-8192",
            "messages": [{"role": "user", "content": prompt}],
            "temperature": 0.3
        },
        verify=False
    )
    response.raise_for_status()
    content = response.json()["choices"][0]["message"]["content"]
    try:
        start = content.index("[")
        end = content.rindex("]") + 1
        doctors = json.loads(content[start:end])
        return doctors
    except Exception as e:
        raise

# Direct Python function for internal use (diagnosis agent)
def get_suggested_doctors_for_session(session_id: str):
    data_dir = Path(__file__).parent.parent.parent / "data"
    report_path = data_dir / "report.json"
    template_path = data_dir / "suggested_doctors.json"

    # Load template doctors
    try:
        with open(template_path, "r", encoding="utf-8") as f:
            template_doctors = json.load(f)
    except Exception as e:
        template_doctors = []

    # Load diagnosis report for session_id
    try:
        with open(report_path, "r", encoding="utf-8") as f:
            all_reports = json.load(f)
        report_text = all_reports.get(session_id, "")
    except Exception as e:
        report_text = ""

    if not report_text:
        return {"error": "No report text found for session_id."}
    if not template_doctors:
        return {"error": "No template doctors found."}

    # Call Groq LLM to get doctor recommendations
    try:
        doctors = call_groq_for_doctors(report_text, template_doctors)
        return {"doctors": doctors}
    except Exception as e:
        return {"error": "Failed to get AI doctor recommendations."}

# FastAPI endpoint for FE (remains compatible)
@router.get("/suggested-doctors")
def get_suggested_doctors(session_id: str = Query(None)):
    if session_id:
        return get_suggested_doctors_for_session(session_id)
    # fallback to static if no session_id provided
    data_dir = Path(__file__).parent.parent.parent / "data"
    template_path = data_dir / "suggested_doctors.json"
    try:
        with open(template_path, "r", encoding="utf-8") as f:
            template_doctors = json.load(f)
    except Exception:
        template_doctors = []
    return {"doctors": template_doctors}
