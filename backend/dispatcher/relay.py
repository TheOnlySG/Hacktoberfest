import uuid

# Mock DB for questions asked by orgs
QUESTIONS_DB = []

def relay_answer_to_org(ticket_id: str, org_slug: str, answer_text: str, attachments: list) -> bool:
    """
    Relays the user's answer back to the organization.
    In a full implementation, this uses the org's adapter (e.g. Zammad REST API to add a comment).
    """
    # Look up org profile to determine channel
    from backend.router.org_router import load_org_profiles
    profiles = load_org_profiles()
    profile = profiles.get(org_slug)
    
    if not profile:
        return False
        
    channels = profile.get('channels', [])
    primary_channel = channels[0] if channels else {"type": "sandbox_api"}
    channel_type = primary_channel.get('type')
    
    print(f"Relaying answer to {org_slug} via {channel_type} for ticket {ticket_id}")
    print(f"Answer: {answer_text}")
    print(f"Attachments: {attachments}")
    
    # Mock dispatch logic
    if channel_type == 'helpdesk_rest':
        # e.g., httpx.post(f"{ZAMMAD_URL}/ticket_articles", ...)
        pass
    elif channel_type == 'email':
        # send email reply
        pass
    elif channel_type == 'open311':
        # post comment to open311
        pass
    else:
        # sandbox: append to in-memory ticket
        from backend.adapters.sandbox import sandbox_get_ticket
        ticket = sandbox_get_ticket(org_slug, ticket_id)
        if ticket:
            if 'comments' not in ticket:
                ticket['comments'] = []
            ticket['comments'].append({
                "from": "user",
                "text": answer_text,
                "attachments": attachments
            })
            
    return True
