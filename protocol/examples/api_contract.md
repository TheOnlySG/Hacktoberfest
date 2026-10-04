# Passage API Contract

This document defines the REST API contract for Passage v2.0. Nakul (frontend) can build against these endpoints using the example JSON responses.

## Core Passage Flow

### `POST /api/passages`
Create a new Passage from raw input.
- **Request Body:** `{"problem_description": "...", "attached_evidence": [{"id": "ev-1", "type": "invoice"}]}`
- **Response (200 OK):** `{"id": "p-123", "status": "raw"}`

### `GET /api/passages/{id}`
Fetch the current state of a Passage.
- **Response (200 OK):** Full `Passage` object conforming to `passage.schema.json`.

### `POST /api/passages/{id}/compile`
Run the Case Compiler (Groq API) to extract structured facts.
- **Response (200 OK):** Draft `Passage` object with AI-extracted `timeline`, `entities`, `evidence`, and `requested_outcome`.

### `PUT /api/passages/{id}/confirm`
User confirms the compiled draft.
- **Request Body:** Confirmed `Passage` object fields.
- **Response (200 OK):** `{"status": "confirmed"}`

### `POST /api/passages/{id}/plan`
Run the Org Router to determine which organizations need to act.
- **Response (200 OK):** `OrgPlan` object containing a list of `orgs` and their dispatch order.

### `PUT /api/passages/{id}/plan`
User adds or removes organizations from the plan.
- **Request Body:** Modified `OrgPlan`.
- **Response (200 OK):** Updated `OrgPlan`.

### `POST /api/passages/{id}/drafts`
Run the Ticket Composer to generate drafts for each organization in the plan.
- **Response (200 OK):** Array of `TicketDraft` objects.

### `GET /api/passages/{id}/drafts`
Fetch generated drafts for side-by-side review.
- **Response (200 OK):** Array of `TicketDraft` objects.

### `PATCH /api/drafts/{draft_id}`
User edits a specific draft or toggles evidence inclusion.
- **Request Body:** Partial `TicketDraft` object (e.g., toggled evidence flags).
- **Response (200 OK):** Updated `TicketDraft`.

### `POST /api/passages/{id}/dispatch`
Approve and dispatch selected drafts.
- **Request Body:** `{"draft_ids": ["d-1", "d-2"], "relay_rules": {...}}`
- **Response (200 OK):** Array of created `Ticket` objects with `ticket_ref`.

## Tracking & Updates

### `GET /api/passages/{id}/tickets`
Fetch tracked tickets and their normalized statuses.
- **Response (200 OK):** Array of `Ticket` objects from `passage.schema.json`.

### `POST /api/tickets/{ticket_id}/sync`
Force refresh a single ticket from its external source.
- **Response (200 OK):** Updated `Ticket` object.

### `POST /api/webhooks/{adapter}/{token}`
Inbound webhook from an organization (e.g., Zammad).
- **Request Body:** Adapter-specific payload.
- **Response (200 OK):** `{"status": "processed"}`

## Interaction & Relay

### `GET /api/passages/{id}/questions`
Fetch open "needs info" questions from organizations.
- **Response (200 OK):** Array of `Question` objects.

### `POST /api/questions/{question_id}/answer`
Provide an answer, which is relayed to necessary organizations.
- **Request Body:** `{"answer": "...", "attachments": []}`
- **Response (200 OK):** `{"status": "relayed"}`

### `POST /api/escalations/{escalation_id}/approve`
Approve an escalation draft triggered by an SLA breach.
- **Request Body:** `{"approved": true, "edited_text": "..."}`
- **Response (200 OK):** `{"status": "escalated"}`

## Registry & Demo Controls

### `GET /api/orgs`
List all verified organizations.
- **Response (200 OK):** Array of Org Profile summaries.

### `GET /api/orgs/{slug}`
Fetch a specific Org Profile.
- **Response (200 OK):** Org Profile object conforming to `passage_org_profile.schema.json`.

### `POST /sandbox/{org_slug}/tickets/{ticket_id}/status`
Demo control to mock a status change from a fictional organization.
- **Request Body:** `{"status": "INSPECTED"}`
- **Response (200 OK):** Sandbox ticket object.

### `POST /api/passages/{id}/fast_forward`
Demo control to instantly expire SLA timers and trigger escalations.
- **Response (200 OK):** `{"escalations_triggered": 1}`
