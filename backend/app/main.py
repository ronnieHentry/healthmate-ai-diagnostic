from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, Request, Body, UploadFile, File, Form, HTTPException
from pydantic import BaseModel
import os
import json
import shutil

from app.agents.report_summarizer import summarize_medical_report
from app.medical_history_api import router as medical_history_router
from app.wellbeing_api import router as wellbeing_router

# Agent imports
from app.agents.symptom_agent import symptom_intake_agent
from app.agents.diagnosis_agent import diagnosis_agent
from app.agents.doctor_agent import doctor_recommendation_agent
from app.agents.healthy_products_agent import fetch_healthy_products

from app.agents.static_health_products_agent import get_static_health_products
from app.agents.recommended_products_agent import router as recommended_products_router
from app.agents.suggested_doctors_agent import router as suggested_doctors_router

app = FastAPI()
UPLOAD_FOLDER = 'temp'

os.makedirs(UPLOAD_FOLDER, exist_ok=True)


# Register routers
app.include_router(medical_history_router)
app.include_router(wellbeing_router)
app.include_router(recommended_products_router, prefix="/api")
app.include_router(suggested_doctors_router, prefix="/api")

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
    user_key = payload.get("user_key")
    from app.agents.history_agent import get_user_history
    summaries = get_user_history(user_key)
    return summaries

# Static health products (GET)
@app.get("/api/health-products-static")
async def health_products_static():
    """
    Return static health product suggestions for John Doe.
    """
    return get_static_health_products()

@app.post("/upload_report")
async def upload_report(
    file: UploadFile = File(...),
    session_id: str = Form(default="default_session")
):
    file_path = os.path.join(UPLOAD_FOLDER, file.filename)

    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        summary = summarize_medical_report(session_id, file_path)
        return {"status": "success", "summary": summary}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if os.path.exists(file_path):
            os.remove(file_path)

