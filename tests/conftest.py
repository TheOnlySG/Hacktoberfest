import pytest
import hashlib
import json
from typing import Dict, Any, List

@pytest.fixture
def sample_hash_chain() -> List[Dict[str, Any]]:
    """Creates a valid 3-event SHA-256 hash chain for testing integrity."""
    events = []
    
    # Event 0: Genesis / Passage created
    e0_payload = {"event": "passage_created", "passage_id": "pas_1001", "user": "mira"}
    e0_hash = hashlib.sha256(json.dumps(e0_payload, sort_keys=True).encode()).hexdigest()
    events.append({
        "index": 0,
        "prev_hash": "0" * 64,
        "payload": e0_payload,
        "hash": e0_hash
    })
    
    # Event 1: Drafts approved
    e1_payload = {"event": "drafts_approved", "orgs": ["shopmart", "swiftcourier"]}
    e1_data = events[0]["hash"] + json.dumps(e1_payload, sort_keys=True)
    e1_hash = hashlib.sha256(e1_data.encode()).hexdigest()
    events.append({
        "index": 1,
        "prev_hash": events[0]["hash"],
        "payload": e1_payload,
        "hash": e1_hash
    })
    
    # Event 2: Dispatched
    e2_payload = {"event": "dispatched", "org": "shopmart", "ticket_ref": "SM-102938"}
    e2_data = events[1]["hash"] + json.dumps(e2_payload, sort_keys=True)
    e2_hash = hashlib.sha256(e2_data.encode()).hexdigest()
    events.append({
        "index": 2,
        "prev_hash": events[1]["hash"],
        "payload": e2_payload,
        "hash": e2_hash
    })
    
    return events


@pytest.fixture
def case1_passage_data() -> Dict[str, Any]:
    """Canonical Passage data for Case 1 (The Damaged Parcel)."""
    return {
        "id": "pas_case1_parcel",
        "user_name": "Mira",
        "problem_summary": "Pressure cooker arrived with crushed box and dented body.",
        "issue_type": "damaged_on_arrival",
        "identifiers": {
            "order_id": "ORD-77491",
            "item_sku": "PC-5L-STAINLESS",
            "awb": "SWC-99201"
        },
        "evidence": [
            {"id": "ev_box_photo", "type": "outer_package_photos", "description": "Photos of crushed outer box"},
            {"id": "ev_delivery_sms", "type": "delivery_notification", "description": "Courier delivery confirmation SMS"},
            {"id": "ev_invoice", "type": "payment_proof", "description": "Tax invoice and payment receipt"}
        ],
        "requested_outcome": "replacement",
        "status": "confirmed"
    }


