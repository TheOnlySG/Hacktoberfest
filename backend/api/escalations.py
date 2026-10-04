from fastapi import APIRouter, HTTPException
from typing import Dict, Any, List

router = APIRouter()

ESCALATIONS_DB: Dict[str, Any] = {}

@router.get("")
async def list_escalations() -> List[Dict[str, Any]]:
    """List all pending or processed escalation briefs."""
    return list(ESCALATIONS_DB.values())

@router.post("/{escalation_id}/approve")
async def approve_escalation(escalation_id: str, payload: Dict[str, Any] = None):
    """
    Approve an escalation draft triggered by an SLA breach.
    Conforms strictly to protocol/examples/api_contract.md.
    """
    approved = payload.get("approved", True) if payload else True
    edited_text = payload.get("edited_text", "") if payload else ""
    
    ESCALATIONS_DB[escalation_id] = {
        "escalation_id": escalation_id,
        "status": "escalated",
        "approved": approved,
        "edited_text": edited_text,
    }
    
    return {
        "status": "escalated",
        "escalation_id": escalation_id,
        "approved": approved
    }
