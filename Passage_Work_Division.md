PASSAGE | WORK DIVISION v2.0

# Passage: Work Division

Companion to Passage PRD v2.0. This document says who owns what, in what order, and how the three of you hand work to each other.

| **Person** | **Role** | **Maps to PRD stream** |
|---|---|---|
| Spandan | All-rounder technical lead: backend, AI, adapters, infrastructure, open-source compliance | Stream B (Backend and AI), plus floating backup |
| Kaushik | Brainstormer and story owner: the three demo cases, organization content, demo script, testing | Stream C (Product, story and content) |
| Nakul | Frontend, bug fixing and overall development: screens, integration, final assembly | Stream A (Design and frontend), plus integration owner |

The streams in the PRD can still be swapped at any time. If one person is blocked or overloaded, update the assignment table in section 10 and write a note in progress.md.

## 1. How the three of you fit together

```
Kaushik: what each case contains, what each organization needs
        |
        v   (case write-ups, Org Profile content, sample replies)
Spandan: schemas, router, composer, dispatcher, adapters, API
        |
        v   (frozen API contract, example JSON)
Nakul:   screens, sandbox consoles, integration, bug fixing
        |
        v
Kaushik: tests every case as a first-time user, logs bugs back to Nakul and Spandan
```

Rule of thumb: Kaushik decides what the product says and which story is told. Spandan decides how it works. Nakul decides how it looks and is the one who makes it all run together on one device.

## 2. Spandan: technical lead (backend, AI, adapters, infrastructure)

### Owns

- All of backend/, adapters/, protocol/ (schemas and technical parts), ai/prompts/, tests/, docker-compose.yml, LICENSE, THIRD_PARTY_LICENSES.md
- The API contract and the Passage and Org Profile schemas (frozen early, changed only by agreement)
- Everything open source: licenses, the "runs locally" proof, the repo

### Deliverables

| **#** | **Deliverable** | **Detail** | **Priority** |
|---|---|---|---|
| S1 | Repo, folders, progress.md, activeContext.md | Create first so everyone can start | P0 |
| S2 | Frozen schemas | passage.schema.json, Org Profile schema, per-organization ticket schemas for the seven demo organizations | P0 |
| S3 | API contract | All v1.4 endpoints plus the v2.0 endpoints (plan, drafts, dispatch, tickets, questions, escalations, orgs, webhooks). Publish as example requests and responses for Nakul | P0 |
| S4 | Case Compiler | Gemma through Ollama, JSON validated against the schema | P0 |
| S5 | Org Router | Rules first (identifiers and issue types from the Org Profile), then Gemma suggestions | P0 |
| S6 | Ticket Composer | Gemma with the organization's schema, structured output, validation, retry, template fallback | P0 |
| S7 | Dispatcher | Dependency ordering (reference passing), consent records, hash-chain events | P0 |
| S8 | Sandbox adapter and sandbox API | Mock organization backends with their own ticket shapes and ID formats | P0 |
| S9 | Email adapter with Mailpit | Structured email plus a generated PDF claim form for the insurer | P0 |
| S10 | Cached AI runs | Real saved Gemma outputs for all three cases, labeled "cached from a local Gemma run" | P0 |
| S11 | Normalized status and webhook receiver | Status mapping from each Org Profile | P0 |
| S12 | Zammad adapter | Real helpdesk ticket for Northfield Bank in case 2 | P1 |
| S13 | Open311 adapter with FixMyStreet | Service request and update polling for case 3 | P1 |
| S14 | SLA timers and escalation drafts | A demo "fast forward" endpoint to trigger the escalation | P1 |
| S15 | Needs-info and answer relay | Disclosure rules applied on relay | P1 |
| S16 | Docker Compose and run steps | One command for the core app; optional profiles for Zammad and FixMyStreet | P0 |
| S17 | THIRD_PARTY_LICENSES.md and proof for judges | Terminal clip of Ollama running locally, license check against official pages | P0 |

### Floating duty

Spandan is the all-rounder. When Nakul or Kaushik is stuck, Spandan picks up the overflow in this order:

