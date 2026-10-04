import os
import json
import uuid
from groq import Groq
from backend.config import settings
from backend.router.org_router import load_org_profiles

def compose_drafts(passage: dict, org_plan: dict) -> list:
    if settings.USE_CACHED_AI:
        org_slugs = [o.get('slug') for o in org_plan.get('orgs', [])]
        
        # Comprehensive catalog of verified drafts for all supported domains
        sample_drafts_pool = {
            "shopmart": {
                "draft_id": "d-shopmart-1",
                "org_slug": "shopmart",
                "status": "draft",
                "ticket_type": "marketplace.return_replace.v1",
                "fields": {
                    "order_id": "SHG-20418",
                    "item_sku": "SKU-999-CERAMIC",
                    "issue_type": "damaged_on_arrival",
                    "requested_outcome": "replacement",
                    "logistics": {
                        "pickup_address": "Flat 4B, Gulmohar Enclave, Pune 411007",
                        "contact_window": "Tomorrow 10 AM - 1 PM"
                    }
                },
                "evidence_selection": {
                    "invoice_attached": True,
                    "photos_attached": True
                },
                "field_sources": {
                    "order_id": "document",
                    "item_sku": "document",
                    "issue_type": "ai",
                    "requested_outcome": "user"
                }
            },
            "swiftcourier": {
                "draft_id": "d-swiftcourier-1",
                "org_slug": "swiftcourier",
                "status": "draft",
                "ticket_type": "courier.damage_inspection.v1",
                "fields": {
                    "awb": "SR-882190",
                    "delivery_date": "2026-10-03",
                    "damage_type": "Crushed corner, fractured contents",
                    "logistics": {
                        "consignee_name": "Mira Sen",
                        "phone": "+91 98201 44812",
                        "address": "Flat 4B, Gulmohar Enclave, Pune 411007",
                        "visit_slots": ["Tomorrow Morning 10:00 AM - 1:00 PM"]
                    },
                    "shipper_claim_ref": "SHG-CLM-8821",
                    "consent": {
                        "inspector_can_photograph": True
                    }
                },
                "evidence_selection": {
                    "outer_package_photos_attached": True,
                    "delivery_notification_attached": True
                },
                "field_sources": {
                    "awb": "document",
                    "delivery_date": "document",
                    "damage_type": "user",
                    "logistics": "user"
                }
            },
            "swiftroute": {
                "draft_id": "d-swiftroute-1",
                "org_slug": "swiftroute",
                "status": "draft",
                "ticket_type": "courier.damage_inspection.v1",
                "fields": {
                    "awb": "SR-882190",
                    "delivery_date": "2026-10-03",
                    "damage_type": "Crushed corner, fractured contents",
                    "logistics": {
                        "consignee_name": "Mira Sen",
                        "phone": "+91 98201 44812",
                        "address": "Flat 4B, Gulmohar Enclave, Pune 411007",
                        "visit_slots": ["Tomorrow Morning 10:00 AM - 1:00 PM"]
                    },
                    "shipper_claim_ref": "SHG-CLM-8821",
                    "consent": {
                        "inspector_can_photograph": True
                    }
                },
                "evidence_selection": {
                    "outer_package_photos_attached": True,
                    "delivery_notification_attached": True
                },
                "field_sources": {
                    "awb": "document",
                    "delivery_date": "document",
                    "damage_type": "user",
                    "logistics": "user"
                }
            },
            "payeasy": {
                "draft_id": "d-payeasy-1",
                "org_slug": "payeasy",
                "status": "draft",
                "ticket_type": "payment_app.dispute.v1",
                "fields": {
                    "upi_txn_id": "UPI-4819204812",
                    "remitter_vpa": "mira@okaxis",
                    "amount": "2850",
                    "dispute_type": "debit_without_credit"
                },
                "evidence_selection": {
                    "app_screenshot": True,
                    "statement_extract": True
                },
                "field_sources": {
                    "upi_txn_id": "document",
                    "amount": "document"
                }
            },
            "northfield_bank": {
                "draft_id": "d-northfield-1",
                "org_slug": "northfield_bank",
                "status": "draft",
                "ticket_type": "bank.transaction_complaint.v1",
                "fields": {
                    "account_last_four": "1234",
                    "debit_rrn": "RRN-992104882190",
                    "amount": "2850",
                    "tpap_incident_ref": "PE-DISP-4012"
                },
                "evidence_selection": {
                    "statement_extract": True,
                    "sms_proof": True
                },
                "field_sources": {
                    "account_last_four": "user",
                    "debit_rrn": "document"
                }
            },
            "municipal_water": {
                "draft_id": "d-munwater-1",
                "org_slug": "municipal_water",
                "status": "draft",
                "ticket_type": "municipality.water_leak.v1",
                "fields": {
                    "service_code": "water_burst_hazard",
                    "latitude": "18.5204",
                    "longitude": "73.8567",
                    "description": "High pressure water pipe ruptured on 5th Avenue causing flash street flooding."
                },
                "evidence_selection": {
                    "street_photos": True
                },
                "field_sources": {
                    "service_code": "ai",
                    "description": "user"
                }
            },
            "power_utility": {
                "draft_id": "d-powerutil-1",
                "org_slug": "power_utility",
                "status": "draft",
                "ticket_type": "utility.hazard_report.v1",
                "fields": {
                    "box_number": "TX-409A",
                    "hazard_type": "water_submersion_live_feeder",
                    "immediate_danger": "high"
                },
                "evidence_selection": {
                    "hazard_photos": True
                },
                "field_sources": {
                    "box_number": "user",
                    "immediate_danger": "ai"
                }
            },
            "shield_insurance": {
                "draft_id": "d-shield-1",
                "org_slug": "shield_insurance",
                "status": "draft",
                "ticket_type": "insurer.claim_intimation.v1",
                "fields": {
                    "policy_number": "POL-SHIELD-99120",
                    "vehicle_reg": "MH-12-BQ-8812",
                    "loss_description": "Vehicle floorboard and engine submerged by municipal pipe burst on 5th Avenue.",
                    "third_party_incident_ref": "MWD-LEAK-771"
                },
                "evidence_selection": {
                    "policy_pdf": True,
                    "vehicle_photos": True
                },
                "field_sources": {
                    "policy_number": "document",
                    "loss_description": "user"
                }
            }
        }

        if org_slugs:
            drafts = [sample_drafts_pool[s] for s in org_slugs if s in sample_drafts_pool]
            if drafts:
                return drafts

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
