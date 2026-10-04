PASSAGE | PRODUCT REQUIREMENTS DOCUMENT

# Passage

Tell it once. We file it everywhere.

A user-owned resolution record that structures a real-world problem once, then creates the right ticket, in the right shape, at every organization involved, on the user's behalf and with the user's approval.

| **Item** | **Detail** |
|---|---|
| Document | Product Requirements Document, v2.0 (revises v1.4) |
| What is new | The Resolution Workflow: submit, structure, route, compose per-organization tickets, approve, dispatch, track, relay, resolve |
| Team | Three people, three streams (A, B, C), assignable and swappable at any time; see section 17 |
| Category | Cross-organization problem resolution / portable resolution record |
| Primary users | Consumers, freelancers, travelers, students, customers |
| Receiving organizations | Marketplaces, couriers, banks, payment apps, utilities, municipalities, insurers |
| Open AI requirement | Open-weight Gemma 4, run locally via Ollama; no proprietary LLM API in the product path |
| License | Open-source core, Apache-2.0 |

## 1. What Changed in v2.0

v1.4 solved one half of the problem. Passage structured the user's problem once and let the record travel from organization to organization. But the user still had to start every conversation: send the link to the seller, wait, then send it to the courier, wait. The person was still the dispatcher.

v2.0 closes that gap. After the user submits a problem and confirms the structured version, Passage works out which organizations are involved, builds a separate ticket for each one in the structure that organization expects, and files all of them after one approval from the user. Replies, questions and outcomes come back into the same record.

