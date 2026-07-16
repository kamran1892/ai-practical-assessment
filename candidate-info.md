# Candidate Information

Name: Mohd Kamran
Role: Senior Software Engineer
Primary Technology Stack: React, Node.js, MySQL

Primary AI Tool Used: Cursor
Project Option Selected: Support Ticket Management System (Core only)

Assessment Start Date: July 16 2026
Submission Date: July 21 2026

## Project Summary
A small application for managing support tickets. Internal users create, update, comment on, search, and progress tickets through a defined lifecycle.

## Tools Used

- Cursor
- MySQL (local)

## Setup Summary

**Prerequisites:** Node.js, npm, MySQL running locally.

**Where the app lives:**
- Frontend → `project/frontend`
- Backend → `project/backend`
- DB scripts → `database/` (schema/migrations, seed) and `project/db`

**Local run order (once implementation is done):**
1. Start MySQL locally.
2. Create the database and run schema/migration scripts from `database/schema-or-migrations` (see `database/setup-notes.md`).
3. Load seed data from `database/seed-data` (seeded users + sample tickets/comments).
4. Copy backend `.env.example` to `.env` and set MySQL credentials
5. Install and start backend from `project/backend`.
6. Install and start frontend from `project/frontend`.
7. Open the frontend URL in the browser and exercise Core flows (list/create/detail, status change, comments, search/filter).
8. Run state-machine integration tests from the backend/tests location documented in `README.md` / `test-results.md`.