1. Integration bugs between frontend and API.
2. Sandbox console logic for any organization.
3. Prompt tuning when Kaushik flags wrong or odd model output.

## 3. Kaushik: story, demo cases and content

### Owns

- The three demo cases, end to end, as content
- Org Profile content for the seven demo organizations (what each organization requires, withholds and replies)
- All UI copy, the demo script, Q&A cards, the submission text
- First-user testing of every case

### Deliverables

| **#** | **Deliverable** | **Detail** | **Priority** |
|---|---|---|---|
| K1 | Case 1 write-up: damaged parcel | Characters, input text, evidence list, ShopMart ticket fields, SwiftCourier ticket fields, reference dependency, courier inspection result, ShopMart outcome, conditional card-issuer escalation | P0 |
| K2 | Case 2 write-up: failed UPI payment | PayEasy and Northfield Bank ticket fields, what each must not see, bank "needs info" question, auto-reversal outcome, escalation wording | P0 |
| K3 | Case 3 write-up: burst water main | Municipal (Open311) fields, power utility hazard fields, Shield Motor Insurance claim fields, dependency on the municipal request ID, status replies from each | P0 |
| K4 | Org Profile content | For each of the seven organizations: required fields, evidence allow and deny lists, triggers, status words, SLA, escalation target. Handed to Spandan as plain text or JSON drafts | P0 |
| K5 | Seed inputs | The text, fictional invoice, fictional screenshots and photos for each case (fictional data only) | P0 |
| K6 | Sample replies | What each organization says at each status change, so the sandbox consoles feel real | P0 |
| K7 | Handoff Brief samples | One per organization, so Spandan can tune the prompt toward what receivers actually want | P0 |
| K8 | UI copy | Short, plain, human copy for every screen (Start, Review, Plan, Drafts, Tracker, Timeline, Inbox, Escalation, Resolved, Console). Sent to Nakul before frontend build starts | P0 |
| K9 | AI output review | Read every Gemma output for wrong or odd facts; notes go to Spandan | P0 |
| K10 | Demo script | Three-minute judge version and six-minute extended version, with exact click path per case | P0 |
| K11 | Q&A cards | Questions from PRD section 21 plus any new ones from testing | P0 |
| K12 | First-user testing | Run every case on a phone as a first-time user; log bugs ranked by how much they hurt the demo | P0 |
| K13 | Backup demo video | Full recording in case the live demo fails | P0 |
| K14 | Submission text and README (non-technical parts) | Competition statement, open-source statement, honest limits | P0 |
| K15 | Photography direction list | Which real photos to use for each case, per the Stitch prompt | P1 |

### How Kaushik works with the others

- To Spandan: case content as plain text. Spandan loads it as seed data; Kaushik does not need to touch code.
- To Nakul: copy and photo list. Nakul places them.
- From both: any output that reads wrong comes back to Kaushik for a decision on what it should say.

## 4. Nakul: frontend, integration and bug fixing

### Owns

- frontend/, sandbox-ui/, animations/, public/assets/
- Overall development: assembling the pieces into one working app on one device
- The bug list: triage, fix, retest

### Deliverables

