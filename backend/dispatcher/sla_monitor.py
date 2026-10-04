import datetime
from apscheduler.schedulers.background import BackgroundScheduler
from backend.router.org_router import load_org_profiles

# Mock database of active tickets
ACTIVE_TICKETS = []

# Mock storage for generated escalation drafts
ESCALATION_DRAFTS = []

def check_slas():
    """
    Periodic job that checks active tickets against their SLA definitions.
    """
    profiles = load_org_profiles()
    now = datetime.datetime.utcnow()
    
    for ticket in ACTIVE_TICKETS:
        org_slug = ticket.get('org_slug')
        profile = profiles.get(org_slug)
        if not profile:
            continue
            
        sla = profile.get('sla', {})
        if not sla:
            continue
            
        status = ticket.get('normalized_status')
        created_at = ticket.get('created_at') # Should be datetime object or ISO string
        
        if isinstance(created_at, str):
            created_at = datetime.datetime.fromisoformat(created_at)
            
        hours_elapsed = (now - created_at).total_seconds() / 3600.0
        
        # Check first response SLA
        if status == 'submitted' and 'first_response_hours' in sla:
            if hours_elapsed > sla['first_response_hours']:
                generate_escalation_draft(ticket, profile, "first_response_breach")
                
        # Check resolution SLA
        if status in ['submitted', 'acknowledged', 'in_progress', 'needs_info']:
            if 'resolution_hours' in sla and hours_elapsed > sla['resolution_hours']:
                generate_escalation_draft(ticket, profile, "resolution_breach")

def generate_escalation_draft(ticket: dict, profile: dict, breach_type: str):
    """
    Generates a draft escalation message (via Groq in a full implementation).
    For MVP, we generate a canned draft.
    """
    # Check if already escalated
    if ticket.get('normalized_status') == 'escalated':
        return
        
    escalate_to = profile.get('sla', {}).get('escalate_to', 'support-manager')
    
    draft = {
        "ticket_id": ticket['id'],
        "org_slug": profile['slug'],
        "escalate_to": escalate_to,
        "breach_type": breach_type,
        "draft_text": f"Escalation regarding ticket {ticket['ticket_ref']}. The SLA for {breach_type} has been breached. Please expedite.",
        "status": "pending_user_approval",
        "created_at": datetime.datetime.utcnow().isoformat()
    }
    
    ESCALATION_DRAFTS.append(draft)
    
    # Mark ticket as escalated to prevent duplicate drafts
    ticket['normalized_status'] = 'escalated'
    print(f"Generated escalation draft for {ticket['ticket_ref']} to {escalate_to}")

def start_sla_monitor():
    scheduler = BackgroundScheduler()
    # In production, this would run every 5 minutes. For demo, we might run it faster or manually trigger.
    scheduler.add_job(check_slas, 'interval', minutes=5)
    scheduler.start()
    return scheduler
