from fastapi import APIRouter
from typing import Dict, Any

router = APIRouter()

@router.post("/{org_slug}/tickets/{ticket_id}/status")
async def update_sandbox_status(org_slug: str, ticket_id: str, payload: Dict[str, str]):
    return {"id": ticket_id, "status": payload.get("status", "OPEN")}
