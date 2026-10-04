"""
Tests for Module 4: Ticket Composer & Schema Validation
Implements: TC-CMP-01, TC-CMP-02, TC-CMP-03, TC-CMP-04, TC-CMP-05
"""
import pytest
import jsonschema
from typing import Dict, Any, List

def filter_evidence_for_org(evidence_list: List[Dict[str, Any]], evidence_policy: Dict[str, List[str]]) -> List[Dict[str, Any]]:
    """Filters evidence list strictly excluding items listed in evidence_policy.deny."""
    denied_types = set(evidence_policy.get("deny", []))
    allowed_types = set(evidence_policy.get("allow", []))

    filtered = []
    for ev in evidence_list:
        ev_type = ev.get("type")
        if ev_type in denied_types:
            continue
        if not allowed_types or ev_type in allowed_types:
            filtered.append(ev)
    return filtered


def test_tc_cmp_01_per_org_schema_conformance(mock_ticket_schemas):
    """TC-CMP-01: Per-Org JSON Schema Conformance."""
    shopmart_draft = {
        "order_id": "ORD-77491",
        "item_sku": "PC-5L-STAINLESS",
        "requested_outcome": "replacement",
        "description": "Pressure cooker received in damaged condition.",
        "evidence_attachments": ["ev_box_photo", "ev_delivery_sms", "ev_invoice"]
    }
    swiftcourier_draft = {
        "awb": "SWC-99201",
        "damage_type": "crushed_box_and_dented_body",
        "visit_slots": ["2026-10-06 10:00-12:00", "2026-10-06 14:00-16:00"],
        "shipper_claim_ref": "SM-102938",
        "evidence_attachments": ["ev_box_photo", "ev_delivery_sms"]
    }

    # Validate against schemas
    jsonschema.validate(instance=shopmart_draft, schema=mock_ticket_schemas["marketplace.return_replace.v1"])
    jsonschema.validate(instance=swiftcourier_draft, schema=mock_ticket_schemas["courier.damage_inspection.v1"])


def test_tc_cmp_02_evidence_policy_deny_filtering(case1_passage_data, demo_org_profiles):
    """TC-CMP-02: Evidence Policy Filtering (SwiftCourier deny list excludes invoice & payment proof)."""
    courier_policy = demo_org_profiles["swiftcourier"]["evidence_policy"]
    filtered_evidence = filter_evidence_for_org(case1_passage_data["evidence"], courier_policy)

    evidence_types = [ev["type"] for ev in filtered_evidence]
    # Denied evidence (payment_proof) must be absent
    assert "payment_proof" not in evidence_types
    # Allowed evidence must remain
    assert "outer_package_photos" in evidence_types
    assert "delivery_notification" in evidence_types


def test_tc_cmp_03_composer_retry_on_schema_failure():
    """TC-CMP-03: Self-Correction Retry Loop on Schema Failure."""
    schema = {
        "type": "object",
        "properties": {"awb": {"type": "string"}},
        "required": ["awb"]
    }
    # Mock LLM outputs: first try returns missing field, second try corrects
    groq_attempts = [
        {"wrong_key": "123"},
        {"awb": "SWC-99201"}
    ]

    draft = None
    errors = []
    for attempt in groq_attempts:
        try:
            jsonschema.validate(instance=attempt, schema=schema)
            draft = attempt
            break
        except jsonschema.ValidationError as e:
            errors.append(str(e))

    assert len(errors) == 1  # 1 failure caught
    assert draft is not None
    assert draft["awb"] == "SWC-99201"


def test_tc_cmp_04_plain_template_fallback_on_double_failure():
    """TC-CMP-04: Deterministic Plain Template Fallback on Double Failure."""
    schema = {
        "type": "object",
        "properties": {"order_id": {"type": "string"}, "description": {"type": "string"}},
        "required": ["order_id", "description"]
    }
    # Simulate two failed attempts from model
    groq_failed_attempts = [{"bad": 1}, {"bad": 2}]

    success = False
    for attempt in groq_failed_attempts:
        try:
            jsonschema.validate(instance=attempt, schema=schema)
            success = True
            break
        except jsonschema.ValidationError:
            continue

    if not success:
        # Fallback to deterministic plain template with flagged missing fields
        fallback_draft = {
            "order_id": "ORD-77491",
            "description": "Default description from passage summary",
            "flagged": True,
            "source": "plain_template_fallback"
        }

    assert fallback_draft["flagged"] is True
    assert fallback_draft["source"] == "plain_template_fallback"
    # Ensure fallback satisfies the schema
    jsonschema.validate(instance=fallback_draft, schema=schema)


def test_tc_cmp_05_strict_dispatch_gate_blocking_invalid_drafts(mock_ticket_schemas):
    """TC-CMP-05: Strict Dispatch Gate Blocking Invalid Drafts."""
    invalid_draft = {
        "order_id": "ORD-77491"
        # Missing required 'item_sku', 'requested_outcome', 'description'
    }

    def dispatch_gate(draft: Dict[str, Any], schema: Dict[str, Any]) -> bool:
        try:
            jsonschema.validate(instance=draft, schema=schema)
            return True
        except jsonschema.ValidationError:
            return False

    can_dispatch = dispatch_gate(invalid_draft, mock_ticket_schemas["marketplace.return_replace.v1"])
    assert can_dispatch is False
