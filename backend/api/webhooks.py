import datetime
from fastapi import APIRouter, Request, HTTPException
from backend.adapters.sandbox import SANDBOX_DB
from backend.router.org_router import load_org_profiles

router = APIRouter()

# Mock storage for passages to update their status
# In a real app, this would update the database
PASSAGES_DB = {}

@router.post("/{adapter}/{token}")
async def receive_webhook(adapter: str, token: str, request: Request):
    """
    Receives an inbound webhook from an organization (e.g. Zammad or Sandbox).
    Normalizes the status and updates the Passage's hash chain/ticket state.
    """
    payload = await request.json()
    
    # Simple webhook processing based on adapter
    if adapter == "sandbox":
        org_slug = payload.get("org_slug")
        ticket_id = payload.get("ticket_id")
        raw_status = payload.get("status")
        
        if not org_slug or not ticket_id or not raw_status:
            raise HTTPException(status_code=400, detail="Missing required fields")
            
        profiles = load_org_profiles()
        profile = profiles.get(org_slug)
        if not profile:
            raise HTTPException(status_code=404, detail="Org profile not found")
            
        # Normalize status
        normalized_status = profile.get('status_map', {}).get(raw_status, 'submitted')
        
        # In a real app, we'd look up the ticket in the database and update its status
        # For MVP, we just return the normalized status mapping result
        
        # Write hash chain event (Mock)
        event = {
            "event_type": "status_update",
            "org_slug": org_slug,
            "ticket_ref": ticket_id,
            "normalized_status": normalized_status,
            "raw_status": raw_status,
            "timestamp": datetime.datetime.utcnow().isoformat()
        }
        
        return {"status": "processed", "normalized": normalized_status, "event": event}
        
    elif adapter == "zammad":
        # Handle Zammad specific webhook format (to be implemented in Phase 3)
        return {"status": "processed", "adapter": "zammad"}
        
    else:
        raise HTTPException(status_code=400, detail="Unknown adapter")
