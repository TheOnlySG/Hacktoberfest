import uuid
import datetime
from backend.router.org_router import load_org_profiles
from backend.adapters.sandbox import sandbox_create_ticket

def dispatch_drafts(passage_id: str, approved_drafts: list, org_plan: dict, relay_rules: dict) -> list:
    """
    Executes the approved drafts in dependency order.
    """
    profiles = load_org_profiles()
    
    # Map orgs to their dispatch order
    org_order_map = {}
    for org in org_plan.get('orgs', []):
        org_order_map[org['slug']] = org.get('dispatch_order', 1)
        
    # Sort approved drafts by dispatch order
    approved_drafts.sort(key=lambda d: org_order_map.get(d['org_slug'], 1))
    
    created_tickets = []
    ticket_refs_by_org = {}
    
    for draft in approved_drafts:
        org_slug = draft['org_slug']
        profile = profiles.get(org_slug)
        if not profile:
            continue
            
        # 1. Dependency Injection
        # If this draft depends on another org's ticket ref, inject it.
        depends_on = profile.get('depends_on', [])
        for dep in depends_on:
            dep_org = dep['org']
            if dep_org in ticket_refs_by_org:
                target_field = dep['as']
                draft['fields'][target_field] = ticket_refs_by_org[dep_org]
                
        # 2. Adapter Selection
        channels = profile.get('channels', [])
        primary_channel = channels[0] if channels else {"type": "sandbox_api"}
        channel_type = primary_channel.get('type')
        
        # 3. Dispatch
        if channel_type == 'email':
            from backend.adapters.email import send_email_ticket
            address = primary_channel.get('address', 'unknown@localhost')
            generate_pdf = org_slug == 'shieldmotor' # Hardcoded rule per PRD Case 3
            result = send_email_ticket(org_slug, address, draft['fields'], draft['evidence_selection'], generate_pdf)
        elif channel_type == 'helpdesk_rest':
            from backend.adapters.zammad import zammad_create_ticket
            result = zammad_create_ticket(org_slug, draft['fields'], draft['evidence_selection'])
        elif channel_type == 'open311':
            from backend.adapters.open311 import open311_create_request
            result = open311_create_request(org_slug, draft['fields'], draft['evidence_selection'])
        else:
            # Default to sandbox
            result = sandbox_create_ticket(org_slug, draft['fields'], draft['evidence_selection'])
            
        ticket_ref = result['ticket_ref']
        raw_status = result['status']
        
        ticket_refs_by_org[org_slug] = ticket_ref
        
        # Normalize status
        normalized_status = profile.get('status_map', {}).get(raw_status, 'submitted')
        
        ticket = {
            "id": f"t-{uuid.uuid4().hex[:8]}",
            "org_slug": org_slug,
            "ticket_ref": ticket_ref,
            "normalized_status": normalized_status,
            "raw_status": raw_status,
            "last_sync_time": datetime.datetime.utcnow().isoformat()
        }
        created_tickets.append(ticket)
        
        # 4. Hash Chain Event (Mocked)
        # In a real app, write to the hash chain DB.
        
        # 5. Consent Record (Mocked)
        # In a real app, write to the consent records DB.

    return created_tickets
