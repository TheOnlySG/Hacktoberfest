import uuid
import datetime

# In-memory store for sandbox tickets (reset on server restart)
SANDBOX_DB = {}

def get_prefix(org_slug: str) -> str:
    prefixes = {
        "shopmart": "SM",
        "swiftcourier": "SWC",
        "payeasy": "PE",
        "northfield-bank": "NFB",
        "municipal-water": "MWD",
        "power-utility": "PU",
        "shield-motor": "SMI"
    }
    return prefixes.get(org_slug, org_slug[:3].upper())

def sandbox_create_ticket(org_slug: str, fields: dict, evidence: dict) -> dict:
    """
    Creates a ticket in the mock sandbox environment.
    """
    prefix = get_prefix(org_slug)
    ticket_id = f"{prefix}-{uuid.uuid4().hex[:6].upper()}"
    
    ticket = {
        "id": ticket_id,
        "org_slug": org_slug,
        "fields": fields,
        "evidence": evidence,
        "status": "OPEN",  # Default sandbox status
        "created_at": datetime.datetime.utcnow().isoformat()
    }
    
    if org_slug not in SANDBOX_DB:
        SANDBOX_DB[org_slug] = {}
        
    SANDBOX_DB[org_slug][ticket_id] = ticket
    
    return {
        "ticket_ref": ticket_id,
        "status": "OPEN"
    }

def sandbox_get_ticket(org_slug: str, ticket_id: str) -> dict:
    return SANDBOX_DB.get(org_slug, {}).get(ticket_id)

def sandbox_update_status(org_slug: str, ticket_id: str, new_status: str) -> dict:
    ticket = sandbox_get_ticket(org_slug, ticket_id)
    if ticket:
        ticket['status'] = new_status
        return ticket
    return None

def sandbox_list_tickets(org_slug: str) -> list:
    return list(SANDBOX_DB.get(org_slug, {}).values())