@pytest.fixture
def demo_org_profiles() -> Dict[str, Dict[str, Any]]:
    """Fixture containing reference Org Profiles for ShopMart and SwiftCourier."""
    return {
        "shopmart": {
            "slug": "shopmart",
            "name": "ShopMart",
            "domain": "e-commerce",
            "channels": [{"type": "sandbox_api", "priority": 1}],
            "ticket_type": "marketplace.return_replace.v1",
            "triggers": {
                "identifiers": ["order_id"],
                "issue_types": ["damaged_on_arrival", "wrong_item", "not_delivered"]
            },
            "required_fields": ["order_id", "item_sku", "requested_outcome"],
            "evidence_policy": {
                "allow": ["outer_package_photos", "delivery_notification", "payment_proof"],
                "deny": []
            },
            "depends_on": [],
            "sla": {"first_response_hours": 24, "resolution_hours": 72, "escalate_to": "shopmart-grievance"},
            "status_map": {
                "OPEN": "submitted",
                "ACKNOWLEDGED": "acknowledged",
                "RETURN_APPROVED": "resolved",
                "REJECTED": "rejected"
            }
        },
        "swiftcourier": {
            "slug": "swiftcourier",
            "name": "SwiftCourier",
            "domain": "logistics",
            "channels": [
                {"type": "sandbox_api", "priority": 1},
                {"type": "email", "address": "claims@swiftcourier.example", "priority": 2}
            ],
            "ticket_type": "courier.damage_inspection.v1",
            "triggers": {
                "identifiers": ["awb"],
                "issue_types": ["damaged_on_arrival"]
            },
            "required_fields": ["awb", "damage_type", "visit_slots", "shipper_claim_ref"],
            "evidence_policy": {
                "allow": ["outer_package_photos", "delivery_notification"],
                "deny": ["payment_proof", "bank_statement", "other_party_chat"]
            },
            "depends_on": [{"org": "shopmart", "need": "ticket_ref", "as": "shipper_claim_ref"}],
            "sla": {"first_response_hours": 24, "resolution_hours": 96, "escalate_to": "swiftcourier-nodal"},
            "status_map": {
                "OPEN": "submitted",
                "VISIT_SCHEDULED": "in_progress",
                "INSPECTED": "in_progress",
                "CLOSED_APPROVED": "resolved",
                "CLOSED_REJECTED": "rejected"
            }
        },
        "payeasy": {
            "slug": "payeasy",
            "name": "PayEasy",
            "domain": "finance",
            "channels": [{"type": "sandbox_api", "priority": 1}],
            "ticket_type": "payment_app.dispute.v1",
            "triggers": {
                "identifiers": ["upi_txn_id", "vpa"],
                "issue_types": ["debited_not_credited"]
            },
            "required_fields": ["upi_txn_id", "vpa", "amount"],
            "evidence_policy": {
                "allow": ["app_screenshot", "transaction_receipt"],
                "deny": ["bank_account_number", "bank_statement"]
            },
            "depends_on": [],
            "sla": {"first_response_hours": 12, "resolution_hours": 48, "escalate_to": "payeasy-ombudsman"},
            "status_map": {
                "PENDING": "submitted",
                "INVESTIGATING": "in_progress",
                "REVERSED": "resolved"
            }
        },
        "northfield-bank": {
            "slug": "northfield-bank",
            "name": "Northfield Bank",
            "domain": "finance",
            "channels": [{"type": "zammad_api", "priority": 1}],
            "ticket_type": "bank.transaction_complaint.v1",
            "triggers": {
                "identifiers": ["rrn", "account_last_four"],
                "issue_types": ["debited_not_credited"]
            },
            "required_fields": ["account_last_four", "rrn", "debit_date"],
            "evidence_policy": {
                "allow": ["bank_statement", "sms_extract"],
                "deny": ["merchant_chat", "app_account_details"]
            },
            "depends_on": [],
            "sla": {"first_response_hours": 24, "resolution_hours": 72, "escalate_to": "banking-ombudsman"},
            "status_map": {
                "NEW": "submitted",
                "OPEN": "in_progress",
                "CLOSED": "resolved"
            }
        }
    }


@pytest.fixture
def mock_ticket_schemas() -> Dict[str, Dict[str, Any]]:
    """JSON Schemas for demo org tickets."""
    return {
        "marketplace.return_replace.v1": {
            "$schema": "https://json-schema.org/draft/2020-12/schema",
            "type": "object",
            "properties": {
                "order_id": {"type": "string"},
                "item_sku": {"type": "string"},
                "requested_outcome": {"type": "string", "enum": ["replacement", "refund"]},
                "description": {"type": "string"},
                "evidence_attachments": {"type": "array", "items": {"type": "string"}}
            },
            "required": ["order_id", "item_sku", "requested_outcome", "description"]
        },
        "courier.damage_inspection.v1": {
            "$schema": "https://json-schema.org/draft/2020-12/schema",
            "type": "object",
            "properties": {
                "awb": {"type": "string"},
                "damage_type": {"type": "string"},
                "visit_slots": {"type": "array", "items": {"type": "string"}},
                "shipper_claim_ref": {"type": "string"},
                "evidence_attachments": {"type": "array", "items": {"type": "string"}}
            },
            "required": ["awb", "damage_type", "visit_slots", "shipper_claim_ref"]
        }
    }