| **#** | **Deliverable** | **Detail** | **Priority** |
|---|---|---|---|
| N1 | App shell | React, Vite, Tailwind; tokens from the Stitch prompt (colours, type, pill buttons, status chips) | P0 |
| N2 | Start and Review screens | Blank Passage card that fills as the user types; AI-derived tags and Confirm actions | P0 |
| N3 | Plan screen | Stub per organization, reason line, remove and add | P0 |
| N4 | Drafts screen (consent gate) | Stubs side by side on desktop, one at a time on mobile; per-evidence On and Off; the "pass results between organizations" toggle; Approve button | P0 |
| N5 | Tracker screen | Passage card with stamp, stub per organization, status chips, last update, "Fast forward" control | P0 |
| N6 | Timeline and Resolved screens | One chronological record; retell counter; integrity fingerprint; stamps | P0 |
| N7 | Role switcher | "View as: You, ShopMart, SwiftCourier ..." for the whole flow on one device | P0 |
| N8 | Sandbox consoles | One simple console per fictional organization, each with its own ticket layout and status words | P0 |
| N9 | Handover animation | Passage card issues its stubs, stamps land one by one (Framer Motion). The only strong motion | P0 |
| N10 | Integration | Replace example JSON with live API calls, with the cached-AI fallback visible | P0 |
| N11 | Inbox and Escalation screens | Question cards with relay line; escalation sheet | P1 |
| N12 | QR code and Passage Link receiver view | Carried over from v1.4 | P1 |
| N13 | In-app open-source badge | "Compiled locally by [model]" and "Open format" link | P0 |
| N14 | Bug fixing | Owns the bug list from first integration to final rehearsal | P0 |
| N15 | Frontend licenses | Dependencies and licenses sent to Spandan for THIRD_PARTY_LICENSES.md | P0 |

### Build approach

- Build every screen against example JSON first. Do not wait for the backend.
- Build the Drafts screen and the handover animation early; they are the heart of the demo.
- Do not add icons, dashed lines, gradients or shadows beyond the single card shadow. The rules are in the Stitch prompt.

## 5. Who owns which case

Each case has one owner for content and one owner for technical delivery, so nothing is orphaned.

| **Case** | **Content and testing** | **Backend and adapters** | **Frontend and console** |
|---|---|---|---|
| 1: Damaged parcel (primary, build first) | Kaushik | Spandan: sandbox adapters, reference passing, evidence relay | Nakul: ShopMart and SwiftCourier consoles, Drafts view |
| 2: Failed UPI payment | Kaushik | Spandan: sandbox for PayEasy, Zammad adapter for Northfield Bank, SLA and escalation | Nakul: PayEasy console, escalation sheet |
| 3: Burst water main | Kaushik | Spandan: Open311 adapter, power utility sandbox, email adapter with PDF form | Nakul: map pin component, utility console |

Case 1 must be fully working end to end before work on case 2 or case 3 starts.

## 6. Phased plan

No fixed calendar is assumed. Each phase ends with a checkpoint that all three attend. Do not start the next phase until the checkpoint is passed.

### Phase 0: Foundation

| **Spandan** | **Kaushik** | **Nakul** |
|---|---|---|
| S1 repo and notes; S2 draft schemas; S3 draft API contract | K1 case 1 write-up; K8 copy for Start, Review, Plan, Drafts; start K4 Org Profile content for ShopMart and SwiftCourier | N1 app shell and tokens; N2 Start screen on example JSON |

**Checkpoint 0:** schemas and API contract frozen. Case 1 write-up shared. App shell runs.

### Phase 1: Core loop on case 1

| **Spandan** | **Kaushik** | **Nakul** |
|---|---|---|
| S4 compiler; S5 router; S6 composer; S7 dispatcher; S8 sandbox adapter; S10 cached run for case 1 | K5 seed inputs; K6 sample replies; K7 Handoff Brief samples; K9 review Gemma output for case 1 | N2 Review; N3 Plan; N4 Drafts; N5 Tracker; N8 consoles for ShopMart and SwiftCourier; N7 role switcher |

**Checkpoint 1:** case 1 runs from submit to filed on live API with sandbox organizations.

### Phase 2: Case 1 complete, cases 2 and 3 on sandboxes

| **Spandan** | **Kaushik** | **Nakul** |
|---|---|---|
| S9 email adapter with Mailpit and PDF; S11 status mapping and webhooks; cached runs for cases 2 and 3 | K2 and K3 write-ups; K4 remaining Org Profile content; K10 first draft of demo script | N6 Timeline and Resolved; N9 handover animation; N10 integration; consoles for PayEasy, Northfield Bank, utility, insurer |

**Checkpoint 2:** all three cases complete end to end on sandboxes, with cached AI.

### Phase 3: Real open-source integrations and extras

