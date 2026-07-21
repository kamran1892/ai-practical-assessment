# AI Prompts — Implementation

For each prompt, capture:

- Prompt text (or short summary)
- AI response summary
- What I accepted
- What I changed
- What I rejected (and why)

---

## Prompt 1

**Prompt:**
ok the design looks fine to me, now create mysql schema/migration files and seed data.
put schema under database/schema-or-migrations and also keep a copy path under project/db if needed. seed under database/seed-data. seed at least 3 users, few tickets in different statuses, and some comments.
update database/setup-notes.md with exact steps for local mysql. use .env.example style, no real password in repo.
after that tell me the commands i should run on my machine to create db and load seed.

**Response summary:**
Added `001_schema.sql` (users/tickets/comments + FKs/ENUMs) and `001_seed.sql` (4 users, 6 tickets across statuses, 6 comments). Mirrored under `project/db/`. Updated `database/setup-notes.md` with exact mysql commands. Added `project/backend/.env.example` with password placeholder only.

**Accepted:**
Yes

**Changed:**
No

**Rejected / why:**
No

---

## Prompt 2

**Prompt:**
now scaffold the backend in project/backend. stack preference: node + express (or nest if you feel its simpler, but prefer express unless strong reason).
connect to mysql using env vars. create basic folder structure as we discussed in LLD. health check routes.
dont build all ticket apis yet. first make sure server starts and db connection works. tell me how to verify.

**Response summary:**
Scaffolded Express app with config/db pool, /health + /health/db, error middleware, and empty domain/controllers/services/validators/tests folders. Server pings MySQL on startup. Kept .env.example password as placeholder only.

**Accepted:**
Yes
**Changed:**
No
**Rejected / why:**
No
---

## Prompt 3

**Prompt:**
implement ticket APIs create/list/get/update with validation, keyword search + status filter; no status change yet (state machine later, one place only).

**Response summary:**
Implemented GET/POST /api/tickets, GET/PATCH /api/tickets/:id with validators, service, queries. Create forces Open; PATCH rejects status field. List supports q + status. No statusTransition module yet. Smoke-tested against local MySQL.

**Accepted:**

**Changed:**

**Rejected / why:**

---

## Prompt 4

**Prompt:**
now implement ticket status change with this state machine only:
Open -> In Progress
In Progress -> Resolved
Resolved -> Closed
Open -> Cancelled
In Progress -> Cancelled
any other transition should fail with proper error.
put transition rules in one module/service so its easy to test. also add comments api: add comment and list comments for a ticket.

**Response summary:**
Added domain/statusTransition.js as sole transition rules. PATCH /api/tickets/:id/status uses assertCanTransition. GET/POST /api/tickets/:id/comments for list/add. Updated api-contract summary.

**Accepted:**

**Changed:**

**Rejected / why:**

---

## Prompt 5

**Prompt:**
scaffold frontend in project/frontend with react.
need:
- ticket list with search box and status filter
- create ticket form
- ticket detail page where i can update fields, change status, and add comments
show backend errors properly on UI, especially invalid status transition.
keep UI simple, no fancy design. just usable. also tell me how to point frontend to backend url using env.

**Response summary:**
Vite+React+Router app in project/frontend. Added GET /api/users for dropdowns. Pages for list/create/detail; ErrorMessage shows API message; status section keeps current status and shows statusError for failed transitions. VITE_API_BASE_URL in .env.example.

**Accepted:**

**Changed:**

**Rejected / why:**

---

## Prompt 6

**Prompt:**
update README.md with exact setup steps for mysql, backend, frontend.
also give me a short manual test checklist for Core acceptance criteria so i can click through once.
if anything is missing we an start for tests.

**Response summary:**
Filled README with exact MySQL/backend/frontend steps, env notes, API table, and click-through Core checklist. Noted state-machine integration tests still to do. Reset backend .env.example password placeholder.

**Accepted:**
Yes
**Changed:**
No
**Rejected / why:**
No