| **Area** | **v1.4** | **v2.0** |
|---|---|---|
| Core job | Structure the problem; user shares it onward | Structure the problem; Passage files tickets with every relevant organization |
| Who starts each handoff | The user, one organization at a time | Passage, after one user approval |
| Shape of what each organization receives | One Passage view for everyone | A separate ticket per organization, built to that organization's own schema |
| How organizations are reached | Zero-install secure link only | Adapter layer: helpdesk APIs, open standards (Open311), email-to-ticket, secure link, assisted manual |
| Status | Events added by receivers | Normalized status synced back from every ticket, plus a single "questions for you" inbox |
| Cross-organization logic | None | Dependencies (one ticket needs another's reference), evidence relay, SLA timers, escalation drafts |
| Demo | One scenario in depth | Three scenarios across three domains, each with different organizations and different ticket shapes |
| Open source | Gemma, Ollama, schema, prompts | Adds an open Org Profile registry, Open311, Zammad and other open-source integrations |

**Pitch line:** "Tell it once. We file it everywhere."

**Demo statement:** "One problem. One submission. Every organization gets exactly the ticket it needs."

## 2. Executive Summary

Passage is a user-controlled resolution workflow. A person describes a problem in their own words and attaches whatever evidence they have. Gemma, running locally, structures it into a Passage: problem, timeline, evidence, requested outcome. The user confirms it.

Passage then does what the user would otherwise do by hand. It identifies the organizations that need to act, reads each organization's Org Profile (what it requires, which channel it accepts, what it should not see), and composes a separate ticket for each. The user reviews all tickets side by side, approves, and Passage files them. From that point Passage tracks every ticket, relays evidence between organizations where the user has allowed it, asks the user only the questions an organization genuinely needs answered, and shows one timeline until the problem is resolved.

The durable object still belongs to the person. Organizations remain the owners of their own ticketing systems. Passage does not replace their helpdesk; it files into it.

## 3. The Problem, Restated

Many everyday problems do not belong to one organization, and each organization wants the story in its own format. The person in the middle becomes both the integration layer and the dispatcher.

**Worked example (the parcel):** A package arrives damaged. The person calls the marketplace's customer service and explains. They are told to contact the courier. They call the courier and explain again. The courier says an inspector will visit to check the damage, and the visit needs the marketplace's claim number. Three conversations, three descriptions of the same event, two reference numbers to keep aligned, and a visit to schedule. Passage reduces this to one submission and one approval.

| **Situation** | **Organizations** | **What each one needs that the others do not** |
|---|---|---|
| Damaged online order | Marketplace, courier, card issuer | Marketplace: order and resolution choice. Courier: tracking number, damage type, inspection slot. Card issuer: transaction proof, dispute window |
| Failed UPI payment (debited, not credited) | Payment app, bank, merchant | Payment app: transaction ID and VPA. Bank: account last four, debit date, reference number, statement. Merchant: order reference |
| Water main burst damages a vehicle | Municipal water department, power utility, motor insurer | Municipality: geo-located service request. Utility: safety hazard report. Insurer: policy number, loss details, third-party reference |
| Flight disruption | Airline, hotel, travel insurer | Airline: booking and cancellation proof. Hotel: new dates. Insurer: delay certificate and receipts |

## 4. Product Vision and Positioning

**Vision:** A person's unresolved problem becomes a portable digital object that also acts for them: it knows who needs to hear about it, in what form, and keeps every thread connected.

**North-star principle:** "The organization changes; the problem record stays continuous. And the person is never the dispatcher."

### 4.1 Reconciling with v1.4

v1.4 stated that Passage is "not a shared ticketing system" and "not an autonomous agent." Both statements still hold, with a sharper meaning.

| **v1.4 statement** | **Status in v2.0** |
|---|---|
| Not a CRM, helpdesk or shared case workspace | Still true. Passage does not host the organizations' tickets. It creates tickets inside their systems and keeps references to them. |
| Not an autonomous agent that acts externally without user authorization | Still true. Nothing leaves Passage until the user approves the exact content per organization. AI cannot send, relay or escalate on its own. |
| The user owns the record; organizations are guests | Still true. The Passage is canonical. External tickets are projections of it. |
| Receiver view via zero-install link | Retained as one channel among several (the "Passage Link" adapter). |

### 4.2 Competitive position

Cross-organization case handling is not new, and consumer complaint services exist. Passage does not claim to be first. It claims a specific combination.

| **Existing solution** | **What it already does** | **Passage distinction** |
|---|---|---|
| Coactix, Cloudcase, Corely Work, CaseOnGo | Shared or cross-team case workflows inside or between organizations | Passage is user-owned and does not need every organization to adopt a shared workspace |
| Consumer complaint services (for example Resolver, DoNotPay; verify current features before comparing) | Help a person file a complaint with a company | Passage is open source, runs the AI locally, fans out to several organizations at once with a different ticket shape for each, and keeps one record |
| Open311 / FixMyStreet | Open standard and open-source platform for reporting civic problems | Passage uses Open311 as one adapter. It adds multi-organization fan-out and cross-domain links (for example civic report to insurance claim) |
| PEAC Protocol and similar | Portable signed records for automated interactions | Adjacent infrastructure; Passage applies portability to human resolution cases |

**Competitive claim:** "Passage is the user's resolution agent: structure once, file everywhere, keep one record. It is open source and runs on an open model locally." Never claim that cross-organization cases or complaint filing are new.

## 5. The Resolution Workflow

This is the core of v2.0.

| **#** | **Stage** | **Who acts** | **What happens** | **Output** |
|---|---|---|---|---|
| 1 | Submit | User | Writes or speaks the problem, attaches invoice, photos, screenshots, PDFs | Raw input |
| 2 | Compile | Gemma (Case Compiler) | Extracts problem, timeline, entities, identifiers, evidence list, requested outcome | Draft Passage tagged AI-derived |
| 3 | Confirm | User | Reviews and confirms or edits each AI-derived item | Canonical Passage |
| 4 | Route | Rules first, Gemma suggests | Finds relevant organizations from identifiers and issue type using the Org Profile registry; determines order and dependencies | Org Plan |
| 5 | Compose | Gemma + schema validator | For each organization, fills that organization's ticket schema from the Passage, selecting only allowed evidence | One Ticket Draft per organization |
| 6 | Approve | User (Consent Gate) | Sees every draft side by side, toggles evidence per organization, edits fields, approves all or individually | Signed-off drafts and a delegation record |
| 7 | Dispatch | Workflow engine + adapters | Creates external tickets in dependency order and records each reference | Tickets with external references |
| 8 | Track | Adapters, webhooks, polling, Gemma (Reply Interpreter) | Pulls status and messages from every ticket, maps them to a common status | Events in the hash chain |
| 9 | Relay | Workflow engine under user rules | Answers "needs info" requests; forwards outcomes (for example a courier's inspection report) to other organizations where allowed | Cross-organization updates |
| 10 | Escalate / Resolve | User approves; engine drafts | If an SLA expires, drafts an escalation to the next tier; on resolution, closes tickets and produces a summary | Resolved Passage, effort counter |

```
User input --> Compile --> Confirm --> Route --> Compose --> Approve --> Dispatch
                                                                           |
                      Resolve <-- Escalate <-- Relay <-- Track <----------+
```

### 5.1 What is deterministic and what is AI

| **Deterministic (authoritative)** | **AI-assisted (always reviewable)** |
|---|---|
| IDs, timestamps, status transitions, approvals, hash chain | Extracting facts from messy input |
| Routing rules in Org Profiles (for example "AWB present means courier is relevant") | Suggesting extra organizations the rules missed |
| Schema validation of every ticket draft | Filling ticket fields and writing the free-text description in the organization's expected style |
| SLA timers and escalation thresholds | Interpreting free-text replies into status or "needs info" |
| What leaves the machine: only approved fields and evidence | Drafting escalation text |

### 5.2 Per-organization structure

The same facts take a different shape for each organization. The Ticket Composer works from the organization's JSON Schema (referenced by its Org Profile). Ollama's structured output option constrains Gemma to that schema, and the backend validates the result again. If validation fails twice, the draft is built from a plain template and the missing fields are flagged for the user. A draft that does not validate is never sent.

### 5.3 Dependencies and relay

- **Reference dependency:** the courier's inspection ticket needs the marketplace's claim number. Dispatch order is computed from the Org Plan, and the first ticket's reference is inserted into the second.
- **Evidence relay:** the courier's inspection report is useful to the marketplace. At the Consent Gate the user can allow "relay outcomes between these organizations for this case." Without that permission, the user is asked each time.
- **Needs-info loop:** if an organization asks a question, it appears once in the user's inbox. The user answers once. Passage relays the answer to every organization that asked or needs it, subject to each one's disclosure policy.

## 6. Org Profiles and the Open Registry

An Org Profile is a small public file that tells Passage how to reach an organization and what it expects. Profiles live in the repo under protocol/orgs/ and can be contributed by anyone, much like community-maintained how-to-complain guides, but machine readable.

| **Profile field** | **Purpose** |
|---|---|
| slug, name, domain | Identity and category |
| channels | Ordered list of ways to reach the organization (see section 7) |
| ticket_type and schema | The JSON Schema Passage must satisfy for this organization |
| triggers | Rules that make this organization relevant (identifiers present, issue types) |
| required_fields | What must be present before a draft can be approved |
| evidence_policy | Evidence types the organization may receive, and types it must never receive |
| depends_on | References needed from other organizations' tickets |
| sla | Expected first response and resolution times, and the escalation target |
| status_map | Translation from the organization's statuses to Passage statuses |
| verified | Who checked the profile, when, and the source |

Example profile (fictional courier, for the demo):

```json
{
  "slug": "swiftcourier",
  "name": "SwiftCourier (fictional)",
  "domain": "logistics",
  "channels": [
    {"type": "sandbox_api", "priority": 1},
    {"type": "email", "address": "claims@swiftcourier.example", "priority": 2},
    {"type": "passage_link", "priority": 3}
  ],
  "ticket_type": "courier.damage_inspection.v1",
  "schema": "schemas/courier.damage_inspection.v1.json",
  "triggers": {"identifiers": ["awb"], "issue_types": ["damaged_on_arrival"]},
  "required_fields": ["awb", "delivery_date", "damage_type", "consignee", "visit_slots", "outer_package_photos"],
  "evidence_policy": {
    "allow": ["outer_package_photos", "delivery_notification"],
    "deny": ["payment_proof", "other_party_chat"]
  },
  "depends_on": [{"org": "shopmart", "need": "ticket_ref", "as": "shipper_claim_ref"}],
  "sla": {"first_response_hours": 24, "resolution_hours": 96, "escalate_to": "swiftcourier-nodal-officer"},
  "status_map": {
    "OPEN": "submitted",
    "VISIT_SCHEDULED": "in_progress",
    "INSPECTED": "in_progress",
    "CLOSED_APPROVED": "resolved",
    "CLOSED_REJECTED": "rejected"
  },
  "verified": {"by": "team", "on": "2026-10-04", "source": "fictional demo profile"}
}
```

Every profile for a real organization must carry a source link and a last-verified date. Demo organizations are fictional and labeled as such.

## 7. Adapter Layer and Integration Tiers

An adapter turns an approved Ticket Draft into a real submission, and turns the organization's responses back into Passage events. All adapters implement the same interface: create, fetch status, send message, receive webhook.

| **Adapter** | **How it reaches the organization** | **Open-source or open-standard basis** | **Priority** |
|---|---|---|---|
| Sandbox Console | Built-in mock organization portal with its own ticket schema and ID format; used for fictional demo organizations | Our own code, Apache-2.0 | P0 |
| Email-to-ticket | Sends a structured email (and PDF form where needed) to the organization's official intake address; reads replies from a test inbox in the demo | SMTP; Mailpit (MIT) for the demo inbox | P0 |
| Helpdesk REST | Creates tickets, articles and attachments through the helpdesk API; receives webhooks | Zammad (AGPL-3.0, REST API) as the primary target; osTicket and Chatwoot as later targets | P1 |
| Open311 | Posts a GeoReport v2 service request, polls for updates | Open311 GeoReport v2 standard; FixMyStreet (AGPL-3.0) as a local test endpoint | P1 |
| Passage Link | Zero-install secure receiver page from v1.4 | Our own code | P0 (carried over) |
| Generic webhook | Signed JSON event for organizations that want to integrate | CloudEvents format | P2 |
| Assisted manual | For organizations with no automated channel: a ready-to-paste form pack with a checklist; the user presses submit | Our own code | P1 |

### 7.1 Reality check on real organizations

Large companies, banks and airlines generally do not offer a public API for creating support tickets on a customer's behalf. Passage handles this honestly.

- The demo uses fictional organizations behind sandbox consoles and open-source systems we run ourselves. This proves the workflow without pretending to integrate with a real brand.
- For real organizations the order of preference is: official partner API, open standard (Open311), official email-to-ticket address, assisted manual submission.
- Passage never scrapes websites, stores third-party credentials, bypasses CAPTCHAs or OTPs, or impersonates the user. Where an organization requires the user to verify identity (for example an OTP to the registered phone), the organization performs that step with the user directly.
- Every ticket states that it was submitted through Passage on behalf of the named user with the user's authorization, and gives the user's contact details so the organization can verify.
- Do not claim integrations with Amazon, any bank or any airline in the demo or the submission. Say "this works with any organization that exposes one of these channels."

## 8. Open-Source Stack and Compliance (additions to v1.4 section 10)

All v1.4 rules still apply: no proprietary LLM API anywhere in the product path, cached AI outputs must be real saved outputs from a local run and labeled as such, and every dependency is listed with its license in THIRD_PARTY_LICENSES.md. Verify every license on its official page before submission.

| **Component** | **Role in v2.0** | **License (verify)** | **Priority** |
|---|---|---|---|
| Gemma 4 via Ollama | Case Compiler, Org Router suggestions, Ticket Composer, Reply Interpreter, Escalation Drafter | Apache-2.0 per launch (confirm on model card); Ollama MIT | P0 |
| Ollama structured outputs | Constrains Gemma to an organization's JSON Schema | Part of Ollama | P0 |
| Zammad | Real open-source helpdesk used as a receiving organization (for example the bank in case 2) | AGPL-3.0 | P1 |
| Open311 GeoReport v2 | Open standard for civic service requests (case 3) | Open specification | P1 |
| FixMyStreet | Local Open311-compatible test platform for the municipal side | AGPL-3.0 | P1 |
| Mailpit | Captures outgoing demo emails and exposes them through an API so the audience can see the email arrive | MIT | P0 |
| httpx | Adapter HTTP client | BSD-3-Clause | P0 |
| jsonschema, Pydantic | Validation of Org Profiles and Ticket Drafts | MIT | P0 |
| Jinja2 and WeasyPrint | Email bodies and PDF claim forms (insurer in case 3) | BSD-3-Clause | P1 |
| APScheduler | SLA timers and status polling in the MVP | MIT | P1 |
| Leaflet with OpenStreetMap | Location pin for the municipal and utility tickets | BSD-2-Clause; OSM data under ODbL, follow the tile usage policy | P1 |
| Apprise | Notifications to the user (push, email, chat apps) | BSD-2-Clause | P2 |
| whisper.cpp or Whisper | Voice input for the problem description | MIT | P2 |
| CloudEvents | Event envelope for the generic webhook adapter | Open specification | P2 |
| Temporal | Durable workflow engine for production dispatch and timers | MIT | Roadmap |
| Keycloak | Real user authentication and organization accounts | Apache-2.0 | Roadmap |

**AGPL note:** Zammad and FixMyStreet are run as separate services and called over HTTP. Passage does not link or embed their code, so the Passage core remains Apache-2.0. Confirm this reading before submission.

**Open Org Profile registry:** protocol/orgs/ with schemas in protocol/schemas/ is itself an open-source contribution. It lets third parties add a new organization or country without touching core code.

## 9. Data Model (additions to v1.4 section 8)

| **Object** | **Purpose** |
|---|---|
| Org Plan | The organizations chosen for this Passage, why each was chosen, dispatch order and dependencies |
| Ticket Draft | Per-organization payload conforming to that organization's schema, with field-level source (user, document, AI) and the evidence selected |
| Consent Record | What the user approved, for which organization, which fields and evidence, and which relay rules; timestamped and hash-chained |
| Ticket | External reference, adapter used, channel, normalized status, raw status, last sync time |
| Dependency | Which ticket needs which reference or outcome from another |
| Question | A "needs info" request from an organization, shown once to the user, with the answer and where it was relayed |
| Escalation | Drafted next-tier complaint, trigger reason, and the user's decision |
| Delegation statement | The text included in every ticket explaining that Passage files on the user's behalf with their authorization |
| Effort counter | Retellings avoided, contacts avoided, tickets consolidated; shown on the resolved screen |

**Normalized status:** submitted, acknowledged, in_progress, needs_info, resolved, rejected, escalated, withdrawn.

**Hash chain:** every approval, dispatch, status change, relayed item and answer is an event in the existing SHA-256 chain. As in v1.4, the chain shows the record was not altered after the fact; it does not prove the content is true.

## 10. API Contract (additions to v1.4)

| **Endpoint** | **Purpose** |
|---|---|
| POST /api/passages/{id}/plan | Run the Org Router; returns the Org Plan |
| PUT /api/passages/{id}/plan | User adds or removes organizations |
| POST /api/passages/{id}/drafts | Compose Ticket Drafts for the plan |
| GET /api/passages/{id}/drafts | Fetch drafts for side-by-side review |
| PATCH /api/drafts/{draft_id} | Edit fields, toggle evidence |
| POST /api/passages/{id}/dispatch | Approve selected drafts and send; records Consent Records |
| GET /api/passages/{id}/tickets | Tickets with normalized status |
| POST /api/tickets/{id}/sync | Refresh one ticket now |
| POST /api/webhooks/{adapter}/{token} | Inbound status or message from an organization |
| GET /api/passages/{id}/questions | Open "needs info" questions |
| POST /api/questions/{id}/answer | Answer once; relays under disclosure rules |
| POST /api/escalations/{id}/approve | Send a drafted escalation |
| GET /api/orgs and GET /api/orgs/{slug} | Org Profile registry |
| /sandbox/{org}/... | Sandbox organization consoles for the demo |

## 11. The Three Demo Cases

Each case uses a different domain, different organizations and different ticket shapes. All organizations are fictional unless stated. Each case is seeded with a real saved Gemma run so it works offline.

### 11.1 Case 1: The Damaged Parcel (e-commerce and logistics)

**Story:** Mira orders a pressure cooker from ShopMart. It arrives with a crushed corner and a dented body. Normally she would call ShopMart, be told to contact the courier, call SwiftCourier, and wait for an inspector. With Passage she submits once.

**Input:** short description, invoice PDF, two photos of the box, the courier's delivery message.

**Organizations and their tickets**

| **Field group** | **ShopMart (marketplace) Return/Replace request** | **SwiftCourier Damage Inspection visit** |
|---|---|---|
| Identifier | Order ID, item SKU | Tracking number (AWB), delivery date |
| Issue | Damaged on arrival; requested outcome: replacement | Damage type: crushed corner, dented body |
| Evidence | Invoice, photos of item and box | Outer-package photos, delivery notification; invoice and payment details withheld |
| Logistics | Pickup address, contact window | Consignee name, phone, address, three visit slots |
| Cross-reference | Own ticket ID is issued first | Shipper claim reference = ShopMart ticket ID (dependency) |
| Special | Resolution choice, return pickup | Consent for inspector to photograph the item |

**Workflow**

1. Both tickets are drafted. ShopMart is dispatched first so its ticket ID can go into the courier ticket.
2. SwiftCourier schedules the inspection. The inspector's result appears in Passage as an event.
3. With the user's relay permission, the inspection report is forwarded to ShopMart.
4. ShopMart approves the replacement and the Passage resolves.
5. Conditional branch: if a refund was requested and is not processed within the profile's window, Passage drafts a chargeback request to the card issuer for the user's approval.

**Adapters:** Sandbox Console for ShopMart and SwiftCourier (P0); email adapter as a second channel for SwiftCourier.

**What the audience sees:** two tickets with different fields, a reference number moving from one to the other, an inspection result appearing without the user doing anything, and an effort counter showing contacts avoided.

### 11.2 Case 2: Money Debited, Payment Failed (finance and payments)

**Story:** Arjun pays a merchant by UPI. His account is debited, but the app shows the payment as failed and the merchant says nothing arrived. He would normally chat with the payment app, then call his bank, each asking for the same screenshot and reference.

**Input:** one-line description, payment app screenshot, bank SMS text or statement extract.

**Organizations and their tickets**

| **Field group** | **PayEasy (payment app) Payment dispute** | **Northfield Bank (remitter bank) Transaction complaint** |
|---|---|---|
| Identifier | UPI transaction ID, payer and payee VPA | Account last four digits, debit reference number (RRN), debit date |
| Issue | Status shown in app: failed or pending; amount debited | Complaint type: debited, not credited; channel: UPI |
| Evidence | App screenshot, timestamps | Statement extract; app chat transcript withheld |
| Cross-reference | Own ticket ID is issued first | App ticket reference included; reversal requested |
| Sensitive data | Bank account number not shared | Merchant chat and app account details not shared |
| Special | Preferred outcome: auto-reversal or refund | Identity verification done by the bank directly with the user |

**Workflow**

1. Both tickets are filed in parallel, with the bank ticket referencing the app ticket.
2. If an automatic reversal arrives within the expected window, both tickets resolve and the Passage closes.
3. If not, the SLA timer in the Org Profile fires, and Passage drafts an escalation to the next tier (for example the regulator's complaint portal) for the user's approval. Escalation thresholds are configured in the profile and must be checked against the current regulator rules, not hard-coded.
4. A "needs info" question from the bank (for example the last four digits of the debit card) appears once in the inbox and is relayed to the bank only.

**Adapters:** Zammad as Northfield Bank's real helpdesk (P1, proves a real open-source integration); Sandbox Console for PayEasy (P0).

**What the audience sees:** the same facts split into two different structures, selective disclosure (each organization sees only what it needs), a real helpdesk ticket appearing in Zammad, and a timer-driven escalation draft.

### 11.3 Case 3: The Burst Water Main (civic, utilities and insurance)

**Story:** Priya parks her scooter on her street. A water main bursts overnight, floods the lane and submerges the electrical meter box. Her scooter is damaged. She needs the municipality to fix the pipe, the power utility to make the area safe, and her insurer to open a claim, and the insurer will want proof of the cause.

**Input:** photos of the flooded street and the scooter, a location pin, the insurance policy PDF, a short description.

**Organizations and their tickets**

| **Field group** | **Municipal Water Department (Open311 service request)** | **Power utility (safety hazard report)** | **Shield Motor Insurance (claim intimation)** |
|---|---|---|---|
| Identifier | Jurisdiction, service code: water main leak | Location, landmark, nearest pole or box number | Policy number, vehicle registration |
| Location | Latitude, longitude, address string | Location plus site contact | Place of loss |
| Issue | Description, photos (media URLs) | Hazard: submerged electrical equipment; immediate danger: yes | Cause of loss: flooding from public infrastructure failure; damage description |
| Evidence | Street photos | Street photos, meter box photo | Vehicle photos, policy copy, repair estimate |
| Cross-reference | Issues service request ID | Municipal request ID as context | Third-party reference = municipal request ID and the Passage timeline fingerprint |
| Priority | Normal-high | Safety, highest | Within the policy's claim-notification window |
| Special | Reporter contact fields per Open311 | Contact for field crew | PDF claim form generated from the Passage |

**Workflow**

1. The municipal and power utility tickets are dispatched at once (safety first, no dependency between them).
2. The insurer ticket waits for the municipal request ID, then is dispatched with the ID and the Passage timeline attached.
3. Status updates arrive through Open311 polling and the utility's channel. The municipal "fixed" update and the utility's "area made safe" update are added to the timeline and relayed to the insurer if the user allowed it.
4. The insurer opens a claim, asks for the repair estimate, the user answers once, and the claim moves forward.

**Adapters:** Open311 adapter to a local FixMyStreet endpoint (P1); Sandbox Console for the power utility (P0); email-to-ticket with a generated PDF form for the insurer, visible in Mailpit (P0).

**What the audience sees:** a map pin, an open-standard request created in an open-source civic platform, three different ticket shapes from the same facts, and a dependency chain where the insurer's claim is strengthened by the civic report.

### 11.4 Why these three

| **Property** | **Case 1** | **Case 2** | **Case 3** |
|---|---|---|---|
| Domain | E-commerce and logistics | Finance and payments | Civic services, utilities, insurance |
| Organizations | 2 (+1 conditional) | 2 (+1 escalation) | 3 |
| Dispatch pattern | Sequential with reference | Parallel with cross-reference | Parallel, then dependent |
| Distinctive feature | Inspection visit and evidence relay | Selective disclosure and SLA escalation | Open standard (Open311) and geo-location |
| Main adapter | Sandbox | Zammad (real) | Open311, email with PDF |

A fourth case, a flight disruption (airline, hotel, travel insurer), is kept as a stretch scenario from v1.4 and should not be built unless the other three are solid.

## 12. Demo Script

**Three-minute version (judges)**

1. Problem (20 s): "Mira's parcel arrived broken. She'd have to call two companies, tell the story twice and keep two reference numbers aligned."
2. Submit (20 s): one sentence, an invoice and two photos. Gemma compiles locally; the "runs locally" badge and AI-derived tags are visible.
3. Confirm and plan (20 s): Mira confirms; Passage shows "ShopMart and SwiftCourier need to act."
4. Side-by-side drafts (30 s): two different tickets from the same facts. Mira toggles the invoice off for the courier. She taps Approve.
5. Dispatch (20 s): Open the ShopMart sandbox console and the SwiftCourier console; both tickets are there, the courier's carries ShopMart's claim number.
6. Outcome (30 s): the courier console marks the inspection done; the result appears in Mira's timeline and in ShopMart's ticket; ShopMart approves the replacement.
7. Resolved screen (20 s): one timeline, integrity fingerprint, effort counter: "2 organizations, 1 submission, 0 retellings."
8. Breadth (20 s): flip to cases 2 and 3 on the drafts screen to show the different ticket shapes; show the real Zammad ticket and the Open311 request.

**Six-minute version (judges who ask for more):** run case 2 or case 3 live end to end.

**Close:** "The person did not become the dispatcher. The problem state moved, and each organization got exactly the ticket it needed."

## 13. MVP Scope

| **Priority** | **Feature** | **Acceptance criterion** | **Stream** |
|---|---|---|---|
| P0 | All v1.4 P0 items | Unchanged | A, B, C |
| P0 | Org Profile registry and schemas for 7 demo organizations | Profiles validate; each has a ticket schema | B (schemas), C (field content) |
| P0 | Org Router | Case inputs produce the expected Org Plan | B |
| P0 | Ticket Composer with schema validation | Drafts validate; invalid output is never sent | B |
| P0 | Side-by-side draft review and Consent Gate | User can toggle evidence per organization and approve all or one | A |
| P0 | Dispatcher with dependency ordering | Case 1 and case 3 reference numbers pass between tickets | B |
| P0 | Sandbox Console for fictional organizations | Each shows its own ticket shape and ID format and can change status | A + B |
| P0 | Tracker screen with normalized status | Statuses update live from the consoles | A |
| P0 | Email adapter with Mailpit | Insurer email with PDF form visible in the test inbox | B |
| P0 | Three cases seeded with cached real Gemma runs | All three complete end to end offline | B + C |
| P0 | Effort counter on the resolved screen | Shows contacts and retellings avoided | A |
| P1 | Zammad adapter (case 2 bank) | Real ticket created and webhook updates received | B |
| P1 | Open311 adapter with local FixMyStreet (case 3) | Service request created and update polled | B |
| P1 | Needs-info inbox with relay | One answer reaches the right organization | A + B |
| P1 | SLA timer and escalation draft | Demo timer can be fast-forwarded to show an escalation draft | B |
| P1 | Assisted manual channel | Form pack and checklist generated | A + B |
| P2 | Voice input, Apprise notifications, generic webhook | Optional | A / B |
| Not in MVP | Real brand integrations, real auth, payments | Out of scope | None |

### 13.1 Build order

1. **Foundation:** Org Profile format, schemas for the seven demo organizations, Org Plan and Ticket Draft objects, API contract frozen.
2. **Core loop on sandboxes:** Router, Composer, Consent Gate, Dispatcher, Sandbox Consoles, Tracker. Get case 1 working fully before touching the others.
3. **Cases 2 and 3 on sandboxes:** reuse the loop; add dependency handling and the email adapter with PDF form.
4. **Real open-source integrations:** Zammad for case 2, FixMyStreet with Open311 for case 3.
5. **Escalation, needs-info inbox, polish, rehearsal.**

**If time is short:** cut in this order: Assisted manual, voice, needs-info inbox, escalation, Open311, Zammad. Never cut case 1 on sandboxes or the Consent Gate.

### 13.2 Screens

The six v1.4 screens remain. Share is replaced and four are added.

1. Start: "Tell it once."
2. Review: compiled draft with AI-derived tags.
3. Plan: "These organizations need to act" with reasons; add or remove.
4. Drafts: tickets side by side, evidence toggles per organization, delegation statement, one Approve button.
5. Tracker: each organization, its ticket reference, normalized status, last update.
6. Inbox: questions from organizations, answered once.
7. Timeline: one chronological record across all organizations.
8. Resolved: full chain, integrity fingerprint, effort counter.
9. Receiver view (Passage Link) and Sandbox Consoles for the demo, with the role switcher.

Design direction from v1.4 section 19 is unchanged: warm off-white, near-black ink, one vermilion accent, serif headlines, almost no icons, no dashed lines, no gradients, mobile-first. The Drafts screen on desktop uses columns; on a phone it uses one organization at a time with a clear "next organization" action.

## 14. Trust, Consent and Security

- **Explicit delegation:** nothing is sent until the user approves the exact content for each organization. Approval is recorded.
- **Minimum disclosure by organization:** evidence policy in each Org Profile plus per-organization toggles. Case 2 shows this with account details withheld from the app and chat details withheld from the bank.
- **Relay needs permission:** forwarding one organization's outcome to another requires the user's rule at approval time or a per-item confirmation.
- **Honest identity:** each ticket states it was filed through Passage on the named user's behalf. Passage does not pretend to be the user, does not hold third-party credentials and does not defeat verification steps.
- **Authorized channels only:** APIs, open standards, official intake addresses, or the user's own manual submission.
- **AI separated from authority:** AI cannot send, relay, escalate, withdraw or close anything. It proposes; the user approves.
- **Local-first AI:** evidence is processed by the local model. Only approved fields leave the machine, through the chosen adapter.
- **Revocation:** the user can withdraw a ticket where the channel supports it, and revoke Passage Links.
- **Integrity:** hash chain as in v1.4, with the same plain statement that it proves non-alteration, not truth.
- **No legal claims:** Passage does not claim legal compliance, legal validity of any complaint, or regulator acceptance.
- **Sensitive data in the demo:** use only fictional data and screenshots created for the demo.

## 15. Risks and Mitigations

| **Risk** | **Mitigation** |
|---|---|
| Looks like it is claiming integrations with real brands | Use fictional organizations; state the channel ladder; never name a real brand as integrated |
| Organizations reject or ignore machine-filed tickets | Honest delegation statement; structured, complete tickets reduce back-and-forth; assisted manual fallback |
| AI fills a ticket field wrongly | Schema validation, field-level source tags, review at the Consent Gate, deterministic parsing of IDs and dates |
| Wrong organization chosen | Rules first, user edits the Org Plan before anything is composed |
| Sensitive data goes to the wrong party | Evidence policy per profile, per-organization toggles, default deny for payment and identity documents |
| Local model slow on stage | Cached real runs for all three cases, labeled as cached; test the fallback |
| Too many moving parts for the time | Sandboxes first; Zammad and Open311 are P1 and cut before the core loop |
| Docker services (Zammad, FixMyStreet, Mailpit) fail on demo day | Sandbox Console is the default for every organization; real integrations are a bonus shown from a recording if needed |
| AGPL services misread as relicensing the core | Run them as separate services over HTTP; list them in THIRD_PARTY_LICENSES.md |
| Escalation rules go out of date | Profiles carry a verified date and source; thresholds live in the profile, not in code |
| Hash chain read as proof of truth | State it plainly in the UI and the pitch |

## 16. Non-Goals

- Not a helpdesk, CRM or case-management suite. Passage files into those, it does not replace them.
- Not an agent that acts without user approval.
- Not a scraper, credential vault or CAPTCHA/OTP bypass tool.
- Not a legal advice, adjudication or payment platform.
- Not an integration with any real brand in this build.
- Not a claim that multi-organization complaints are novel.

## 17. Team and Work Split (v2.0)

Streams remain A, B and C and can be assigned to anyone and swapped at any time. The working rules from v1.4 section 20 are unchanged: A and B do not edit each other's folders, the frontend builds on example JSON first, and progress.md and activeContext.md are updated after each finished step.

| **Stream** | **v2.0 scope** | **Files and folders** |
|---|---|---|
| A: Design and frontend | Plan, Drafts, Tracker, Inbox and Resolved screens; Sandbox Console UI; role switcher; map pin; effort counter | frontend/, sandbox-ui/, animations/ |
| B: Backend and AI | Org Router, Ticket Composer, Dispatcher and dependency engine, adapters (sandbox, email, Zammad, Open311), webhooks, SLA timers, Org Profile and schema validation, hash-chain events, cached AI runs, Docker Compose, licenses | backend/, adapters/, protocol/, ai/prompts/, tests/ |
| C: Product, story and content | Three case write-ups with the exact fields each organization needs, Org Profile content for the seven demo organizations, sample tickets and replies, escalation wording, demo script, Q&A cards, phone testing, backup video | protocol/orgs/ (content), protocol/examples/, README, progress.md |

| **Stream** | **Person** | **Backup** |
|---|---|---|
| A: Design and frontend | | |
| B: Backend and AI | | |
| C: Product, story and content | | |

**Decision rights:** how it looks (A); how it works, which adapters, what is open source (B); what the story is, what each organization's ticket contains, what to cut (C).

## 18. Success Metrics

| **Metric** | **Target** |
|---|---|
| Contacts the user must initiate | One submission, one approval per Passage |
| Time from confirmed Passage to all tickets filed | Under 60 seconds in the demo |
| Draft validity | 100 percent of dispatched drafts validate against their schema |
| Review burden | User reviews all drafts in under 60 seconds |
| Reference passing | Dependent tickets contain the correct reference in all three cases |
| Disclosure correctness | Withheld evidence never appears in a ticket for an organization that should not receive it |
| Demo reliability | 3 of 3 cases complete end to end offline with cached runs |
| Effort counter | Resolved screen shows retellings and contacts avoided |

## 19. Roadmap

| **Phase** | **Capability** |
|---|---|
| v0.1 (hackathon) | v1.4 passport plus the Resolution Workflow on sandbox organizations; three demo cases; email adapter |
| v0.2 | Zammad and Open311 adapters hardened; needs-info inbox; SLA escalation; voice input |
| v0.5 | Org Profile registry open for contributions; osTicket and Chatwoot adapters; generic signed webhook; Temporal for durable workflows; Keycloak accounts |
| v1.0 | SDKs for organizations to publish their own Org Profile and receive Passage events; email ingestion; signatures |
| Long term | Independent organizations exchange portable resolution state directly; Passage is one of several clients |

## 20. Repository Plan (additions)

```
passage/
├── frontend/
├── sandbox-ui/              # fictional organization consoles
├── backend/
│   ├── router/              # Org Router
│   ├── composer/            # Ticket Composer
│   ├── dispatcher/          # workflow engine, dependencies, timers
│   └── adapters/            # sandbox, email, zammad, open311, link, webhook
├── protocol/
│   ├── passage.schema.json
│   ├── schemas/             # per-organization ticket schemas
│   ├── orgs/                # Org Profiles (open registry)
│   └── examples/            # three case Passages, drafts, replies
├── ai/prompts/              # compiler, router, composer, reply interpreter, escalation
├── docker-compose.yml       # app, Ollama, Mailpit, optional Zammad and FixMyStreet
├── tests/
├── LICENSE                  # Apache-2.0
├── THIRD_PARTY_LICENSES.md
└── README.md
```

The README must state which components are open source, that Gemma weights are external, that all demo organizations are fictional, and which optional services (Zammad, FixMyStreet) are AGPL and run separately.

## 21. Q&A Prep (additions)

| **Question** | **Answer** |
|---|---|
| Does it really create tickets in Amazon, a bank, an airline? | Not in this build, and we do not claim it. The demo uses fictional organizations and real open-source systems. For real organizations it uses official channels in this order: partner API, open standard, official intake email, assisted manual. |
| Why would an organization accept a ticket filed by Passage? | It arrives complete, in the format they asked for, with the right evidence, and it states clearly who authorized it. That cuts back-and-forth. |
| Isn't it risky to let AI file things for people? | AI proposes, the user approves each organization's exact ticket. AI cannot send, relay, escalate or close. |
| What stops it sharing too much? | Evidence policies in each Org Profile, per-organization toggles, and default deny for payment and identity documents. |
| How is this different from a complaint service? | Open source, local AI, one submission fanned out to several organizations in different shapes, dependencies between tickets, and one record owned by the user. |
| Which open-source projects did you use? | Gemma 4 via Ollama, Zammad, FixMyStreet and the Open311 standard, Mailpit, FastAPI, SQLite, React; the Org Profile registry is itself open. |
| What if an organization's rules change? | Profiles carry a source and verification date, thresholds live in the profile, and anyone can submit a fix. |
| Is the hash chain proof? | It shows the record was not altered afterward. It does not prove the facts are true. |

## 22. Submission Positioning

**Competition statement:** "Passage is a user-owned resolution workflow. A person describes a problem once. Gemma, running locally, structures it, and Passage files a separately shaped ticket with each organization involved, after the user's approval, then tracks every thread in one record. The person never becomes the dispatcher."

**Open-source statement:** "Gemma 4 runs locally as the compiler, router and ticket writer. Organizations are described by an open registry of profiles and schemas. We integrate through open standards and open-source systems (Open311, Zammad, FixMyStreet), and the core is Apache-2.0."

**Demo statement:** "One problem. One submission. Every organization gets exactly the ticket it needs."

## 23. Reference Links

- Coactix: https://www.coactix.com/
- Cloudcase: https://cloudcase.net/platform/channels
- Corely Work: https://corely.com/products/work
- PEAC Protocol: https://github.com/peacprotocol/peac
- Open Grove Handoff: https://github.com/open-grove/handoff
- Gemma 4 launch: https://developers.googleblog.com/bring-state-of-the-art-agentic-skills-to-the-edge-with-gemma-4/
- Zammad (helpdesk, REST API, AGPL-3.0): https://github.com/zammad/zammad and https://docs.zammad.org/en/latest/api/intro.html
- Open311 GeoReport v2: http://wiki.open311.org/GeoReport_v2/
- FixMyStreet Platform (AGPL-3.0): https://github.com/mysociety/fixmystreet
- Mailpit: https://github.com/axllent/mailpit
- Ollama structured outputs: https://docs.ollama.com/capabilities/structured-outputs
- CloudEvents: https://cloudevents.io/

## Appendix: Changes from v1.4

| **Area** | **Change** |
|---|---|
| Core workflow | Added the ten-stage Resolution Workflow: submit, compile, confirm, route, compose, approve, dispatch, track, relay, escalate or resolve |
| Per-organization tickets | Added Ticket Composer that builds a different ticket shape for each organization from its schema |
| Org Profiles | Added an open registry describing channels, schemas, triggers, evidence policy, dependencies, SLAs and status maps |
| Adapters | Added adapter layer: sandbox, email, helpdesk REST (Zammad), Open311, Passage Link, generic webhook, assisted manual |
| Consent | Added Consent Gate with per-organization approval, relay rules and delegation statement |
| Tracking | Added normalized status, webhooks and polling, needs-info inbox, SLA timers and escalation drafts |
| Demo | Replaced single deep scenario with three cases: damaged parcel, failed UPI payment, burst water main |
| Open source | Added Zammad, Open311, FixMyStreet, Mailpit and others with licenses and an AGPL note; Org Profile registry itself open |
| Honesty | Added reality check on real organizations: no brand integrations claimed, no scraping, no credential storage |
| Screens | Added Plan, Drafts, Tracker and Inbox; Share replaced by the Consent Gate |
| Team | Stream scopes updated for v2.0; assignment table retained |
| Non-goals | Reworded so that filing into organizations' systems is in scope and replacing them is not |
