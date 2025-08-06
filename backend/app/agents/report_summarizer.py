import os
import json
import base64
import requests
from dotenv import load_dotenv
from app.utils.pdf_utils import extract_text_from_pdf
from app.utils.prompt import MEDICAL_REPORT_PROMPT_TEMPLATE


load_dotenv()
GROQ_API_KEY = os.getenv("GROQ_API_KEY3")
GEMINI_API_KEYS = [os.getenv("GEMINI_API_KEY"), os.getenv("GEMINI_API_KEY2")]
_gemini_key_index = 0

def get_next_gemini_key():
    global _gemini_key_index
    key = GEMINI_API_KEYS[_gemini_key_index % len(GEMINI_API_KEYS)]
    _gemini_key_index += 1
    return key

def summarize_medical_report(session_id, file_path):
    file_ext = os.path.splitext(file_path)[1].lower()

    # Image file handling (use Gemini)

    if file_ext in [".png", ".jpg", ".jpeg"]:
        try:
            with open(file_path, "rb") as image_file:
                encoded_string = base64.b64encode(image_file.read()).decode("utf-8")
        except Exception as e:
            return {"error": "Failed to read and encode image", "details": str(e)}

        gemini_url = "https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash-lite:generateContent"
        headers = {
            "Content-Type": "application/json",
            "x-goog-api-key": get_next_gemini_key()
        }

        payload = {
            "contents": [
                {
                    "parts": [
                        {
                            "inlineData": {
                                "mimeType": "image/png",
                                "data": encoded_string
                            }
                        },
                        {
                            "text": "This is an X-ray image. Please analyze it and summarize the patient's condition."
                        }
                    ]
                }
            ]
        }

        try:
            response = requests.post(gemini_url, headers=headers, json=payload, verify=False)
            response.raise_for_status()
            return {"response": response.json()}
        except requests.RequestException as e:
            return {"error": "Gemini API request failed", "details": str(e)}

    # PDF or other non-image file handling (use Grok)
    else:
        report_text = extract_text_from_pdf(file_path)
        if not report_text:
            return {"error": "Failed to extract text from PDF"}

        prompt = MEDICAL_REPORT_PROMPT_TEMPLATE.format(report_text=report_text)

        messages = [
            {"role": "system", "content": "You are a helpful medical assistant."},
            {"role": "user", "content": prompt}
        ]

        url = "https://api.groq.com/openai/v1/chat/completions"
        headers = {
            "Authorization": f"Bearer {GROQ_API_KEY}",
            "Content-Type": "application/json"
        }

        payload = {
            "model": "llama3-70b-8192",
            "messages": messages,
            "temperature": 0.3
        }

        try:
            response = requests.post(url, headers=headers, json=payload, verify=False)
            response.raise_for_status()
        except requests.RequestException as e:
            return {"error": "Grok API request failed", "details": str(e)}

        reply_content = response.json()['choices'][0]['message']['content']

        try:
            summary_json = json.loads(reply_content)
        except json.JSONDecodeError:
            summary_json = {"error": "Invalid JSON response from Grok", "raw_response": reply_content}

        return summary_json