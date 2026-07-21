# Review Fixes

## Fix 1 — Safe status update (no stale overwrite)

- File(s): `project/backend/src/db/queries/tickets.js`, `project/backend/src/services/ticketService.js`
- What was wrong: Status `UPDATE` only filtered by ticket id, so a concurrent/stale change could still write.
- What changed: Update is `WHERE id = ? AND status = <current>`; if `affectedRows = 0`, return `400` asking the client to refresh.
- Why: Protects the state machine under concurrent clicks / races.

## Fix 2 — Clear error for invalid JSON body

- File(s): `project/backend/src/middleware/errorHandler.js`
- What was wrong: Malformed JSON could look like a generic server failure.
- What changed: Detect `express.json` parse errors and return `400` with `Invalid JSON in request body`. Also honor `err.status` as well as `err.statusCode`.
- Why: Matches the “clear API errors” acceptance goal.

## Fix 3 — Literal keyword search (escape LIKE wildcards)

- File(s): `project/backend/src/db/queries/tickets.js`
- What was wrong: `%` or `_` in the search box changed LIKE behavior.
- What changed: Escape `\`, `%`, and `_` in `q` and use `ESCAPE '\'` in SQL.
- Why: Search should match what the user typed.

## Fix 4 — Document FE/BE status map ownership (comment only)

- File(s): `project/frontend/src/constants.js`
- What was wrong: Easy to think UI constants are the real rules.
- What changed: Clarified in a comment that backend `statusTransition.js` is the source of truth.
- Why: Small clarity fix; avoided a shared package for Core.
