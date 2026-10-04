import os
import json
import uuid
from groq import Groq
from backend.config import settings
from backend.router.org_router import load_org_profiles

def compose_drafts(passage: dict, org_plan: dict) -> list:
    if settings.USE_CACHED_AI:
        cache_path = os.path.join(os.path.dirname(__file__), '../../protocol/examples/example_drafts.json')
        if os.path.exists(cache_path):
            with open(cache_path, 'r') as f:
                return json.load(f)
        return []

    profiles = load_org_profiles()
    drafts = []
    
    api_key = settings.GROQ_API_KEY
    if not api_key:
        api_key = os.environ.get("GROQ_API_KEY", "")
        
    client = Groq(api_key=api_key) if api_key else None
    
    prompt_path = os.path.join(os.path.dirname(__file__), '../../ai/prompts/composer.md')
    if os.path.exists(prompt_path):
        with open(prompt_path, 'r') as f:
            system_prompt = f.read()
    else:
        system_prompt = ""

    schemas_dir = os.path.join(os.path.dirname(__file__), '../../protocol/schemas')

    for org_info in org_plan.get('orgs', []):
        slug = org_info.get('slug')
        profile = profiles.get(slug)
        if not profile:
            continue
            
        schema_path = os.path.join(os.path.dirname(__file__), '../../protocol', profile.get('schema', ''))
        schema_content = {}
        if os.path.exists(schema_path):
            with open(schema_path, 'r') as f:
                schema_content = json.load(f)
                
        allowed_evidence = profile.get('evidence_policy', {}).get('allow', [])
        denied_evidence = profile.get('evidence_policy', {}).get('deny', [])
        
        draft = {
            "draft_id": f"d-{uuid.uuid4().hex[:8]}",
            "org_slug": slug,
            "status": "draft",
            "ticket_type": profile.get("ticket_type"),
            "fields": {},
            "evidence_selection": {},
            "field_sources": {}
        }
        
        if client and system_prompt and schema_content:
            prompt = system_prompt.format(
                org_slug=slug,
                allowed_evidence=json.dumps(allowed_evidence),
                denied_evidence=json.dumps(denied_evidence),
                passage_json=json.dumps(passage),
                ticket_schema=json.dumps(schema_content)
            )
            
            try:
                response = client.chat.completions.create(
                    model="llama-3.3-70b-versatile",
                    messages=[
                        {"role": "system", "content": prompt},
                        {"role": "user", "content": f"Generate ticket draft for {slug}."}
                    ],
                    response_format={"type": "json_object"}
                )
                
                result = json.loads(response.choices[0].message.content)
                # In a robust implementation, we would validate result against schema using jsonschema here
                
                # Assume the model output maps directly to the schema's root properties.
                # Extract fields and evidence
                evidence = result.get('evidence', {})
                fields = {k: v for k, v in result.items() if k != 'evidence'}
                
                draft['fields'] = fields
                draft['evidence_selection'] = evidence
                
                # Tag sources
                for k in fields.keys():
                    draft['field_sources'][k] = "ai"
                    
            except Exception as e:
                print(f"Composer failed for {slug}: {e}")
                
        drafts.append(draft)
        
    return drafts
