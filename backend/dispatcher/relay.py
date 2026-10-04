import uuid

# Mock DB for questions asked by orgs
QUESTIONS_DB = []

def seed_questions_for_passage(passage_id: str, tickets: list):
    """
    Populates questions from receiving organizations when tickets are dispatched.
    """
    org_slugs = [t.get('org_slug') for t in tickets]
    
    # Check if questions already exist for this passage
    if any(q.get('passage_id') == passage_id for q in QUESTIONS_DB):
        return

    if any(s in org_slugs for s in ['swiftcourier', 'swiftroute', 'shopmart']):
        t_ref = next((t.get('ticket_ref') for t in tickets if t.get('org_slug') in ['swiftcourier', 'swiftroute']), 'SR-INSP-4019')
        QUESTIONS_DB.append({
            "id": f"q-{passage_id}-1",
            "passage_id": passage_id,
            "org_slug": "swiftcourier",
            "org_name": "SwiftRoute Logistics",
            "ticket_ref": t_ref,
            "text": "SwiftRoute field inspector #84 (Sunil Jadhav) is scheduled for your area. Please confirm when the parcel box will be available for physical inspection and photo capture.",
            "options": [
                "Available Tomorrow Morning (10:00 AM – 01:00 PM IST)",
                "Available Tomorrow Afternoon (02:00 PM – 05:00 PM IST)",
                "Leave package with building security guard"
            ],
            "status": "open",
            "relay_notice": "Your response will be relayed directly to SwiftRoute field dispatch and logged to your docket."
        })
    elif any(s in org_slugs for s in ['payeasy', 'northfield_bank', 'northfield']):
        t_ref = next((t.get('ticket_ref') for t in tickets if 'northfield' in t.get('org_slug', '')), 'NFB-REV-9014')
        QUESTIONS_DB.append({
            "id": f"q-{passage_id}-2",
            "passage_id": passage_id,
            "org_slug": "northfield_bank",
            "org_name": "Northfield Bank",
            "ticket_ref": t_ref,
            "text": "Northfield Bank Dispute Desk: Did your PayEasy app display a 12-digit UPI RRN / Bank Reference Number on your failed payment screen?",
            "options": [
                "Yes, RRN 629104882190 was displayed",
                "No RRN was generated; screen showed only 'Session Timed Out'",
                "Attached full bank statement showing debit timestamp"
            ],
            "status": "open",
            "relay_notice": "Your confirmation will be forwarded directly to the NPCI clearing dispute system."
        })
    elif any(s in org_slugs for s in ['municipal_water', 'power_utility', 'shield_insurance', 'open311', 'shieldmotor']):
        t_ref = next((t.get('ticket_ref') for t in tickets if 'water' in t.get('org_slug', '') or 'open311' in t.get('org_slug', '')), 'MWD-LEAK-771')
        QUESTIONS_DB.append({
            "id": f"q-{passage_id}-3",
            "passage_id": passage_id,
            "org_slug": "municipal_water",
            "org_name": "Municipal Water Department",
            "ticket_ref": t_ref,
            "text": "Municipal Water Crew #12: Is the water burst currently entering private building compound or restricted to the street lane?",
            "options": [
                "Water has entered basement parking lot and submerged private vehicles",
                "Flooding is restricted to street asphalt; sewer line is overflowing",
                "Flow has stopped but pavement collapsed leaving hazardous crater"
            ],
            "status": "open",
            "relay_notice": "Response feeds into municipal emergency maintenance dispatch."
        })

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