| **Spandan** | **Kaushik** | **Nakul** |
|---|---|---|
| S12 Zammad; S13 Open311 and FixMyStreet; S14 SLA and escalation; S15 answer relay; S16 Docker Compose | K12 first-user testing on a phone; log and rank bugs; K15 photo list | N11 Inbox and Escalation; N12 QR and Passage Link; N13 badge; N14 bug fixing |

**Checkpoint 3:** case 2 shows a real Zammad ticket; case 3 shows a real Open311 request. If not working, fall back to sandbox and note it.

### Phase 4: Polish and rehearse

| **Spandan** | **Kaushik** | **Nakul** |
|---|---|---|
| S17 licenses and proof; test model failure and cached fallback; keep services running | K13 backup video; K14 submission text; K11 Q&A cards; finalize script | Apply final copy; spacing and motion polish; fix remaining bugs |

**Checkpoint 4:** two full rehearsals of the three-minute demo. Backup video recorded.

## 7. Interfaces between people

| **From** | **To** | **What** | **Format** |
|---|---|---|---|
| Kaushik | Spandan | Case write-ups, Org Profile content, sample replies, Handoff Brief samples | Plain text files, then reviewed together |
| Kaushik | Nakul | Screen copy, photo list | Plain text file per screen |
| Spandan | Nakul | API contract with example requests and responses, example Passage and draft JSON | Files in protocol/examples/ |
| Spandan | Kaushik | Gemma outputs for review | Saved output files |
| Nakul | Spandan | Frontend dependency list; API issues found during integration | progress.md note or message |
| Nakul | Kaushik | A runnable build for testing | Link or run steps |
| Kaushik | Nakul and Spandan | Ranked bug list | progress.md, top issues first |

## 8. Working rules

- Nakul and Spandan do not edit each other's folders. Send the change as a message.
- Kaushik does not need to touch code. Content goes in as text files or messages; Spandan and Nakul place it.
- Commit small and often. Merge at every checkpoint, not at the end.
- After each finished step, update progress.md. When a decision changes, update activeContext.md.
- Anything that changes the API or the schemas goes through Spandan and is announced to the others before it is merged.
- Anything that changes what is shown to the user or what an organization receives goes through Kaushik first.
- No real brands, no real personal data, no proprietary LLM call, anywhere. Demo organizations are fictional and labeled.

## 9. Definition of done

A feature is done only when all of these are true:

1. It works on a phone-sized screen (390px) and on a laptop.
2. It works offline using cached AI output.
3. Kaushik has run it as a first-time user and it makes sense without explanation.
4. Any new dependency is listed with its license.
5. progress.md is updated.

### Cut order if time runs out

Cut in this order: assisted manual channel, voice input, Inbox, escalation, Open311 and FixMyStreet, Zammad, case 3 extras. Never cut: case 1 end to end on sandboxes, the Drafts screen (consent gate), the handover animation, the cached AI fallback, the backup video.

## 10. Assignment table (edit any time)

| **Stream** | **Person** | **Backup** | **Notes** |
|---|---|---|---|
| A: Design and frontend, integration, bug fixing | Nakul | Spandan | Spandan covers integration bugs |
| B: Backend, AI, adapters, infrastructure | Spandan | Nakul | Nakul covers sandbox console logic |
| C: Story, demo cases, content, testing | Kaushik | Spandan | Spandan covers prompt tuning; Nakul places copy |

To switch roles: update this table, tell the others, and have the outgoing person add a note to progress.md describing what is done and what is half done.

## 11. Presenting

| **Part** | **Suggested** | **Length** |
|---|---|---|
| Problem story: "I had one problem and I told it three times" | Kaushik | 30 s |
| Live demo: submit, confirm, plan, approve, track, resolve | Nakul | 90 s |
| Flash of cases 2 and 3, real Zammad ticket and Open311 request | Nakul drives, Spandan narrates | 30 s |
| Open-source AI and architecture: Gemma locally, schema, Org Profile registry, hash chain | Spandan | 45 s |
| Business, close and the final statement | Kaushik | 30 s |

Swap freely. Every person should be able to run the full demo on their own.
