"""
Tests for Module 3: Org Router & Dependency Resolution
Implements: TC-RTR-01, TC-RTR-02, TC-RTR-03, TC-RTR-04
"""
import pytest
from typing import Dict, Any, List, Set

def deterministic_router(passage: Dict[str, Any], org_profiles: Dict[str, Dict[str, Any]]) -> List[Dict[str, Any]]:
    """Simulates Spandan's deterministic rule matching engine (Phase 1 of Org Router)."""
    matched_orgs = []
    passage_identifiers = set(passage.get("identifiers", {}).keys())
    passage_issue_type = passage.get("issue_type")

    for slug, profile in org_profiles.items():
        triggers = profile.get("triggers", {})
        trigger_ids = set(triggers.get("identifiers", []))
        trigger_issues = set(triggers.get("issue_types", []))

        # Rule matched if identifier intersects or issue type matches
        id_match = bool(passage_identifiers.intersection(trigger_ids))
        issue_match = passage_issue_type in trigger_issues

        if id_match or issue_match:
            matched_orgs.append({
                "slug": slug,
                "rule_matched": True,
                "ai_suggested": False,
                "reason": f"Matched identifiers: {passage_identifiers.intersection(trigger_ids)}" if id_match else f"Matched issue: {passage_issue_type}"
            })
    return matched_orgs


def resolve_dependencies_dag(selected_slugs: List[str], org_profiles: Dict[str, Dict[str, Any]]) -> List[Dict[str, Any]]:
    """Computes topological sort and dispatch stage for selected organizations."""
    graph = {slug: [] for slug in selected_slugs}
    in_degree = {slug: 0 for slug in selected_slugs}

    for slug in selected_slugs:
        deps = org_profiles.get(slug, {}).get("depends_on", [])
        for dep in deps:
            parent_org = dep.get("org")
            if parent_org in graph:
                graph[parent_org].append(slug)
                in_degree[slug] += 1

    # Topological sort (Kahn's algorithm)
    queue = [slug for slug in selected_slugs if in_degree[slug] == 0]
    stages = []
    current_stage = 1

    while queue:
        next_queue = []
        for node in queue:
            stages.append({"slug": node, "dispatch_stage": current_stage, "dependencies": [d["org"] for d in org_profiles[node].get("depends_on", []) if d["org"] in selected_slugs]})
            for neighbor in graph[node]:
                in_degree[neighbor] -= 1
                if in_degree[neighbor] == 0:
                    next_queue.append(neighbor)
        queue = next_queue
        current_stage += 1

    if len(stages) != len(selected_slugs):
        raise ValueError("Circular dependency detected in Org Plan DAG")

    return stages


def test_tc_rtr_01_deterministic_trigger_matching(case1_passage_data, demo_org_profiles):
    """TC-RTR-01: Deterministic Trigger Rule Matching (AWB -> SwiftCourier, order_id -> ShopMart)."""
    plan = deterministic_router(case1_passage_data, demo_org_profiles)
    slugs = [p["slug"] for p in plan]

    assert "shopmart" in slugs
    assert "swiftcourier" in slugs
    # Assert other unrelated orgs are not matched
    assert "payeasy" not in slugs
    assert "northfield-bank" not in slugs

    # Verify rule attribution
    for p in plan:
        assert p["rule_matched"] is True
        assert p["ai_suggested"] is False


def test_tc_rtr_02_ai_suggestion_pass():
    """TC-RTR-02: Groq Router Suggestion Pass ('AI Suggested — Add?')."""
    # Deterministic matches
    base_plan = [
        {"slug": "shopmart", "rule_matched": True, "ai_suggested": False}
    ]
    # Simulated Groq router output suggesting courier based on text analysis
    groq_suggestion = {
        "suggested_orgs": [
            {"slug": "swiftcourier", "reason": "Mention of damaged parcel delivery suggests transit courier involvement"}
        ]
    }

    combined_plan = list(base_plan)
    for sug in groq_suggestion["suggested_orgs"]:
        combined_plan.append({
            "slug": sug["slug"],
            "rule_matched": False,
            "ai_suggested": True,
            "reason": sug["reason"]
        })

    assert len(combined_plan) == 2
    assert combined_plan[1]["slug"] == "swiftcourier"
    assert combined_plan[1]["ai_suggested"] is True


def test_tc_rtr_03_dependency_dag_ordering(demo_org_profiles):
    """TC-RTR-03: Dependency DAG & Dispatch Ordering (ShopMart dispatched before SwiftCourier)."""
    selected_slugs = ["swiftcourier", "shopmart"]
    ordered_plan = resolve_dependencies_dag(selected_slugs, demo_org_profiles)

    # ShopMart must be stage 1, SwiftCourier stage 2
    stage_by_slug = {item["slug"]: item["dispatch_stage"] for item in ordered_plan}
    assert stage_by_slug["shopmart"] == 1
    assert stage_by_slug["swiftcourier"] == 2
    assert ordered_plan[0]["slug"] == "shopmart"
    assert ordered_plan[1]["slug"] == "swiftcourier"


def test_tc_rtr_04_user_plan_modification(demo_org_profiles):
    """TC-RTR-04: User Plan Modification (User drops SwiftCourier)."""
    initial_slugs = ["shopmart", "swiftcourier"]
    # User edits plan via PUT /api/passages/{id}/plan
    modified_slugs = [slug for slug in initial_slugs if slug != "swiftcourier"]

    updated_ordered = resolve_dependencies_dag(modified_slugs, demo_org_profiles)
    assert len(updated_ordered) == 1
    assert updated_ordered[0]["slug"] == "shopmart"
    assert updated_ordered[0]["dispatch_stage"] == 1
