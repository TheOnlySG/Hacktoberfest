# Backend Context for Passage v2.0 (Stream A / Frontend Handoff)

This document provides a complete technical overview of the Passage Backend (Stream B) for the frontend team (Stream A).

## 1. Architecture Overview
The backend is built with **FastAPI** (`backend/main.py`) and serves as the orchestration layer for the Passage Resolution Workflow. It does *not* do heavy DB logic; instead, it mostly manages state and coordinates calls to external adapters and the AI.

### Tech Stack
- **Framework:** FastAPI / Uvicorn
- **AI Integration:** Llama 3.3 70B via the **Groq API** (using JSON structured outputs).
- **Document Generation:** WeasyPrint (PDFs), Jinja2 (HTML/Emails).
- **Scheduled Tasks:** APScheduler (for SLA polling).

## 2. The Core Resolution Pipeline
When a user submits a raw text problem, the backend processes it through a strict 4-step pipeline:

1. **Case Compiler (`backend/compiler/case_compiler.py`)**
   - Takes raw user text and evidence metadata.
   - Prompts Groq to extract a structured timeline, entities, and requested outcome.
   - Outputs a normalized `Passage` JSON object.

2. **Org Router (`backend/router/org_router.py`)**
   - Evaluates the compiled `Passage` against deterministic rules (e.g. if `entities` contains an AWB number, add the Courier).
   - Prompts Groq to suggest any additional orgs.
   - Sorts the final list of orgs based on dependencies (e.g. Courier needs Shipper's ticket reference first).

3. **Ticket Composer (`backend/composer/ticket_composer.py`)**
   - For each org in the routing plan, calls Groq to generate a highly specific "Ticket Draft" conforming to that org's strict JSON Schema.
   - Enforces the org's "Evidence Policy" (e.g., strips out chat screenshots if the org denies them).

4. **Dispatcher (`backend/dispatcher/engine.py`)**
   - Once drafts are approved by the user, the dispatcher executes them in dependency order.
   - It routes the ticket to the appropriate adapter based on the org's profile.

## 3. Adapters & Integrations
We use adapters to talk to different real-world and simulated systems without polluting our core code.
- **Sandbox (`adapters/sandbox.py`):** In-memory mock used for fictional orgs like "ShopMart".
- **Email (`adapters/email.py`):** Uses Jinja2 to write emails and WeasyPrint to attach PDF forms. Sent via local SMTP (Mailpit).
- **Zammad (`adapters/zammad.py`):** REST API integration for "Northfield Bank" helpdesk.
- **Open311 (`adapters/open311.py`):** GeoReport v2 API integration for "Municipal Water Dept" using FixMyStreet.

## 4. API Endpoints
We have stubbed out all the endpoints defined in the API contract. Swagger UI is available at `http://127.0.0.1:8000/docs`.

### Key Routes for Frontend:
- `POST /api/passages`: Submit raw input.
- `POST /api/passages/{id}/compile`: Trigger the Case Compiler.
- `POST /api/passages/{id}/plan`: Trigger the Org Router.
- `POST /api/passages/{id}/drafts`: Trigger the Ticket Composer.
- `POST /api/passages/{id}/dispatch`: Approve drafts and create tickets.
- `GET /api/passages/{id}/questions`: Fetch open "needs_info" questions.
- `POST /api/questions/{id}/answer`: Relay an answer back to an org.

*Full details and JSON examples are in `protocol/examples/api_contract.md`.*

## 5. Offline Demo Mode (Crucial!)
To ensure the hackathon demo works flawlessly without relying on live API calls or wifi:
- We have set `USE_CACHED_AI = True` in `backend/config.py`.
- Instead of calling Groq, the AI pipeline will instantly return the pre-generated JSON files located in `protocol/examples/` (e.g. `case1_input.json` and `case1_compiled.json`).
- If you need to make live AI calls, create a `.env` file in the `backend/` directory with `GROQ_API_KEY="your_key"` and set `USE_CACHED_AI=False`.

## 6. Where Things Live
- `backend/`: Python code (FastAPI, engine, adapters).
- `protocol/schemas/`: The JSON schemas the frontend forms should be built against.
- `protocol/orgs/`: The definitions of the organizations.
- `protocol/examples/`: Sample request/response payloads (very useful for mocking the UI).
- `docker-compose.yml`: Spins up FastAPI, Mailpit, Zammad, and FixMyStreet.
