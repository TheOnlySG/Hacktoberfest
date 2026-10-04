from fastapi import APIRouter, HTTPException
from typing import Dict, Any, List

router = APIRouter()

@router.post("")
async def create_passage(payload: Dict[str, Any]):
    return {"id": "p-123", "status": "raw"}

@router.get("/{id}")
async def get_passage(id: str):
    return {"id": id, "status": "raw"}

@router.post("/{id}/compile")
async def compile_passage_route(id: str):
    return {"status": "compiled", "timeline": []}

@router.put("/{id}/confirm")
async def confirm_passage(id: str, payload: Dict[str, Any]):
    return {"status": "confirmed"}

@router.post("/{id}/plan")
async def plan_passage(id: str):
    return {"orgs": []}

@router.put("/{id}/plan")
async def update_plan(id: str, payload: Dict[str, Any]):
    return {"orgs": []}

@router.post("/{id}/drafts")
async def generate_drafts(id: str):
    return [{"draft_id": "d-1", "status": "draft"}]

@router.get("/{id}/drafts")
async def get_drafts(id: str):
    return []

@router.patch("/drafts/{draft_id}")
async def update_draft(draft_id: str, payload: Dict[str, Any]):
    return {"draft_id": draft_id, "status": "updated"}

@router.post("/{id}/dispatch")
async def dispatch_passage(id: str, payload: Dict[str, Any]):
    return [{"id": "t-1", "ticket_ref": "REF-123"}]

@router.get("/{id}/tickets")
async def get_tickets(id: str):
    return []

@router.post("/tickets/{ticket_id}/sync")
async def sync_ticket(ticket_id: str):
    return {"ticket_id": ticket_id, "status": "synced"}

@router.post("/{id}/fast_forward")
async def fast_forward(id: str):
    return {"escalations_triggered": 1}
