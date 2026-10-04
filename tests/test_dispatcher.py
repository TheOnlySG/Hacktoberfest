"""
Tests for Module 5 & 6: Dispatcher, Dependencies & Consent Gate
Implements: TC-DSP-01, TC-DSP-02, TC-SEC-01, TC-SEC-02, TC-SEC-03
"""
import pytest
import hashlib
import json
from typing import Dict, Any

class MockDispatcher:
    def __init__(self):
        self.dispatched_tickets = {}
        self.consent_records = []

    def dispatch(self, draft: Dict[str, Any], org_slug: str, user_approved: bool) -> Dict[str, Any]:
        if not user_approved:
            raise PermissionError("Dispatch blocked: Explicit user approval required at Consent Gate")

        # Generate ticket reference
        ref_prefix = "SM" if org_slug == "shopmart" else "SWC" if org_slug == "swiftcourier" else "TKT"
        ticket_ref = f"{ref_prefix}-{hash(draft.get('order_id', draft.get('awb', '100')))%1000000:06d}"

        # Record consent
        consent_hash = hashlib.sha256(json.dumps(draft, sort_keys=True).encode()).hexdigest()
        self.consent_records.append({
            "org_slug": org_slug,
            "approved": True,
            "draft_hash": consent_hash,
            "delegation_statement": "Submitted through Passage on behalf of user with authorization."
        })

        ticket_record = {
            "ticket_ref": ticket_ref,
            "org": org_slug,
            "payload": draft,
            "status": "submitted"
        }
        self.dispatched_tickets[org_slug] = ticket_record
        return ticket_record


def test_tc_dsp_01_sequential_dependency_reference_injection():
    """TC-DSP-01: Sequential Dependency Reference Injection (ShopMart ref injected into SwiftCourier)."""
    dispatcher = MockDispatcher()

    # Stage 1: ShopMart Draft
    shopmart_draft = {
        "order_id": "ORD-77491",
        "item_sku": "PC-5L-STAINLESS",
        "description": "Damaged pressure cooker"
    }
    sm_result = dispatcher.dispatch(shopmart_draft, "shopmart", user_approved=True)
    shopmart_ticket_ref = sm_result["ticket_ref"]
    assert shopmart_ticket_ref.startswith("SM-")

    # Stage 2: SwiftCourier Draft depends on ShopMart ticket ref
    swiftcourier_draft = {
        "awb": "SWC-99201",
        "damage_type": "crushed_box",
        "shipper_claim_ref": shopmart_ticket_ref  # Injected dependency
    }
    swc_result = dispatcher.dispatch(swiftcourier_draft, "swiftcourier", user_approved=True)

    assert swc_result["ticket_ref"].startswith("SWC-")
    assert swc_result["payload"]["shipper_claim_ref"] == shopmart_ticket_ref


def test_tc_dsp_02_parallel_dispatch_case2():
    """TC-DSP-02: Parallel Dispatch Execution (PayEasy + Northfield Bank)."""
    dispatcher = MockDispatcher()
    drafts = {
        "payeasy": {"upi_txn_id": "UPI-88291", "amount": 1200},
        "northfield-bank": {"account_last_four": "9912", "rrn": "RRN-440192"}
    }

    # Parallel non-dependent dispatch
    for org, draft in drafts.items():
        dispatcher.dispatch(draft, org, user_approved=True)

    assert "payeasy" in dispatcher.dispatched_tickets
    assert "northfield-bank" in dispatcher.dispatched_tickets


def test_tc_sec_01_user_consent_enforcement():
    """TC-SEC-01: Absolute User Consent Requirement (AI cannot dispatch autonomously)."""
    dispatcher = MockDispatcher()
    draft = {"order_id": "ORD-11111"}

    # Attempting to dispatch without user consent must raise PermissionError
    with pytest.raises(PermissionError) as exc_info:
        dispatcher.dispatch(draft, "shopmart", user_approved=False)
    assert "Explicit user approval required" in str(exc_info.value)


def test_tc_sec_02_and_03_consent_record_and_delegation_statement():
    """TC-SEC-02 & TC-SEC-03: Consent Record Generation and Delegation Statement."""
    dispatcher = MockDispatcher()
    draft = {"order_id": "ORD-77491", "item_sku": "SKU-99"}

    dispatcher.dispatch(draft, "shopmart", user_approved=True)
    assert len(dispatcher.consent_records) == 1

    record = dispatcher.consent_records[0]
    assert record["org_slug"] == "shopmart"
    assert record["approved"] is True
    # Verify SHA-256 hash
    expected_hash = hashlib.sha256(json.dumps(draft, sort_keys=True).encode()).hexdigest()
    assert record["draft_hash"] == expected_hash
    # Verify honest delegation statement
    assert "Submitted through Passage on behalf of user" in record["delegation_statement"]
