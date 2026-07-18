# Implementation Plan

## Overview

Build **Core only** Support Ticket Management System: React + Node.js + MySQL.

Design docs are largely done (`requirements-analysis`, `acceptance-criteria`, `data-model`, `api-contract`, `design-notes`, `ui-flow`). Next: implement in this order:

**DB → Backend → Frontend → Tests → Docs**

Skip Stretch (auth, user CRUD UI, pagination, Swagger, Docker, CI, extra test tiers).

---

## Milestones

| Milestone | Focus | Done when |
| --- | --- | --- |
| **M1 — DB** | Schema + seed | MySQL has `users` / `tickets` / `comments`; seed data loads; notes in `database/setup-notes.md` |
| **M2 — Backend** | APIs + state machine | All endpoints in `api-contract.md` work via HTTP; invalid transitions return `400` |
| **M3 — Frontend** | 3 screens wired | List / create / detail work against real API; errors visible (incl. invalid status) |
| **M4 — Tests** | State-machine integration | Valid transitions pass; invalid rejected; command + results recorded |
| **M5 — Docs** | Submission polish | README, prompt history, review/reflection/PR artifacts complete; no secrets in git |

---

## Task Breakdown

### Already done (planning / design)

- [x] Candidate info, requirements, acceptance criteria (with coverage tags)
- [x] Data model, API contract, UI flow, design notes
- [ ] Finish any open data-model decisions if still pending (ENUM, nullable assignee, etc.)

---

### M1 — Database

1. Create DB name (e.g. `support_tickets`) on local MySQL.
2. Write schema SQL under `database/schema-or-migrations/`:
   - `users`, `tickets`, `comments`
   - ENUMs, FKs, indexes (per `data-model.md`)
3. Write seed SQL under `database/seed-data/`:
   - Several users (mixed roles)
   - Sample tickets in different statuses
   - A few comments
4. Document exact run steps in `database/setup-notes.md`.
5. Verify manually: tables exist, seed rows visible in MySQL client.

**Exit check:** Fresh machine instructions work: create DB → run schema → run seed.

---

### M2 — Backend

1. Scaffold `project/backend` (Express + `mysql2` + `dotenv` + scripts).
2. Add `.env.example` (placeholders only); gitignore real `.env`.
3. Wire MySQL pool (`config/db.js`).
4. Add shared error middleware + consistent `{ message }` errors.
5. Implement `domain/statusTransition.js` (allowed map + assert).
6. Implement validators (ticket create/update, status, comment).
7. Implement endpoints in order:
   1. `GET /api/users`
   2. `POST /api/tickets` (force status `Open`)
   3. `GET /api/tickets` (`q` + `status`)
   4. `GET /api/tickets/:id` (with comments)
   5. `PATCH /api/tickets/:id` (fields only)
   6. `PATCH /api/tickets/:id/status`
   7. `POST /api/tickets/:id/comments`
8. Smoke-test with curl/Postman against seeded DB.
9. Confirm restart: create a ticket → restart server → ticket still there.

**Exit check:** Every row in `api-contract.md` endpoint summary works; illegal status returns clear `400`.

---

### M3 — Frontend

1. Scaffold `project/frontend` (React + React Router).
2. Add `api/` client (base URL, parse error `message`).
3. **TicketListPage** — search, status filter, list, links.
4. **CreateTicketPage** — form + user dropdowns; redirect after create.
5. **TicketDetailPage** — fields, edit/save, status actions, comments.
6. Shared `ErrorMessage` / banners for `400` / `404` / network.
7. Invalid status UX: keep current status; show backend message (per `ui-flow.md`).
8. End-to-end manual pass against acceptance Core checkboxes (UI ones).

**Exit check:** Can create → list → detail → update → comment → search/filter → valid status change; invalid status shows error.

---

### M4 — Tests

1. Add test runner for backend (e.g. Jest/Vitest + Supertest, or agreed stack).
2. Integration tests for **all valid** status transitions.
3. Integration tests for **representative invalid** transitions (skip, reverse, terminal, same-status).
4. Document test command in README and/or `test-strategy.md`.
5. Run suite; paste latest result into `test-results.md`.

**Exit check:** State-machine integration suite green; command reproducible from docs.

---

### M5 — Docs & submission artifacts

1. Complete root `README.md` setup (MySQL, backend, frontend, env, test command).
2. Finish/update `database/setup-notes.md` if anything drifted.
3. Keep `ai-prompts/` filled as you go (planning, design, implementation, testing, debugging, review).
4. Fill Cursor workflow files under `tool-specific/cursor-workflow/` if still stubs.
5. After a review pass: `code-review-notes.md`, `review-fixes.md`, `debugging-notes.md` (as needed).
6. Write `pr-description.md`, `reflection.md`, `final-ai-usage-summary.md`.
7. Confirm `.env` not committed; `.env.example` only placeholders.
8. Tick verified items in `acceptance-criteria.md`.

**Exit check:** Someone else can clone → follow README → run Core demo + tests.

---

## Suggested build order (day-to-day)

```
M1 schema/seed
  → M2 status module + users + tickets CRUD + status + comments
  → M3 list → create → detail (errors last polish)
  → M4 integration tests
  → M5 docs / reflection / PR text
```

Do not start frontend until create/list/get/status APIs exist (detail can follow quickly after).

---

## AI Usage Plan (Cursor)

| Milestone | Use Cursor for | I still own |
| --- | --- | --- |
| M1 | Draft schema/seed SQL from `data-model.md` | Run on MySQL; fix types/FK mistakes |
| M2 | Scaffold layers; generate validators/routes from `api-contract.md` | State-machine correctness; smoke tests |
| M3 | Page/component boilerplate from `ui-flow.md` | UX of errors; wire real API fields |
| M4 | Generate transition test cases from allowed table | Confirm tests hit real DB/API path |
| M5 | Draft README / PR / reflection from artifacts | Honest AI usage notes; final checklist |

**Habits:** attach the relevant markdown (`@api-contract.md`, etc.); log prompts under `ai-prompts/`; reject Stretch suggestions; never paste real DB passwords into chat/commits.

---

## Risks

| Risk | Impact |
| --- | --- |
| Status rules drift between UI, service, and tests | Invalid transitions slip through or UI lies |
| MySQL ENUM / spacing (`In Progress`) mismatch with API strings | Subtle 400s or insert failures |
| Frontend built before APIs stabilize | Rework on field names and error shape |
| Shallow tests that only unit-test the map, not HTTP+DB | Misses acceptance “integration tests” |
| Scope creep into auth/Swagger/pagination | Less time for docs and prompt history |
| Secrets committed (`.env`) | Assessment hygiene fail |

---

## Mitigation

| Risk | Mitigation |
| --- | --- |
| Status drift | Single module `statusTransition.js`; UI offers only allowed next; tests call status API |
| ENUM strings | One shared constant list in backend; match `api-contract.md` exactly |
| API churn | Freeze contract before frontend; change docs + API together |
| Weak tests | Supertest (or equivalent) against running app/test DB for transitions |
| Scope creep | Core checklist only; Stretch explicitly skipped |
| Secrets | `.gitignore` + `.env.example` first in M2; never commit real credentials |

---

## Out of scope (do not schedule)

- Authentication / JWT
- User management UI
- Priority/assignee filters, sorting, pagination
- Swagger, Docker, CI
- Extra unit/component test tiers beyond state-machine integration tests
