from fastapi import APIRouter
from app.agents.wellbeing_agent import get_wellbeing_tips

router = APIRouter()

@router.get('/api/wellbeing-tips')
def wellbeing_tips():
    return get_wellbeing_tips()
