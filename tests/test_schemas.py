"""
Tests for Module 1: Schemas & Data Integrity
Implements: TC-SCH-01, TC-SCH-02, TC-SCH-03, TC-SCH-04
"""
import pytest
import jsonschema
import hashlib
import json
from typing import Dict, Any, List

def test_tc_sch_01_canonical_passage_validation(case1_passage_data):
    """TC-SCH-01: Canonical Passage Schema Validation."""
    passage_schema = {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "type": "object",
        "properties": {
            "id": {"type": "string"},
            "user_name": {"type": "string"},
            "problem_summary": {"type": "string"},
            "issue_type": {"type": "string"},
            "identifiers": {"type": "object"},
            "evidence": {"type": "array"},
            "requested_outcome": {"type": "string"},
            "status": {"type": "string"}
        },
        "required": ["id", "problem_summary", "issue_type", "status"]
    }

    # 1. Valid Passage passes validation
    jsonschema.validate(instance=case1_passage_data, schema=passage_schema)

    # 2. Negative test: Missing required field 'problem_summary'
    invalid_passage = case1_passage_data.copy()
    del invalid_passage["problem_summary"]

    with pytest.raises(jsonschema.ValidationError):
        jsonschema.validate(instance=invalid_passage, schema=passage_schema)


def test_tc_sch_02_org_profile_structure_and_rules(demo_org_profiles):
    """TC-SCH-02: 7 Demo Org Profiles Compliance & Trigger Schema."""
    org_profile_schema = {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "type": "object",
        "properties": {
            "slug": {"type": "string"},
            "name": {"type": "string"},
            "domain": {"type": "string"},
            "channels": {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "type": {"type": "string"},
                        "priority": {"type": "integer"}
                    },
                    "required": ["type", "priority"]
                }
            },
            "ticket_type": {"type": "string"},
            "triggers": {
                "type": "object",
                "properties": {
                    "identifiers": {"type": "array", "items": {"type": "string"}},
                    "issue_types": {"type": "array", "items": {"type": "string"}}
                }
            },
            "required_fields": {"type": "array", "items": {"type": "string"}},
            "evidence_policy": {
                "type": "object",
                "properties": {
                    "allow": {"type": "array", "items": {"type": "string"}},
                    "deny": {"type": "array", "items": {"type": "string"}}
                },
                "required": ["allow", "deny"]
            },
            "depends_on": {"type": "array"},
            "sla": {
                "type": "object",
                "properties": {
                    "first_response_hours": {"type": "integer"},
                    "resolution_hours": {"type": "integer"},
                    "escalate_to": {"type": "string"}
                },
                "required": ["first_response_hours", "resolution_hours", "escalate_to"]
            },
            "status_map": {"type": "object"}
        },
        "required": ["slug", "name", "channels", "ticket_type", "evidence_policy", "sla", "status_map"]
    }

    for org_slug, profile in demo_org_profiles.items():
        jsonschema.validate(instance=profile, schema=org_profile_schema)
        assert profile["slug"] == org_slug
        assert len(profile["channels"]) > 0


def test_tc_sch_03_ticket_schemas_syntax(mock_ticket_schemas):
    """TC-SCH-03: Per-Org Ticket Schemas Compilation."""
    for ticket_type, schema in mock_ticket_schemas.items():
        validator = jsonschema.Draft202012Validator(schema)
        # Check that the schema is valid meta-schema
        validator.check_schema(schema)


def test_tc_sch_04_hash_chain_integrity_and_tamper_detection(sample_hash_chain):
    """TC-SCH-04: SHA-256 Hash Chain Integrity & Tamper Detection."""
    def verify_chain(chain: List[Dict[str, Any]]) -> bool:
        for i in range(1, len(chain)):
            curr = chain[i]
            prev = chain[i - 1]
            if curr["prev_hash"] != prev["hash"]:
                return False
            expected_data = prev["hash"] + json.dumps(curr["payload"], sort_keys=True)
            expected_hash = hashlib.sha256(expected_data.encode()).hexdigest()
            if curr["hash"] != expected_hash:
                return False
        return True

    # 1. Valid chain passes integrity check
    assert verify_chain(sample_hash_chain) is True

    # 2. Tampering test: modify payload in block 1
    tampered_chain = [dict(block) for block in sample_hash_chain]
    tampered_chain[1] = dict(tampered_chain[1])
    tampered_chain[1]["payload"] = {"event": "drafts_approved", "orgs": ["malicious_actor"]}

    # Integrity verification must fail
    assert verify_chain(tampered_chain) is False
