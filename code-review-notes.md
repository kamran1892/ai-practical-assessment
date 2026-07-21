# Code Review Notes

## AI-Assisted Review Summary

Reviewed Core backend/frontend with focus on:
- status state machine
- validation
- error handling
- messy / drift-prone files

Used Cursor to walk key modules (`statusTransition.js`, validators, ticket service/queries, error middleware, detail page, API client).

## My Review Observations

### State machine — good

- Rules live in one place: `project/backend/src/domain/statusTransition.js`
- Create/update field endpoints reject `status` in the body
- Status changes only via `PATCH /api/tickets/:id/status`
- Integration tests cover all valid + many invalid transitions

### State machine — issues found

1. **Important:** Status update was `UPDATE ... WHERE id = ?` only. Two requests could race; the second might overwrite based on a stale read.
2. **Minor:** Frontend `constants.js` duplicates allowed next statuses for buttons. Backend remains source of truth; UI can drift if someone edits only one side.

### Validation — good

- Create/update/comment validators check required fields, enums, positive ids
- Unknown users checked in the service layer
- Clear `{ message, errors? }` shape for the UI

### Validation — issues found

3. **Important:** Keyword search used raw `LIKE %q%`. Characters `%` / `_` in the query acted as wildcards, so search results could be surprising.
4. **Minor:** Create validator collects field errors; change-status validator fails on the first problem only. Fine for Core.

### Error handling — good

- `AppError` + central `errorHandler`
- Invalid transitions return `400` with an actionable message
- Frontend shows API/network errors; status errors stay under the status section

### Error handling — issues found

5. **Important:** Bad JSON bodies from `express.json()` could surface as a generic `500` instead of a clear `400`.
6. **Minor:** `500` responses hide internal details (good for clients); rely on server logs.

### Messy / maintenance notes (not all fixed)

7. SQL mirrored in `database/` and `project/db/` — easy to edit one and forget the other.
8. `TicketDetailPage.jsx` is a bit large (fields + status + comments in one file) — acceptable for Core size.
9. List page refetches on every keystroke; cancel flag avoids stale overwrite — OK for Core, could debounce later.
10. Jest may warn about open handles after pool close — tests still pass.

## Changes Made After Review

See `review-fixes.md` (only important items applied).

## Suggestions Rejected (and why)

| Suggestion | Why rejected |
| --- | --- |
| Shared npm package for status constants FE+BE | Overkill for Core; comment that backend is source of truth is enough |
| Debounce search / split detail page into components | Nice polish, not required for acceptance |
| Soft-delete / auth / transactions everywhere | Stretch / out of scope |
| Full unit suite beyond state-machine integration | Core asks for integration tests; already green |
