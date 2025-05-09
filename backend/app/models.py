from pydantic import BaseModel

class SymptomInput(BaseModel):
    name: str
    age: int
    gender: str
    symptoms: str
    duration: str
