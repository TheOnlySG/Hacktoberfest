import os
import json
from groq import Groq
from backend.config import settings

def load_org_profiles():
    orgs_dir = os.path.join(os.path.dirname(__file__), '../../protocol/orgs')
    profiles = {}
    if not os.path.exists(orgs_dir):
        return profiles
    for filename in os.listdir(orgs_dir):
        if filename.endswith('.json'):
            with open(os.path.join(orgs_dir, filename), 'r') as f:
                data = json.load(f)
                profiles[data['slug']] = data

    # Aliases for frontend and protocol cross-compatibility
    aliases = {
        'swiftroute': 'swiftcourier',
        'northfield': 'northfield_bank',
        'northfield-bank': 'northfield_bank',
        'open311': 'municipal_water',
        'municipal-water': 'municipal_water',
        'powerutility': 'power_utility',
        'power-utility': 'power_utility',
        'shieldmotor': 'shield_insurance',
        'shield-motor': 'shield_insurance',
    }
    for alias, target in aliases.items():
        if target in profiles and alias not in profiles:
            aliased = dict(profiles[target])
            aliased['slug'] = alias
            profiles[alias] = aliased

    return profiles

def determine_org_plan(passage: dict) -> dict:
    if settings.USE_CACHED_AI:
        desc = (passage.get("problem_description") or "").lower()
        entities = str(passage.get("entities") or {}).lower()
        combined = f"{desc} {entities}"

        if any(w in combined for w in ["upi", "payeasy", "northfield", "ramesh", "debit"]):
            return {
                "orgs": [
                    {
                        "slug": "payeasy",
                        "reason": "Payment app initiating transaction where debit occurred without credit.",
                        "source": "rule_matched",
                        "dispatch_order": 1,
                        "dependencies": []
                    },
                    {
                        "slug": "northfield_bank",
                        "reason": "Remitter bank debited without merchant settlement. Dependent on PayEasy claim ref.",
                        "source": "rule_matched",
                        "dispatch_order": 2,
                        "dependencies": [
                            {"org": "payeasy", "need": "ticket_ref", "as": "tpap_incident_ref"}
                        ]
                    }
                ]
            }
        elif any(w in combined for w in ["pipe", "burst", "water", "flood", "avenue", "utility", "car", "submerged"]):
            return {
                "orgs": [
                    {
                        "slug": "municipal_water",
                        "reason": "Municipal water main burst reported in public street.",
                        "source": "rule_matched",
                        "dispatch_order": 1,
                        "dependencies": []
                    },
                    {
                        "slug": "power_utility",
                        "reason": "Submerged electrical distribution boxes near flooding creating electrocution hazard.",
                        "source": "rule_matched",
                        "dispatch_order": 1,
                        "dependencies": []
                    },
                    {
                        "slug": "shield_insurance",
                        "reason": "Comprehensive vehicle flood damage claim intimation; dependent on municipal leak docket.",
                        "source": "rule_matched",
                        "dispatch_order": 2,
                        "dependencies": [
                            {"org": "municipal_water", "need": "ticket_ref", "as": "third_party_incident_ref"}
                        ]
                    }
                ]
            }
        else:
            cache_path = os.path.join(os.path.dirname(__file__), '../../protocol/examples/example_plan.json')
            if os.path.exists(cache_path):
                with open(cache_path, 'r') as f:
                    return json.load(f)
            return {"orgs": []}

    profiles = load_org_profiles()
    matched_orgs = []
    
    # 1. Deterministic Rule Matching
    passage_entities = passage.get('entities', {})
    
    for slug, profile in profiles.items():
        triggers = profile.get('triggers', {})
        identifiers = triggers.get('identifiers', [])
        
        # Check if any required identifier is present in passage entities
        matched = False
        for ident in identifiers:
            # We do a loose check for hackathon purposes
            for key, val in passage_entities.items():
                if ident.lower() in key.lower() or ident.lower() in str(val).lower():
                    matched = True
                    break
            if matched: break
            
        if matched:
            matched_orgs.append({
                "slug": slug,
                "reason": f"Matched based on identifier rules.",
                "source": "rule_matched",
                "dependencies": profile.get("depends_on", [])
            })

    # 2. LLM Suggestion Pass
    api_key = settings.GROQ_API_KEY
    if not api_key:
        api_key = os.environ.get("GROQ_API_KEY", "")
        
    if api_key:
        client = Groq(api_key=api_key)
        prompt_path = os.path.join(os.path.dirname(__file__), '../../ai/prompts/router.md')
        with open(prompt_path, 'r') as f:
            system_prompt = f.read()
            
        matched_slugs = [o['slug'] for o in matched_orgs]
        available_orgs = [{"slug": s, "name": p.get("name")} for s, p in profiles.items()]
        
        passage_summary = {
            "problem": passage.get("problem_description"),
            "entities": passage.get("entities"),
            "outcome": passage.get("requested_outcome")
        }
        
        prompt = system_prompt.format(
            matched_orgs=json.dumps(matched_slugs),
            available_orgs=json.dumps(available_orgs),
            passage_summary=json.dumps(passage_summary)
        )
        
        model_to_use = getattr(settings, 'GROQ_MODEL', 'openai/gpt-oss-120b')
        try:
            try:
                response = client.chat.completions.create(
                    model=model_to_use,
                    messages=[
                        {"role": "system", "content": prompt},
                        {"role": "user", "content": "Suggest organizations in JSON format: {\"suggested_orgs\": [{\"slug\": \"...\", \"reason\": \"...\"}]}"}
                    ],
                    response_format={"type": "json_object"}
                )
            except Exception:
                response = client.chat.completions.create(
                    model="openai/gpt-oss-20b",
                    messages=[
                        {"role": "system", "content": prompt},
                        {"role": "user", "content": "Suggest organizations in JSON format: {\"suggested_orgs\": [{\"slug\": \"...\", \"reason\": \"...\"}]}"}
                    ],
                    response_format={"type": "json_object"}
                )
            
            result = json.loads(response.choices[0].message.content)
            for suggestion in result.get('suggested_orgs', []):
                slug = suggestion.get('slug')
                if slug in profiles and slug not in matched_slugs:
                    matched_orgs.append({
                        "slug": slug,
                        "reason": suggestion.get('reason'),
                        "source": "ai_suggested",
                        "dependencies": profiles[slug].get("depends_on", [])
                    })
        except Exception as e:
            print(f"LLM routing failed: {e}")

    # 3. Dependency resolution (simple topological sort for dispatch order)
    # For now, we'll assign a simple incremental order.
    # A real topological sort goes here in a full implementation.
    
    # Simple hack: if org depends on another, it goes later
    for i, org in enumerate(matched_orgs):
        org['dispatch_order'] = 2 if org.get('dependencies') else 1

    # Sort by dispatch_order
    matched_orgs.sort(key=lambda x: x['dispatch_order'])
    
    return {"orgs": matched_orgs}
