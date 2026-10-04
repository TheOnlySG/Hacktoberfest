from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from backend.dispatcher.relay import QUESTIONS_DB, relay_answer_to_org

router = APIRouter()

class AnswerPayload(BaseModel):
    ticket_id: str
    org_slug: str
    answer_text: str
    attachments: Optional[List[str]] = []

@router.get("/passages/{passage_id}/questions")
async def get_questions(passage_id: str):
    """
    Returns all open questions for a given passage.
    """
    # Mock: filter QUESTIONS_DB by passage_id
    return {"questions": [q for q in QUESTIONS_DB if q.get('passage_id') == passage_id]}

@router.post("/questions/{question_id}/answer")
async def answer_question(question_id: str, payload: AnswerPayload):
    """
    Accepts an answer from the user and relays it to the requesting organization.
    """
    # 1. Look up question
    question = next((q for q in QUESTIONS_DB if q.get('id') == question_id), None)
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")
        
    # 2. Relay answer via the appropriate adapter
    success = relay_answer_to_org(payload.ticket_id, payload.org_slug, payload.answer_text, payload.attachments)
    
    if success:
        question['status'] = 'answered'
        # Also need to trigger hash chain update here
        return {"status": "relayed"}
    else:
        raise HTTPException(status_code=500, detail="Failed to relay answer")
