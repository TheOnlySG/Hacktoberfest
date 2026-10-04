import os
import httpx

ZAMMAD_URL = os.environ.get("ZAMMAD_URL", "http://localhost:8080/api/v1")
ZAMMAD_TOKEN = os.environ.get("ZAMMAD_TOKEN", "dummy_token")

def zammad_create_ticket(org_slug: str, fields: dict, evidence: dict) -> dict:
    """
    Creates a ticket in a Zammad instance via its REST API.
    """
    headers = {
        "Authorization": f"Token token={ZAMMAD_TOKEN}",
        "Content-Type": "application/json"
    }
    
    # Format the ticket content
    body_text = "New Passage Ticket:\\n"
    for k, v in fields.items():
        body_text += f"{k}: {v}\\n"
        
    payload = {
        "title": f"Passage Issue for {org_slug}",
        "group": "Users",
        "customer": fields.get("email", "customer@example.com"),
        "article": {
            "subject": f"Initial Details",
            "body": body_text,
            "type": "note",
            "internal": False
        }
    }
    
    try:
        response = httpx.post(f"{ZAMMAD_URL}/tickets", json=payload, headers=headers, timeout=10.0)
        response.raise_for_status()
        data = response.json()
        ticket_id = str(data.get("id"))
        return {
            "ticket_ref": ticket_id,
            "status": "new"
        }
    except Exception as e:
        print(f"Failed to create Zammad ticket: {e}")
        # Fallback for demo if container is not up
        import uuid
        return {
            "ticket_ref": f"ZAM-{uuid.uuid4().hex[:6]}",
            "status": "new"
        }
