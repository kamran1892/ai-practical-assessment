# Support Ticket Management System

AI Capability Exercise — Full-stack mini project (**Core only**).

## Stack

- Frontend: React (Vite) — `project/frontend`
- Backend: Node.js + Express — `project/backend`
- Database: MySQL (local) — `support_tickets`

## Prerequisites

- Node.js 18+ (20.x recommended) and npm
- MySQL Server running locally
- `mysql` client in PATH

## Quick start (exact order)

Run all commands from the repo root: `ai-practical-assessment/`.

### 1. MySQL — create DB, tables, seed

```bash
# Start MySQL (Linux example)
sudo systemctl start mysql

# Schema (creates database support_tickets + tables)
mysql -u root -p < database/schema-or-migrations/001_schema.sql

# Seed (users, sample tickets, comments)
mysql -u root -p < database/seed-data/001_seed.sql
```

Verify:

```bash
mysql -u root -p -e "
USE support_tickets;
SELECT COUNT(*) AS users FROM users;
SELECT id, title, status FROM tickets;
"
```

Expect ~4 users and 6 tickets. More detail: `database/setup-notes.md`.

### 2. Backend

```bash
cd project/backend
cp .env.example .env
# Edit .env — set DB_PASSWORD (and DB_USER if needed)

npm install
npm run dev
```

Backend listens on **http://localhost:3001** by default.

Health checks:

```bash
curl http://localhost:3001/health
curl http://localhost:3001/health/db
```

Both should return `"status":"ok"`.

### 3. Frontend

```bash
cd project/frontend
cp .env.example .env
# Default is fine if backend is on port 3001:
# VITE_API_BASE_URL=http://localhost:3001

npm install
npm run dev
```

Open the URL Vite prints (usually **http://localhost:5173**).

**Env note:** Vite only exposes variables prefixed with `VITE_`. Restart `npm run dev` after changing `.env`.

### 4. Do not commit secrets

- Real credentials live in `project/backend/.env` and optionally `project/frontend/.env`
- Those files are gitignored
- Only `.env.example` files (placeholders) are committed

## API overview

Base: `http://localhost:3001/api`

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/users` | Seeded users (dropdowns) |
| `GET` | `/tickets?q=&status=` | List + search + status filter |
| `POST` | `/tickets` | Create (always **Open**) |
| `GET` | `/tickets/:id` | Detail + comments |
| `PATCH` | `/tickets/:id` | Update fields (not status) |
| `PATCH` | `/tickets/:id/status` | Status transition |
| `GET` | `/tickets/:id/comments` | List comments |
| `POST` | `/tickets/:id/comments` | Add comment |

Full contract: `api-contract.md`.

## Manual test checklist (Core)

Use this once after both servers are up. Tick off as you go.

### Happy path (UI)

- [ ] Seeded tickets appear on **All tickets**
- [ ] Open a ticket → detail shows fields, status, assignee/creator, comments
- [ ] **New ticket** → fill form → create → status is **Open** → appears in list after going back
- [ ] On detail → change title/description/priority/assignee → **Save fields** → refresh page → changes still there
- [ ] Add a comment (message + author) → appears on detail → refresh → still there
- [ ] Search keyword (e.g. `login`) → matching tickets only
- [ ] Filter by status (e.g. Open) → list narrows; combine with search
- [ ] Valid status path: Open → In Progress → Resolved → Closed (use buttons)
- [ ] Cancel path: Open → Cancelled **or** In Progress → Cancelled

### Errors / validation

- [ ] Create with empty title → clear error (banner / API message)
- [ ] Invalid status: UI only offers allowed next statuses; if API rejects a bad transition, red error under **Change status** and status stays unchanged
- [ ] Open a missing id (e.g. `/tickets/99999`) → not-found message, not a blank crash
- [ ] Stop backend → reload list → usable “could not reach API” style message

### Persistence

- [ ] Create a ticket/comment → stop backend (`Ctrl+C`) → start again → refresh UI → data still present

### Secrets / docs

- [ ] Confirm `.env` is not staged for commit (`git status`); only `.env.example` in repo

### Automated tests (state machine)

```bash
cd project/backend
npm test
```

See `test-strategy.md` and latest output in `test-results.md`.

- [x] State-machine integration tests (valid + invalid transitions)
- [x] Document test command + record run in `test-results.md`

## Repository layout (main paths)

```
ai-practical-assessment/
  README.md
  acceptance-criteria.md
  api-contract.md
  data-model.md
  database/
    schema-or-migrations/001_schema.sql
    seed-data/001_seed.sql
    setup-notes.md
  project/
    backend/          # Express API
    frontend/         # React (Vite)
    db/               # Mirror of SQL files
  ai-prompts/
  tool-specific/cursor-workflow/
```

## Core features

- Create / list / view / update tickets
- Status transitions via enforced state machine (`src/domain/statusTransition.js`)
- Comments on tickets
- Keyword search + status filter
- Seeded users (no user-management UI / no auth)
- Backend validation + clear UI errors

## Stretch

Not in scope for this submission (auth, user CRUD UI, pagination, Swagger, Docker, CI, extra test tiers).
