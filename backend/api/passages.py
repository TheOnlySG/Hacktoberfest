import uuid
from fastapi import APIRouter, HTTPException
from typing import Dict, Any, List

from backend.compiler.case_compiler import compile_passage
from backend.router.org_router import determine_org_plan
from backend.composer.ticket_composer import compose_drafts
from backend.dispatcher.engine import dispatch_drafts
from backend.adapters.sandbox import sandbox_list_tickets

router = APIRouter()

PASSAGES_DB: Dict[str, Any] = {}

@router.post("")
async def create_passage(payload: Dict[str, Any]):
    p_id = f"p-{uuid.uuid4().hex[:6]}"
    PASSAGES_DB[p_id] = {
        "id": p_id,
        "status": "raw",
        "raw_input": payload,
        "compiled": None,
        "plan": None,
        "drafts": None,
        "tickets": []
    }
    return {"id": p_id, "status": "raw"}

@router.get("/{id}")
async def get_passage(id: str):
    if id not in PASSAGES_DB:
        raise HTTPException(status_code=404, detail="Passage not found")
    return PASSAGES_DB[id]

@router.post("/{id}/compile")
async def compile_passage_route(id: str):
    if id not in PASSAGES_DB:
        raise HTTPException(status_code=404, detail="Passage not found")
    record = PASSAGES_DB[id]
    user_text = record["raw_input"].get("problem_description", "")
    evidence = record["raw_input"].get("attached_evidence", [])
    compiled = compile_passage(user_text, evidence, schema={})
    record["compiled"] = compiled
    record["status"] = "compiled"
    return compiled

@router.put("/{id}/confirm")
async def confirm_passage(id: str, payload: Dict[str, Any]):
    if id not in PASSAGES_DB:
        raise HTTPException(status_code=404, detail="Passage not found")
    PASSAGES_DB[id]["compiled"] = payload
    PASSAGES_DB[id]["status"] = "confirmed"
    return {"status": "confirmed"}

@router.post("/{id}/plan")
async def plan_passage(id: str):
    if id not in PASSAGES_DB:
        raise HTTPException(status_code=404, detail="Passage not found")
    record = PASSAGES_DB[id]
    compiled = record.get("compiled") or {}
    plan = determine_org_plan(compiled)
    record["plan"] = plan
    return plan

@router.put("/{id}/plan")
async def update_plan(id: str, payload: Dict[str, Any]):
    if id not in PASSAGES_DB:
        raise HTTPException(status_code=404, detail="Passage not found")
    PASSAGES_DB[id]["plan"] = payload
    return payload

@router.post("/{id}/drafts")
async def generate_drafts(id: str):
    if id not in PASSAGES_DB:
        raise HTTPException(status_code=404, detail="Passage not found")
    record = PASSAGES_DB[id]
    compiled = record.get("compiled") or {}
    plan = record.get("plan") or determine_org_plan(compiled)
    drafts = compose_drafts(compiled, plan)
    record["drafts"] = drafts
    return drafts

@router.get("/{id}/drafts")
async def get_drafts(id: str):
    if id not in PASSAGES_DB:
        raise HTTPException(status_code=404, detail="Passage not found")
    return PASSAGES_DB[id].get("drafts") or []

@router.patch("/drafts/{draft_id}")
async def update_draft(draft_id: str, payload: Dict[str, Any]):
    return {"draft_id": draft_id, "status": "updated", **payload}

@router.post("/{id}/dispatch")
async def dispatch_passage(id: str, payload: Dict[str, Any] = None):
    if id not in PASSAGES_DB:
        raise HTTPException(status_code=404, detail="Passage not found")
    record = PASSAGES_DB[id]
    approved_drafts = payload.get("approved_drafts") if payload else None
    if not approved_drafts:
        approved_drafts = record.get("drafts") or []
    relay_rules = payload.get("relay_rules") if payload else {}
    plan = record.get("plan") or {}
    tickets = dispatch_drafts(id, approved_drafts, plan, relay_rules)
    record["tickets"] = tickets
    record["status"] = "dispatched"
    return tickets

@router.get("/{id}/tickets")
async def get_tickets(id: str):
    if id not in PASSAGES_DB:
        raise HTTPException(status_code=404, detail="Passage not found")
    return PASSAGES_DB[id].get("tickets") or []

@router.post("/tickets/{ticket_id}/sync")
async def sync_ticket(ticket_id: str):
    return {"ticket_id": ticket_id, "status": "synced"}

@router.post("/{id}/fast_forward")
async def fast_forward(id: str):
    return {"escalations_triggered": 1, "message": "Fast-forward simulation completed"}
