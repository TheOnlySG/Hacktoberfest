# Passage v2.0 — Comprehensive Test Specification & Test Cases

**Author / Assignee:** Kaushik (Stream C / QA)  
**Target Implementation:** Spandan's Implementation Plan (Stream B: Backend, AI, Adapters, Infrastructure)  
**Reference Document:** [Passage_PRD_v2_0.md](file:///c:/Users/kaushik%20s%20ratnaparkh/Hacktoberfest/Passage_PRD_v2_0.md)  
**Execution Environment:** FastAPI, SQLite, Groq API (`llama-3.3-70b-versatile`), Mailpit, Zammad, FixMyStreet  

---

## 1. Test Suite Summary & Traceability Matrix

| Module ID | Feature / Component | Spandan Plan Deliverable | Priority | Total Tests |
|---|---|---|---|:---:|
| **MOD-01** | Schemas & Integrity | S2 (Schemas), S1 (Repo) | P0 | 4 |
| **MOD-02** | Case Compiler & Groq Inference | S4 (Compiler), S10 (Cached AI) | P0 | 5 |
| **MOD-03** | Org Router & Dependency Resolution | S5 (Org Router) | P0 | 4 |
| **MOD-04** | Ticket Composer & Schema Validation | S6 (Ticket Composer) | P0 | 5 |
| **MOD-05** | Consent Gate, Privacy & Selective Disclosure | S7 (Consent / Hash Chain) | P0 | 4 |
| **MOD-06** | Dispatcher & Reference Injection | S7 (Dispatcher / DAG) | P0 | 4 |
| **MOD-07** | Adapters (Sandbox, Email, Zammad, Open311) | S8, S9, S12, S13 | P0/P1 | 5 |
| **MOD-08** | Normalized Status & Webhooks | S11 (Status / Webhooks) | P0 | 3 |
| **MOD-09** | Needs-Info Inbox & Relay Engine | S15 (Relay Engine) | P1 | 3 |
| **MOD-10** | SLA Timers & Escalation Drafter | S14 (SLA / Fast-Forward) | P1 | 3 |
| **MOD-11** | End-to-End Demo Workflows (Cases 1, 2, 3) | S10, E2E Core Loops | P0 | 3 |
| **MOD-12** | Non-Functional, Offline Fallback & Compliance | S16, S17, Groq UI Badge | P0 | 3 |
| **Total** | | | | **46 Test Cases** |

---

## Module 1: Schemas & Data Integrity (S2)

### TC-SCH-01: Canonical Passage Schema Validation
* **Type:** Unit / Schema Validation
* **Priority:** P0
* **Preconditions:** `protocol/passage.schema.json` is defined.
* **Input:** Valid Passage JSON instance with problem text, timeline events, evidence metadata, requested outcome, and empty hash chain.
* **Steps:**
  1. Load `protocol/passage.schema.json`.
  2. Validate mock valid Passage payload using `jsonschema.validate()`.
  3. Validate negative payload missing required `problem_summary`.
* **Expected Result:** Valid payload passes without error; invalid payload raises `jsonschema.ValidationError` citing missing field.

### TC-SCH-02: 7 Demo Org Profiles Compliance
* **Type:** Automated Validation
* **Priority:** P0
* **Preconditions:** `protocol/passage_org_profile.schema.json` and 7 profile JSONs in `protocol/orgs/` exist (`shopmart.json`, `swiftcourier.json`, `payeasy.json`, `northfield-bank.json`, `municipal-water.json`, `power-utility.json`, `shield-motor.json`).
* **Steps:**
  1. Iterate over all 7 JSON files in `protocol/orgs/`.
  2. Validate each against `passage_org_profile.schema.json`.
  3. Verify required fields: `slug`, `name`, `channels`, `ticket_type`, `schema`, `triggers`, `required_fields`, `evidence_policy`, `sla`, `status_map`.
* **Expected Result:** All 7 files validate with zero schema violations.

### TC-SCH-03: Per-Org Ticket Schemas Compilation
* **Type:** Automated Validation
* **Priority:** P0
* **Preconditions:** All JSON schema files in `protocol/schemas/` exist.
* **Steps:**
  1. Load each schema in `protocol/schemas/` via `jsonschema.Draft202012Validator`.
  2. Verify JSON Schema syntax and draft compatibility.
* **Expected Result:** All 7 schemas parse without syntax errors.

### TC-SCH-04: SHA-256 Hash Chain Integrity & Tamper Detection
* **Type:** Backend Unit Test
* **Priority:** P0
* **Preconditions:** A Passage record has 3 sequential events in its hash chain.
* **Steps:**
  1. Verify `event[n].prev_hash == event[n-1].hash`.
  2. Compute SHA-256 over `(prev_hash + event_type + timestamp + payload)`.
  3. Manually alter the payload of `event[1]`.
  4. Run integrity check validator.
* **Expected Result:** Integrity check succeeds initially; fails with `HashMismatchError` after alteration, pinpointing line of tampering.

---

## Module 2: AI Pipeline & Case Compiler (S4, S10)

### TC-AI-01: Groq API Live Compilation (`llama-3.3-70b-versatile`)
* **Type:** AI Integration Test
* **Priority:** P0
* **Preconditions:** `GROQ_API_KEY` set in `.env`, `USE_CACHED_AI=false`.
* **Input:** Raw problem description: *"Mira's pressure cooker from ShopMart arrived damaged with dented body, tracking AWB-987654."*
* **Steps:**
  1. Send `POST /api/passages/{id}/compile`.
  2. Intercept the Groq API call.
* **Expected Result:**
  * Request uses model `llama-3.3-70b-versatile` with `response_format: {"type": "json_object"}`.
  * System prompt instructs schema matching `passage.schema.json`.
  * Response parsed into valid JSON with extracted entities (vendor: ShopMart, identifier: AWB-987654).

### TC-AI-02: Field Source Tagging (`"source": "ai"`)
* **Type:** Functional Backend Test
* **Priority:** P0
* **Preconditions:** Successful compilation of raw input.
* **Steps:**
  1. Inspect the compiled draft Passage fields.
* **Expected Result:** Every extracted fact, entity, and summary has metadata attribute `"source": "ai"`.

### TC-AI-03: Evidence Text-Only Metadata Enforcement
* **Type:** Security / API Test
* **Priority:** P0
* **Preconditions:** User attaches an image file `damage_box.png`.
* **Steps:**
  1. Invoke Case Compiler.
  2. Inspect HTTP payload transmitted to Groq API endpoint.
* **Expected Result:** Raw binary / base64 image data is **never** sent to Groq; only filename, mime-type, user description, and extracted text/OCR metadata are included.

### TC-AI-04: Offline Fallback via Cached Runs (`USE_CACHED_AI=true`)
* **Type:** Reliability / Unit Test
* **Priority:** P0
* **Preconditions:** `USE_CACHED_AI=true`, network connection disabled or invalid dummy `GROQ_API_KEY`.
* **Steps:**
  1. Trigger `POST /api/passages/{id}/compile` for Case 1.
* **Expected Result:**
  * Endpoint immediately returns `protocol/examples/case1_compiled.json`.
  * Response contains top-level `"cached": true` and model identifier.
  * No outbound network call is made.

### TC-AI-05: Model Fallback Configuration (`gemma2-9b-it`)
* **Type:** Configuration Test
* **Priority:** P1
* **Preconditions:** Set `GROQ_MODEL=gemma2-9b-it` in `.env`.
* **Steps:**
  1. Trigger compilation.
* **Expected Result:** Backend successfully dispatches call to `gemma2-9b-it` on Groq API without code errors.

---

## Module 3: Org Router & Dependency Resolution (S5)

### TC-RTR-01: Deterministic Trigger Rule Matching (AWB $\to$ Courier)
* **Type:** Unit Test
* **Priority:** P0
* **Input:** Passage containing identifier `awb: "SWC-12345"` and `issue_type: "damaged_on_arrival"`.
* **Steps:**
  1. Invoke Org Router via `POST /api/passages/{id}/plan`.
* **Expected Result:**
  * SwiftCourier is matched deterministically via rule trigger.
  * ShopMart is matched via order context.
  * `rule_matched: true` is set for both.

### TC-RTR-02: Groq Router Suggestion Pass ("AI Suggested — Add?")
* **Type:** Integration Test
* **Priority:** P1
* **Input:** Case description where an unmentioned party might be involved (e.g., payment failure mentions a third-party gateway).
* **Steps:**
  1. Router runs deterministic rules, followed by Groq router prompt.
* **Expected Result:**
  * Deterministic orgs are marked `rule_matched: true`.
  * Groq suggestions are marked `ai_suggested: true` with a clear explanation `reason`.
  * Suggested orgs are not locked; they require user confirmation before inclusion.

### TC-RTR-03: Dependency DAG & Dispatch Ordering (Case 1)
* **Type:** Unit Test
* **Priority:** P0
* **Input:** Org Plan containing ShopMart and SwiftCourier (where SwiftCourier profile specifies `depends_on: [{"org": "shopmart", "need": "ticket_ref"}]`).
* **Steps:**
  1. Run router dependency resolver.
* **Expected Result:**
  * Dispatch order assigns ShopMart = Stage 1, SwiftCourier = Stage 2.
  * Topological sort validates DAG has no circular dependencies.

### TC-RTR-04: User Plan Modification (`PUT /api/passages/{id}/plan`)
* **Type:** API Functional Test
* **Priority:** P0
* **Steps:**
  1. Router outputs Plan with `{shopmart, swiftcourier}`.
  2. User sends `PUT /api/passages/{id}/plan` removing SwiftCourier.
* **Expected Result:**
  * Updated Org Plan contains only ShopMart.
  * Dependency graph re-calculates without errors.

---

## Module 4: Ticket Composer & Schema Compliance (S6)

### TC-CMP-01: Per-Org JSON Schema Conformance
* **Type:** Functional / Validation Test
* **Priority:** P0
* **Input:** Confirmed Passage for Case 1.
* **Steps:**
  1. Call `POST /api/passages/{id}/drafts`.
  2. Validate ShopMart draft against `marketplace.return_replace.v1.json`.
  3. Validate SwiftCourier draft against `courier.damage_inspection.v1.json`.
* **Expected Result:** Both drafts conform 100% to their respective schemas.

### TC-CMP-02: Evidence Policy Filtering (`evidence_policy.deny`)
* **Type:** Security / Privacy Test
* **Priority:** P0
* **Input:** Passage contains: `[outer_package_photos, delivery_notification, payment_proof, bank_statement]`.
* **Steps:**
  1. Generate draft for SwiftCourier (which has `deny: ["payment_proof", "bank_statement"]`).
* **Expected Result:**
  * SwiftCourier draft evidence array contains only `outer_package_photos` and `delivery_notification`.
  * `payment_proof` and `bank_statement` are strictly excluded from the draft payload.

### TC-CMP-03: Self-Correction Retry Loop on Schema Failure
* **Type:** AI Error-Handling Test
* **Priority:** P0
* **Preconditions:** Mock Groq API to return invalid JSON missing a required field on Call 1.
* **Steps:**
  1. Invoke Ticket Composer.
* **Expected Result:**
  * System catches `jsonschema.ValidationError`.
  * System triggers Retry Call to Groq with validation error message appended.
  * Upon valid response on Call 2, draft is accepted.

### TC-CMP-04: Deterministic Plain Template Fallback on Double Failure
* **Type:** Edge Case Test
* **Priority:** P0
* **Preconditions:** Mock Groq API to return invalid JSON on both Call 1 and Call 2.
* **Steps:**
  1. Invoke Ticket Composer.
* **Expected Result:**
  * System falls back to deterministic plain template populated from Passage fields.
  * Missing fields are flagged with `"flagged": true`.
  * System does not crash; draft is presented to user with review warning.

### TC-CMP-05: Strict Dispatch Gate Blocking Invalid Drafts
* **Type:** Security / Dispatch Gate Test
* **Priority:** P0
* **Steps:**
  1. Inject an unvalidated/malformed draft into the database.
  2. Attempt `POST /api/passages/{id}/dispatch`.
* **Expected Result:**
  * Dispatcher rejects the request with HTTP `422 Unprocessable Entity`.
  * Error message: *"Draft does not satisfy schema; unvalidated drafts cannot be dispatched."*
  * No ticket is filed.

---

## Module 5: Consent Gate, Delegation & Privacy (S7)

### TC-SEC-01: Absolute User Consent Requirement (No Autonomous Dispatch)
* **Type:** Security Test
* **Priority:** P0
* **Steps:**
  1. Compile and compose drafts for a Passage.
  2. Do not invoke `POST /api/passages/{id}/dispatch`.
  3. Wait and check background jobs.
* **Expected Result:** No external adapter or sandbox API is ever called. Drafts remain in `draft` state indefinitely until user explicitly approves.

### TC-SEC-02: Consent Record Generation & Immutability
* **Type:** Audit / Security Test
* **Priority:** P0
* **Steps:**
  1. User calls `POST /api/passages/{id}/dispatch` approving selected drafts.
  2. Inspect database `consent_records` table.
* **Expected Result:**
  * Record created containing: `passage_id`, `draft_id`, `org_slug`, `approved_fields`, `approved_evidence`, `relay_rules`, `timestamp`, `hash`.
  * Hash matches SHA-256 of the approved draft contents.

### TC-SEC-03: Honest Delegation Statement Verification
* **Type:** Compliance Test
* **Priority:** P0
* **Steps:**
  1. Inspect generated payload dispatched to any external adapter.
* **Expected Result:**
  * Payload includes standard delegation statement: *"Submitted through Passage on behalf of [User Name] with explicit authorization."*
  * Contact details of user are attached; Passage does not impersonate user or store third-party credentials.

### TC-SEC-04: User Evidence Toggle via `PATCH /api/drafts/{draft_id}`
* **Type:** Functional API Test
* **Priority:** P0
* **Steps:**
  1. Retrieve composed draft with 3 allowed photos.
  2. User calls `PATCH /api/drafts/{draft_id}` toggling off photo #2.
  3. Dispatch ticket.
* **Expected Result:**
  * Only photos #1 and #3 are included in the dispatched payload.

---

## Module 6: Dispatcher & Dependency Engine (S7)

### TC-DSP-01: Sequential Dependency Reference Injection (Case 1)
* **Type:** Workflow Integration Test
* **Priority:** P0
* **Setup:** Case 1 (ShopMart + SwiftCourier).
* **Steps:**
  1. User approves both drafts and triggers dispatch.
  2. Observe execution sequence.
* **Expected Result:**
  * ShopMart ticket is dispatched first $\to$ returns ticket ID `SM-849201`.
  * Dispatcher injects `SM-849201` into SwiftCourier field `shipper_claim_ref`.
  * SwiftCourier ticket is dispatched second $\to$ returns `SWC-302911`.
  * SwiftCourier ticket payload contains `shipper_claim_ref == "SM-849201"`.

### TC-DSP-02: Parallel Dispatch Execution (Case 2)
* **Type:** Workflow Integration Test
* **Priority:** P0
* **Setup:** Case 2 (PayEasy + Northfield Bank).
* **Steps:**
  1. Dispatch approved drafts.
* **Expected Result:**
  * Both adapters receive dispatch calls concurrently (non-blocking async).
  * Tickets created simultaneously without waiting for reference cross-dependency.

### TC-DSP-03: Dependent Insurance Claim Blocked on Civic Ref (Case 3)
* **Type:** Workflow Integration Test
* **Priority:** P0
* **Setup:** Case 3 (Municipality + Power Utility + Motor Insurer).
* **Steps:**
  1. Trigger dispatch.
* **Expected Result:**
  * Municipality (Open311) and Power Utility tickets are dispatched immediately.
  * Shield Motor Insurance ticket remains in `waiting_on_dependency` until Municipal Service Request ID is acquired.
  * Upon receiving Municipal ID, Insurer draft is populated with third-party ref and dispatched.

### TC-DSP-04: Partial Dispatch Handling (1 of N Orgs Fails)
* **Type:** Fault Tolerance Test
* **Priority:** P0
* **Steps:**
  1. Dispatch 2 tickets; simulate network failure on Org 2 adapter.
* **Expected Result:**
  * Org 1 ticket is marked `submitted` with valid external reference.
  * Org 2 ticket is marked `dispatch_failed` with retry option.
  * Entire Passage does not corrupt; user is alerted with failure detail.

---

## Module 7: Adapters & External Systems (S8, S9, S12, S13)

### TC-ADP-01: Sandbox Adapter CRUD & Status Mutation
* **Type:** Adapter Test
* **Priority:** P0
* **Steps:**
  1. Call `POST /sandbox/shopmart/tickets` with ticket draft.
  2. Verify response format `{"id": "SM-XXXXXX", "status": "OPEN"}`.
  3. Operator calls `POST /sandbox/shopmart/tickets/{id}/status` with `{"status": "IN_PROGRESS"}`.
  4. Fetch `GET /sandbox/shopmart/tickets/{id}`.
* **Expected Result:** Ticket is stored and retrieved; status correctly transitions.

### TC-ADP-02: Email Adapter via Mailpit (SMTP & REST Verification)
* **Type:** Adapter Integration Test
* **Priority:** P0
* **Preconditions:** Mailpit container running on ports 1025 (SMTP) and 8025 (HTTP).
* **Steps:**
  1. Dispatch ticket configured for email adapter (`claims@shieldmotor.example`).
  2. Query Mailpit REST API `GET http://localhost:8025/api/v1/messages`.
* **Expected Result:**
  * Email captured in Mailpit inbox.
  * Subject line matches case format.
  * `ticket_ref` captured from email `Message-ID`.

### TC-ADP-03: WeasyPrint PDF Claim Form Generation
* **Type:** Document Generation Test
* **Priority:** P1
* **Steps:**
  1. Trigger claim form email generation for Shield Motor Insurance.
  2. Inspect captured attachment in Mailpit.
* **Expected Result:**
  * PDF attachment exists and is valid (starts with `%PDF-`).
  * PDF contains vehicle registration, date of incident, municipal reference ID, and Passage hash fingerprint.

### TC-ADP-04: Zammad Helpdesk REST API Integration
* **Type:** Helpdesk Adapter Test
* **Priority:** P1
* **Preconditions:** Zammad Docker service active.
* **Steps:**
  1. Dispatch Case 2 complaint to Northfield Bank (Zammad adapter).
  2. Query Zammad API `GET /api/v1/tickets`.
* **Expected Result:**
  * Ticket created with customer name, title, and initial article body.
  * Evidence files attached via `POST /api/v1/attachments`.
  * Zammad ticket ID returned and stored in Passage.

### TC-ADP-05: Open311 GeoReport v2 Service Request (FixMyStreet)
* **Type:** Open Standard Adapter Test
* **Priority:** P1
* **Preconditions:** Local FixMyStreet / Open311 endpoint active.
* **Steps:**
  1. Dispatch Case 3 municipal water leak ticket.
* **Expected Result:**
  * `POST /api/requests.json` sent with `service_code`, `lat`, `long`, `address_string`, `description`.
  * Valid `service_request_id` returned.

---

## Module 8: Normalized Status & Webhooks (S11)

### TC-TRK-01: Status Vocabulary Normalization
* **Type:** Unit / Mapping Test
* **Priority:** P0
* **Input:** Raw status events from multiple org profiles.
* **Steps:**
  1. Ingest raw `OPEN` from SwiftCourier $\to$ Assert normalized `submitted`.
  2. Ingest raw `VISIT_SCHEDULED` from SwiftCourier $\to$ Assert normalized `in_progress`.
  3. Ingest raw `CLOSED_APPROVED` from ShopMart $\to$ Assert normalized `resolved`.
* **Expected Result:** All raw states accurately translate into the 8 canonical statuses: `submitted`, `acknowledged`, `in_progress`, `needs_info`, `resolved`, `rejected`, `escalated`, `withdrawn`.

### TC-TRK-02: Webhook Authentication & Ingestion
* **Type:** API Integration Test
* **Priority:** P0
* **Steps:**
  1. Send `POST /api/webhooks/sandbox/{valid_token}` with status update payload.
  2. Send `POST /api/webhooks/sandbox/invalid_token`.
* **Expected Result:** Valid token returns `200 OK` and updates ticket status; invalid token returns `401 Unauthorized`.

### TC-TRK-03: Polling Fallback via APScheduler
* **Type:** Scheduling Test
* **Priority:** P1
* **Steps:**
  1. Configure an adapter with polling interval = 10s.
  2. Mutate ticket status in mock endpoint.
  3. Wait for APScheduler tick.
* **Expected Result:** Passage backend detects new status on scheduled poll and appends event to hash chain.

---

## Module 9: Needs-Info Loop & Answer Relay (S15)

### TC-RLY-01: Inbound Question Aggregation
* **Type:** Functional / Inbox Test
* **Priority:** P1
* **Steps:**
  1. Inbound webhook from Northfield Bank asks: *"Please provide last 4 digits of debit card."*
  2. Query `GET /api/passages/{id}/questions`.
* **Expected Result:** Question appears once in the unified user inbox with status `pending_user_input`.

### TC-RLY-02: Answer Once & Selective Relay Enforcement
* **Type:** Privacy / Relay Test
* **Priority:** P1
* **Steps:**
  1. User calls `POST /api/questions/{id}/answer` with `"4819"`.
  2. Check outbound relays.
* **Expected Result:**
  * Answer is relayed to Northfield Bank adapter.
  * Answer is **blocked** from relaying to PayEasy (per PayEasy's `evidence_policy.deny: ["bank_account_details"]`).

### TC-RLY-03: Relay Audit Trail in Hash Chain
* **Type:** Audit Test
* **Priority:** P1
* **Steps:**
  1. Complete question answer relay.
  2. Inspect Passage hash chain.
* **Expected Result:** New event recorded: `event_type: "question_answered_and_relayed"`, containing recipient orgs and hash.

---

## Module 10: SLA Timers & Escalation Drafter (S14)

### TC-SLA-01: SLA Expiry Detection via Scheduler
* **Type:** Scheduler Test
* **Priority:** P1
* **Steps:**
  1. Create ticket with `sla.resolution_hours: 48`.
  2. Set ticket created timestamp to 49 hours ago.
  3. Wait for APScheduler loop.
* **Expected Result:** System flags ticket as `sla_breached`.

### TC-SLA-02: Groq Escalation Letter Drafting
* **Type:** AI Drafter Test
* **Priority:** P1
* **Steps:**
  1. Trigger escalation drafting on breached ticket.
* **Expected Result:**
  * Backend calls Groq API with `ai/prompts/escalation.md`.
  * Draft escalation text generated addressed to `sla.escalate_to` (e.g., Banking Ombudsman / Nodal Officer).
  * Status set to `escalation_drafted` (awaiting user approval).
  * **System does NOT send escalation automatically.**

### TC-SLA-03: Demo Fast-Forward Endpoint (`POST /api/passages/{id}/fast_forward`)
* **Type:** Demo Automation Test
* **Priority:** P0 (Required for stage demo)
* **Steps:**
  1. Invoke `POST /api/passages/{id}/fast_forward`.
* **Expected Result:**
  * Ticket SLA timers immediately expire.
  * Within < 5 seconds, an escalation draft appears in the inbox.

---

## Module 11: End-to-End Demo Workflows (Cases 1, 2, 3)

### TC-E2E-01: Case 1 The Damaged Parcel (Logistics / E-Commerce)
* **Type:** E2E System Test
* **Priority:** P0 (Critical Demo Path)
* **Flow:**
  1. **Submit:** Mira inputs text + photos of damaged cooker + invoice + AWB.
  2. **Compile:** Case Compiler extracts entities; fields tagged `"source": "ai"`.
  3. **Confirm:** User confirms canonical Passage.
  4. **Route:** Router generates plan: ShopMart (order) and SwiftCourier (courier).
  5. **Compose:** Two different drafts generated; invoice withheld from SwiftCourier.
  6. **Approve:** Consent gate approves both.
  7. **Dispatch:** ShopMart dispatched first (`SM-102938`); SwiftCourier receives `SM-102938` as `shipper_claim_ref` and dispatches (`SWC-409182`).
  8. **Inspection Relay:** Operator changes SwiftCourier status to `INSPECTED`; inspection report relays to ShopMart.
  9. **Resolve:** ShopMart approves replacement; Passage status $\to$ `resolved`.
* **Expected Result:** Flow completes in < 60s; Effort Counter displays: *"2 organizations, 1 submission, 0 retellings."*

### TC-E2E-02: Case 2 Debited, Payment Failed (FinTech / Banking)
* **Type:** E2E System Test
* **Priority:** P0
* **Flow:**
  1. **Submit:** Arjun submits UPI failed transaction screenshot + SMS.
  2. **Route & Compose:** PayEasy (VPA/screenshot) and Northfield Bank (RRN/statement). Bank account withheld from PayEasy.
  3. **Dispatch:** Parallel dispatch; Northfield Bank ticket filed in Zammad.
  4. **Needs-Info:** Bank requests card details; Arjun answers once in inbox.
  5. **Fast-Forward:** Demo operator fast-forwards SLA $\to$ Escalation draft to Ombudsman generated.
* **Expected Result:** Parallel dispatch, selective disclosure, and timer-driven escalation work without error.

### TC-E2E-03: Case 3 The Burst Water Main (Civic / Utility / Insurance)
* **Type:** E2E System Test
* **Priority:** P0
* **Flow:**
  1. **Submit:** Priya pins location, uploads photos of flooded scooter, attaches policy PDF.
  2. **Route:** Plan includes Municipal Water (Open311), Power Utility (Hazard), Shield Motor (Claim).
  3. **Dispatch:** Municipality and Utility dispatched immediately. Insurer waits.
  4. **Ref Passing:** Municipal Request ID generated $\to$ injected into Insurer claim.
  5. **Email & PDF:** Insurer claim sent via email adapter; PDF claim form appears in Mailpit.
* **Expected Result:** Geo-coordinates passed to Open311; email with WeasyPrint PDF verified in Mailpit.

---

## Module 12: Non-Functional, Offline Fallback & Compliance

### TC-NFR-01: Complete Offline Execution Test
* **Type:** Resilience Test
* **Priority:** P0
* **Preconditions:** Disconnect workstation from Wi-Fi/Ethernet. Set `USE_CACHED_AI=true`.
* **Steps:**
  1. Execute Case 1, Case 2, and Case 3 end-to-end.
* **Expected Result:** All 3 cases complete successfully without throwing network or DNS exceptions, loading cached runs from `protocol/examples/`.

### TC-NFR-02: UI Badge Compliance Verification
* **Type:** Visual & Compliance Inspection
* **Priority:** P0
* **Steps:**
  1. Inspect the AI attribution badge on frontend screens.
* **Expected Result:**
  * Badge displays: **"Powered by open-weight model (Llama 3.3 70B) via Groq"**.
  * Does NOT claim "runs locally" (adheres strictly to honest disclosure policy).

### TC-NFR-03: Demo Performance & Latency Benchmark
* **Type:** Performance Benchmark
* **Priority:** P0
* **Steps:**
  1. Measure elapsed time from `confirm` $\to$ `all tickets dispatched` in demo mode.
* **Expected Result:** Total elapsed time is **under 60 seconds**.
