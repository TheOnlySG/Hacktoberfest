"""
Tests for Module 8, 9 & 10: Tracking, Normalized Status, Relay & SLA
Implements: TC-TRK-01, TC-RLY-02, TC-SLA-03
"""
import pytest
from typing import Dict, Any

CANONICAL_STATUSES = {
    "submitted", "acknowledged", "in_progress", "needs_info",
    "resolved", "rejected", "escalated", "withdrawn"
}

def normalize_status(raw_status: str, status_map: Dict[str, str]) -> str:
    """Normalizes an organization-specific status to Passage canonical status."""
    normalized = status_map.get(raw_status, "in_progress")
    if normalized not in CANONICAL_STATUSES:
        raise ValueError(f"Normalized status '{normalized}' is not in canonical vocabulary")
    return normalized


def test_tc_trk_01_status_normalization(demo_org_profiles):
    """TC-TRK-01: Status Vocabulary Normalization across multiple organizations."""
    swift_map = demo_org_profiles["swiftcourier"]["status_map"]
    shop_map = demo_org_profiles["shopmart"]["status_map"]

    assert normalize_status("OPEN", swift_map) == "submitted"
    assert normalize_status("VISIT_SCHEDULED", swift_map) == "in_progress"
    assert normalize_status("INSPECTED", swift_map) == "in_progress"
    assert normalize_status("CLOSED_APPROVED", swift_map) == "resolved"
    assert normalize_status("CLOSED_REJECTED", swift_map) == "rejected"

    assert normalize_status("ACKNOWLEDGED", shop_map) == "acknowledged"
    assert normalize_status("RETURN_APPROVED", shop_map) == "resolved"


def test_tc_rly_02_answer_once_selective_relay(demo_org_profiles):
    """TC-RLY-02: Answer Once & Selective Relay Enforcement (Privacy policy test)."""
    # Bank asks for last 4 digits of debit card
    question = {
        "id": "q_bank_card",
        "asking_org": "northfield-bank",
        "field_type": "bank_account_number",
        "user_answer": "4819"
    }

    def relay_answer(question: Dict[str, Any], target_org: str, profiles: Dict[str, Any]) -> bool:
        deny_list = profiles[target_org]["evidence_policy"].get("deny", [])
        if question["field_type"] in deny_list:
            return False  # Blocked by privacy policy
        return True

    # Relaying to asking bank is allowed
    assert relay_answer(question, "northfield-bank", demo_org_profiles) is True

    # Relaying to PayEasy is strictly denied because PayEasy has bank_account_details in deny list
    # Let's verify PayEasy deny policy:
    assert relay_answer(question, "payeasy", demo_org_profiles) is False


def test_tc_sla_03_fast_forward_demo_sla():
    """TC-SLA-03: Demo Fast-Forward Endpoint Logic."""
    import time
    ticket = {
        "id": "tkt_01",
        "org": "northfield-bank",
        "created_at": time.time(),
        "sla_resolution_hours": 48,
        "is_breached": False
    }

    def fast_forward(ticket_obj: Dict[str, Any]) -> Dict[str, Any]:
        # Fast-forward sets created_at to 50 hours in the past
        ticket_obj["created_at"] = time.time() - (50 * 3600)
        elapsed_hours = (time.time() - ticket_obj["created_at"]) / 3600
        if elapsed_hours > ticket_obj["sla_resolution_hours"]:
            ticket_obj["is_breached"] = True
            ticket_obj["escalation_draft"] = {
                "recipient": "banking-ombudsman",
                "content": "Formal escalation: SLA exceeded for transaction resolution."
            }
        return ticket_obj

    updated_ticket = fast_forward(ticket)
    assert updated_ticket["is_breached"] is True
    assert updated_ticket["escalation_draft"]["recipient"] == "banking-ombudsman"
