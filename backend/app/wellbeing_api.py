
from fastapi import APIRouter, Request
from app.agents.wellbeing_agent import get_wellbeing_tips

router = APIRouter()

@router.post('/api/wellbeing-tips')
async def wellbeing_tips(request: Request):
    body = await request.json()
    username = body.get('username')
    return get_wellbeing_tips(username)
