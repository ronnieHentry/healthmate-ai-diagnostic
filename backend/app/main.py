from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, Request
from pydantic import BaseModel
from app.agents.symptom_agent import symptom_intake_agent
from app.agents.diagnosis_agent import diagnosis_agent
from app.agents.doctor_agent import doctor_recommendation_agent

app = FastAPI()

# Allow frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


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

@app.post("/api/intake")
async def chat_with_symptom_agent(msg: ChatMessage):
    result = symptom_intake_agent(msg.session_id, {"message": msg.message})
    return result

@app.post("/api/diagnosis")
async def generate_diagnosis(req: DiagnosisRequest):
    return diagnosis_agent(req.session_id)

@app.post("/api/doctors")
async def recommend_doctors(req: DoctorRecommendation):
    return doctor_recommendation_agent(req.session_id)

@app.get("/ping")
def ping():
    return {"status": "ok"}

