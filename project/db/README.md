# project/db

Mirror copies of SQL used by the app for convenience.

**Source of truth:**
- Schema: `database/schema-or-migrations/001_schema.sql`
- Seed: `database/seed-data/001_seed.sql`

Keep these files in sync when changing schema or seed data. Prefer running the `database/` paths when setting up locally (see `database/setup-notes.md`).
