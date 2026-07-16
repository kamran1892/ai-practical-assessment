# Database Setup Notes

## Choice

MySQL (local)

## Prerequisites

- MySQL server running locally
- A database user with create/migrate privileges

## Create database

```sql
-- fill during implementation
```

## Migrations / schema

Location: `database/schema-or-migrations/` (and/or `project/db/`)

## Seed data

Location: `database/seed-data/`

## Environment

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=
DB_PASSWORD=
DB_NAME=
```

Use `.env.example` in backend; never commit real passwords.

## How to run locally

1. Start MySQL
2. Run schema / migrations
3. Run seed
4. Start backend
5. Start frontend
