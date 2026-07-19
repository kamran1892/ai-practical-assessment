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
