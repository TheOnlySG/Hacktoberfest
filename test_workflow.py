import json
import os
import sys

# Add the backend dir to path so we can import modules
sys.path.append(os.path.join(os.path.dirname(__file__), 'backend'))

from backend.compiler.case_compiler import compile_passage
from backend.router.org_router import determine_org_plan
from backend.composer.ticket_composer import compose_drafts
from backend.dispatcher.engine import dispatch_drafts
from backend.adapters.sandbox import sandbox_list_tickets

def test_full_pipeline():
    print("--- Passage v2.0 Pipeline Test ---")
    
    # 1. Load User Input
    input_path = os.path.join(os.path.dirname(__file__), 'protocol', 'examples', 'case1_input.json')
    with open(input_path, 'r') as f:
        case_input = json.load(f)
        
    print(f"\n[1] User Input Loaded:\nProblem: {case_input['problem_description']}")
    
    # 2. Compile Passage
    print("\n[2] Running Case Compiler (using cache)...")
    passage = compile_passage(
        user_text=case_input['problem_description'],
        evidence_metadata=case_input['attached_evidence'],
        schema={} # Schema is in file
    )
    print(f"Entities Extracted: {list(passage['entities'].keys())}")
    
    # 3. Router
    print("\n[3] Running Org Router...")
    org_plan = determine_org_plan(passage)
    org_slugs = [o['slug'] for o in org_plan['orgs']]
    print(f"Organizations matched: {org_slugs}")
    
    # 4. Composer
    print("\n[4] Running Ticket Composer...")
    drafts = compose_drafts(passage, org_plan)
    print(f"Generated {len(drafts)} drafts.")
    
    # Simulate user approval
    print("\n[5] Simulating user approval and Dispatching...")
    tickets = dispatch_drafts(passage_id="p-1001", approved_drafts=drafts, org_plan=org_plan, relay_rules={})
    print(f"Created {len(tickets)} tickets.")
    for t in tickets:
        print(f" -> [{t['org_slug']}] Status: {t['normalized_status']} | Ref: {t['ticket_ref']}")
        
    print("\n--- Test Complete ---")

if __name__ == "__main__":
    test_full_pipeline()
