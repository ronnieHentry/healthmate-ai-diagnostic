from fastapi import APIRouter, HTTPException
import os
import json

router = APIRouter()

DATA_PATH = os.path.join(os.path.dirname(__file__), '../data/medical_histories.json')

from fastapi import Request

@router.post('/api/medical-history')
async def get_medical_history(request: Request):
    try:
        body = await request.json()
        username = body.get('username')
        if not username:
            raise HTTPException(status_code=400, detail='Username is required')
        with open(DATA_PATH, 'r', encoding='utf-8') as f:
            data = json.load(f)
        user_data = data.get(username)
        if not user_data:
            raise HTTPException(status_code=404, detail='User not found')
        return user_data
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
