from fastapi import APIRouter
from typing import Dict, Any, List
from backend.adapters.sandbox import sandbox_update_status, sandbox_list_tickets

router = APIRouter()

@router.get("/{org_slug}/tickets")
async def list_org_sandbox_tickets(org_slug: str) -> List[Dict[str, Any]]:
    return sandbox_list_tickets(org_slug)

@router.post("/{org_slug}/tickets/{ticket_id}/status")
async def update_sandbox_status(org_slug: str, ticket_id: str, payload: Dict[str, str]):
    new_status = payload.get("status", "OPEN")
    updated = sandbox_update_status(org_slug, ticket_id, new_status)

    # Sync back into active passages database
    try:
        from backend.api.passages import PASSAGES_DB
        for p_id, p_data in PASSAGES_DB.items():
            for t in p_data.get("tickets", []):
                if t.get("ticket_ref") == ticket_id or t.get("id") == ticket_id:
                    t["raw_status"] = new_status
                    t["normalized_status"] = new_status.lower()
    except Exception:
        pass

    return {"id": ticket_id, "org_slug": org_slug, "status": new_status, "ticket": updated}
