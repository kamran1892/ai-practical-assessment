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
