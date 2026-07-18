# Acceptance Criteria

Scope: **Support Ticket Management System — Core only** (Stretch out of scope).

How to use: leave boxes unchecked until verified during build/test. Each item should be demonstrable from UI and/or API/tests.

Coverage tags: **Frontend** | **Backend** | **DB** | **Tests** | **Docs**

## Core

- [ ] A user can create a ticket via the UI — **Frontend + Backend + DB**
  - New ticket is saved in MySQL and appears in the list — **Backend + DB** (Frontend shows list)
  - New ticket starts in status **Open** — **Backend**
- [ ] A user can view all tickets from the database — **Frontend + Backend + DB**
  - List is loaded from MySQL (not mock/in-memory only) — **Backend + DB**
  - Seeded tickets are visible after setup — **DB** (Frontend displays)
- [ ] A user can open a ticket detail view — **Frontend + Backend + DB**
  - Detail shows title, description, priority, status, assignee, creator, timestamps — **Frontend + Backend + DB**
  - Comments for that ticket are visible — **Frontend + Backend + DB**
- [ ] A user can update ticket fields (title, description, priority, assignee) — **Frontend + Backend + DB**
  - Changes persist after refresh/restart — **Backend + DB**
- [ ] A user can add comments — **Frontend + Backend + DB**
  - Comment requires message + author (seeded user) — **Backend** (Frontend form; DB FK)
  - Comment appears on ticket detail and persists — **Frontend + Backend + DB**
- [ ] Status changes only through valid transitions; invalid ones are rejected — **Frontend + Backend + DB + Tests**
  - Allowed:
    - Open → In Progress
    - In Progress → Resolved
    - Resolved → Closed
    - Open → Cancelled
    - In Progress → Cancelled
  - Any other transition fails on backend and shows a clear UI error — **Backend** (reject) + **Frontend** (error UI); proven by **Tests**
- [ ] Keyword search and status filter work — **Frontend + Backend + DB**
  - Keyword matches title and/or description — **Backend + DB**
  - Status filter narrows the list to the selected status — **Backend + DB**
  - Can be used together — **Backend + DB** (Frontend sends both)
- [ ] Data remains available after restart — **DB** (+ Backend restart-safe; Frontend refresh)
  - Stop/start backend (and refresh UI); tickets and comments still present — **DB**
- [ ] Backend validation prevents invalid records — **Backend** (+ DB constraints/FKs)
  - See Validation section below
- [ ] No secrets committed to the repo — **Docs** / repo hygiene
  - `.env` with real credentials is gitignored — **Docs** / repo hygiene
  - `.env.example` has placeholders only — **Docs** / repo hygiene
- [ ] State-machine integration tests pass — **Tests** (+ Backend under test; DB for test data)
  - See Testing section below

## Validation

- [ ] Required fields enforced on backend for create ticket (e.g. title, description, priority, createdBy; assignee as decided in API contract) — **Backend** (+ DB NOT NULL/FKs)
- [ ] Required fields enforced for update ticket (invalid/empty values rejected) — **Backend**
- [ ] Comment message and createdBy required — **Backend** (+ DB)
- [ ] Unknown ticket id → not found (404) — **Backend** (Frontend shows not-found)
- [ ] Unknown user id for assignee/createdBy → validation error — **Backend** (+ DB FK)
- [ ] Invalid priority or status value → validation error — **Backend**
- [ ] Invalid input rejected with clear messages (usable by UI) — **Backend** (Frontend displays)

## Error Handling

- [ ] Backend returns meaningful errors for validation failures (400) — **Backend**
- [ ] Backend returns meaningful errors for invalid status transitions (400) — **Backend** (+ **Tests**)
- [ ] Backend returns not found for missing tickets (404) — **Backend**
- [ ] Frontend shows meaningful error states for the above (not silent failure / blank crash) — **Frontend**
- [ ] Frontend shows a usable message if API/network fails — **Frontend**

## Testing

- [ ] Integration tests prove **all valid** status transitions succeed — **Tests** (+ Backend + DB)
- [ ] Integration tests prove **invalid** status transitions are rejected — **Tests** (+ Backend + DB)
- [ ] Test command is documented (README and/or `test-results.md`) — **Docs**
- [ ] Latest run recorded in `test-results.md` — **Docs**

## Documentation

- [ ] `README.md` has setup instructions (MySQL, backend, frontend) — **Docs**
- [ ] Database setup / migrations / seed documented (`database/setup-notes.md`) — **Docs**
- [ ] Prompt history present under `ai-prompts/` — **Docs**
- [ ] Lifecycle artifacts present (requirements, design, review, reflection, PR description, etc.) — **Docs**
- [ ] Cursor workflow files present under `tool-specific/cursor-workflow/` — **Docs**

## Explicitly out of scope (Stretch — not acceptance for this submission)

- Authentication / JWT / protected routes
- User management CRUD UI
- Filter by priority/assignee, sorting, pagination
- Swagger/OpenAPI, Docker, CI
- Extra unit/component test tiers beyond Core state-machine integration tests
