

# ==================== Imports ====================
from fastapi import FastAPI, Request, Body
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import json

# Agent imports
from app.agents.symptom_agent import symptom_intake_agent
from app.agents.diagnosis_agent import diagnosis_agent
from app.agents.doctor_agent import doctor_recommendation_agent
from app.agents.history_agent import get_user_history
from app.agents.healthy_products_agent import fetch_healthy_products

# ==================== App Initialization ====================
app = FastAPI()

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==================== Pydantic Models ====================
class SymptomRequest(BaseModel):
    session_id: str
    name: str
    age: int
    gender: str
    symptoms: str
    duration: str

class ChatMessage(BaseModel):
    session_id: str
    message: str

class DiagnosisRequest(BaseModel):
    session_id: str

class DoctorRecommendation(BaseModel):
    session_id: str

# ==================== API Endpoints ====================

# Health check
@app.get("/ping")
def ping():
    return {"status": "ok"}

# Symptom intake
@app.post("/api/intake")
async def chat_with_symptom_agent(msg: ChatMessage):
    result = symptom_intake_agent(msg.session_id, {"message": msg.message})
    return result

# Diagnosis generation
@app.post("/api/diagnosis")
async def generate_diagnosis(req: DiagnosisRequest):
    return diagnosis_agent(req.session_id)

# Doctor recommendations
@app.post("/api/doctors")
async def recommend_doctors(req: DoctorRecommendation):
    return doctor_recommendation_agent(req.session_id)

# Consultation history (POST)
@app.post("/api/history")
async def history_post_endpoint(payload: dict = Body(...)):
    """
    Fetch all previous consultation reports for a user from report.json using history_agent, POST version.
    Expects: { "user_key": "username" }
    """
    # user_key = payload.get("user_key")
    # summaries = get_user_history(user_key)
    return [
    {
        "title": "Itchy Skin with Redness",
        "shortSummary": "Moderate itchy skin and redness on torso, likely an allergic reaction to shellfish consumption, requiring further evaluation and management by a specialist.",
        "date": "Mon 03",
        "fullDate": "2025-05-15"
    },
    {
        "title": "Cough",
        "shortSummary": "Moderate dry cough for 4 days, possibly related to upper respiratory tract infection or environmental irritant, further testing recommended.",
        "date": "Mon 14",
        "fullDate": "2025-08-03"
    },
    {
        "title": "Mild fever and body aches",
        "shortSummary": "Mild fever and body aches, likely viral. Rest and monitor.",
        "date": "Mon 20",
        "fullDate": "2025-08-04"
    },
    {
        "title": "Mild Stomach Pain",
        "shortSummary": "Mild stomach pain after eating spicy food, likely gastritis, avoid spicy food and take antacids if needed.",
        "date": "Mon 20",
        "fullDate": "2025-08-05"
    },
    {
        "title": "Headache and Fatigue",
        "shortSummary": "Experiencing mild headache and fatigue, likely due to tension and dehydration. Recommended to rest, hydrate, and manage stress.",
        "date": "Mon 20",
        "fullDate": "2025-08-06"
    }
]

# Healthy products (GET)
@app.get("/api/healthy-products")
async def healthy_products():
    """
    Fetch healthy products from Walmart API for Reminders section.
    """
    return fetch_healthy_products()

