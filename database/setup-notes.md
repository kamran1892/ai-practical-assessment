# Database Setup Notes

## Choice

MySQL (local)

Database name: `support_tickets`

## Prerequisites

- MySQL Server installed and running locally
- `mysql` client available in your PATH
- A MySQL user that can create databases and tables (often `root` on local)

## Files

| Purpose | Path (source of truth) | Mirror |
| --- | --- | --- |
| Schema | `database/schema-or-migrations/001_schema.sql` | `project/db/001_schema.sql` |
| Seed | `database/seed-data/001_seed.sql` | `project/db/001_seed.sql` |

Schema creates the database + `users` / `tickets` / `comments` (drops those tables if they already exist).  
Seed truncates those tables and loads sample data.

## Environment (backend — later)

When you start the Node backend, copy:

`project/backend/.env.example` → `project/backend/.env`

```env
PORT=3001

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password_here
DB_NAME=support_tickets
```

Never commit real passwords. Keep `.env` gitignored.

## Exact steps — create DB and load seed

Run these from the repo root: `ai-practical-assessment/`.

### 1. Start MySQL

```bash
# Example on Linux (adjust for your install)
sudo systemctl start mysql
# or: sudo service mysql start
```

Confirm you can connect:

```bash
mysql -u root -p -e "SELECT VERSION();"
```

### 2. Apply schema (creates DB + tables)

```bash
mysql -u root -p < database/schema-or-migrations/001_schema.sql
```

### 3. Load seed data

```bash
mysql -u root -p < database/seed-data/001_seed.sql
```

### 4. Verify

```bash
mysql -u root -p -e "
USE support_tickets;
SELECT COUNT(*) AS users FROM users;
SELECT id, title, status, assigned_to FROM tickets;
SELECT id, ticket_id, LEFT(message, 40) AS message FROM comments;
"
```

Expected roughly:
- **4 users**
- **6 tickets** (statuses: Open, In Progress, Resolved, Closed, Cancelled, plus another Open unassigned)
- **6 comments**

## Re-run / reset

To wipe tables and reload seed:

```bash
mysql -u root -p < database/schema-or-migrations/001_schema.sql
mysql -u root -p < database/seed-data/001_seed.sql
```

Or seed only (keeps schema, replaces data):

```bash
mysql -u root -p < database/seed-data/001_seed.sql
```

## Seed summary

| Table | Contents |
| --- | --- |
| `users` | Alice (requester), Bob (agent), Carol (admin), Dave (agent) |
| `tickets` | Open ×2 (one unassigned), In Progress, Resolved, Closed, Cancelled |
| `comments` | Comments on tickets 1, 2, 3, 4 |

## Next — start backend (scaffold)

```bash
cd project/backend
cp .env.example .env
# edit .env — set DB_PASSWORD (and DB_USER if needed)

npm install
npm run dev
```

Verify:

```bash
curl http://localhost:3001/health
curl http://localhost:3001/health/db
```

Expect JSON `"status":"ok"`. Startup log should say `MySQL connected`. Then continue with ticket APIs / frontend.
