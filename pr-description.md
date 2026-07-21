# PR Description

## Summary

Core Support Ticket Management System: React UI + Express API + local MySQL. Users can create/list/view/update tickets, search/filter, add comments, and change status only through a fixed state machine. Stretch features (auth, user admin, pagination, Swagger, Docker, CI) are out of scope.

## Features Implemented

- Create ticket (always starts **Open**)
- List tickets with keyword search + status filter
- Ticket detail with comments
- Update title, description, priority, assignee
- Status transitions via dedicated endpoint + `statusTransition` module
- Seeded users for creator / assignee / comment author (no login)
- Backend validation and clear UI error banners
- State-machine integration tests (Jest + Supertest)

## Technical Changes

- Backend: Express layers (routes → controllers → services → SQL queries)
- Domain module: `src/domain/statusTransition.js` (single source of transition rules)
- Frontend: Vite + React Router — list / create / detail pages
- Env-based config (`.env.example` only in git)

## Database Changes

- Schema: `users`, `tickets`, `comments` (`database/schema-or-migrations/001_schema.sql`)
- Seed: sample users, tickets in mixed statuses, comments (`database/seed-data/001_seed.sql`)
- Mirror copies under `project/db/`

## Testing Done

- Manual Core checklist in `README.md`
- Automated: `cd project/backend && npm test` — 25 passing (see `test-results.md`)
- Health checks: `/health`, `/health/db`

## AI Usage Summary

- Primary tool: **Cursor**
- Used across requirements, design, implementation, tests, review, and docs
- Prompt history under `ai-prompts/`
- Human review kept Core scope, rejected Stretch, and applied targeted review fixes

## Screenshots / Demo Notes

Local demo:

1. MySQL schema + seed
2. `project/backend` → `npm run dev` (port 3001)
3. `project/frontend` → `npm run dev` (port 5173)
4. Exercise list → create → detail → status → comments → search/filter

## Known Limitations

- No authentication (by Core design)
- UI status buttons mirror backend rules (can drift if edited separately)
- Keyword search is simple `LIKE`, not full-text
- Jest may log open-handle / force-exit noise; suite still passes

## Future Improvements

- Auth / roles (Stretch)
- Shared constants package for FE+BE status maps
- Debounced search; split large detail page
- CI pipeline running `npm test`
