# Test Strategy

## Test Scope

Core focus: **integration tests for the ticket status state machine**.

Location: `project/backend/tests/statusTransition.integration.test.js`

Stack: **Jest + Supertest** against the Express app with the real local MySQL database (same env as the backend).

## Unit Tests

Not required for Core. Transition rules are also asserted lightly via the shared `ALLOWED_TRANSITIONS` map in the integration file. Optional pure unit tests of `statusTransition.js` can be added later (Stretch).

## Component Tests

Optional / Stretch — skip for Core.

## API / Integration Tests

### Valid transitions (must all succeed → HTTP 200, status persisted)

| From | To |
| --- | --- |
| Open | In Progress |
| Open | Cancelled |
| In Progress | Resolved |
| In Progress | Cancelled |
| Resolved | Closed |

Each case creates a ticket, moves it to the `from` status using only valid steps, then applies `to` via `PATCH /api/tickets/:id/status`, and re-reads the ticket to confirm MySQL persistence.

### Invalid transitions (must be rejected → HTTP 400, status unchanged)

Representative illegal moves from every status, including:

- Skipping steps (e.g. Open → Resolved, In Progress → Closed)
- Moving backward (e.g. Resolved → Open)
- Same status again (e.g. Open → Open)
- Leaving terminal states (Closed / Cancelled → anything)
- Unknown status string (`Done`)
- Missing ticket → `404`

## Edge Case Tests

Covered above for Core. Not covered (intentional):

- Concurrent double-clicks / race conditions
- Frontend-only tests

## Tests Not Covered (and why)

- Auth / JWT — Stretch / out of scope
- Full CRUD validation suite — exercised manually; Core mandate is state machine
- React component tests — Stretch
- Pagination / sorting filters — Stretch

## How to run

Prerequisites: MySQL up, schema + seed applied, `project/backend/.env` configured.

```bash
cd project/backend
npm install
npm test
```

Record the latest run in `test-results.md`.
