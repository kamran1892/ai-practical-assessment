# Design Notes

## What LLD makes sense (and what doesn’t)

For this Core assessment we want **clean layers**, not enterprise patterns.

| Concept | Use? | Why |
| --- | --- | --- |
| Routes / Controllers | **Yes** | HTTP in/out only: parse request, call service, return status/JSON |
| Services | **Yes** | Business rules live here (create/update, comments, search) |
| Status state machine (small module) | **Yes** | Core rule of the project; keep pure/testable; used by ticket service |
| Thin DB access (`db` + queries) | **Yes** | One place for SQL / MySQL pool |
| Full Repository interfaces / DI container | **No** | Overkill for 5–6 endpoints |
| Domain events, CQRS, microservices | **No** | Out of scope |
| Fat controllers with SQL inside | **No** | Hard to test state machine and validation |

**Rule of thumb:** three backend layers + one tiny status module. Stop there.

```
Request → Route/Controller → Service → DB
                    ↑
           statusTransition.js  (pure rules)
```

---

## Architecture Overview (frontend, backend, database)

```
┌─────────────────────┐     HTTP/JSON      ┌──────────────────────────┐
│  React frontend     │ ───────────────►   │  Node.js / Express API   │
│  pages + components │ ◄───────────────   │  controllers → services  │
└─────────────────────┘                    │  → db queries            │
                                           │  + statusTransition      │
                                           └────────────┬─────────────┘
                                                        │
                                                        ▼
                                              ┌──────────────────┐
                                              │  MySQL (local)   │
                                              │  users / tickets │
                                              │  / comments      │
                                              └──────────────────┘
```

- **No auth** in Core — UI calls API directly; creator/assignee/author chosen from seeded users.
- **Source of truth** for status rules: backend state-machine module (DB ENUM only blocks invalid *values*, not invalid *transitions*).
- Details of tables/columns: see `data-model.md`.
- Endpoint shapes: see `api-contract.md` (to be filled next).

---

## Backend Design

### Suggested folder layout

```
project/backend/
  src/
    app.js                 # Express app wiring
    server.js              # listen
    config/
      db.js                # MySQL pool from env
    routes/
      tickets.js
      users.js             # GET seeded users for dropdowns
      comments.js          # or nest under tickets
    controllers/
      ticketController.js
      userController.js
      commentController.js
    services/
      ticketService.js
      commentService.js
      userService.js
    domain/                # or lib/
      statusTransition.js  # allowed map + assertCanTransition()
    validators/
      ticketValidators.js
      commentValidators.js
    middleware/
      errorHandler.js
    db/
      queries/             # optional: SQL strings / small helpers
  tests/
    statusTransition.integration.test.js
  .env.example
```

### Layer responsibilities

1. **Controller** — read `req`, call service, send `res` (`200`/`201`/`400`/`404`). No SQL. No transition rules.
2. **Service** — orchestration + rules:
   - create ticket (force `status = Open`)
   - update fields
   - change status via `statusTransition`
   - list with search/filter
   - add comment
3. **`statusTransition` module** — pure functions only, e.g.:
   - `ALLOWED = { Open: ['In Progress', 'Cancelled'], ... }`
   - `canTransition(from, to)` / `assertCanTransition(from, to)` throws/returns error
   - Easy unit/integration testing without HTTP
4. **DB layer** — pool + queries (parameterized SQL). No need for a formal repository interface.

### Status change flow

```
PATCH/POST status
  → controller
  → ticketService.changeStatus(id, nextStatus)
      → load ticket from DB
      → assertCanTransition(current, next)   // domain module
      → update status + updated_at
  → return ticket or 400
```

Keep **field update** and **status change** as separate service methods (cleaner tests; matches requirements assumption).

---

## Frontend Design

### Pages (routes)

| Route | Page | Job |
| --- | --- | --- |
| `/` or `/tickets` | **TicketListPage** | Search, status filter, list, link to detail, link to create |
| `/tickets/new` | **CreateTicketPage** | Create form (title, description, priority, assignee, creator) |
| `/tickets/:id` | **TicketDetailPage** | View fields, edit fields, status actions, comments |

Three pages is enough. No login page. No user-admin page.

### Suggested folder layout

```
project/frontend/
  src/
    api/
      client.js            # fetch base URL, parse errors
      ticketsApi.js
      usersApi.js
    pages/
      TicketListPage.jsx
      CreateTicketPage.jsx
      TicketDetailPage.jsx
    components/
      TicketList.jsx
      TicketForm.jsx
      SearchFilterBar.jsx
      StatusActions.jsx    # buttons for allowed next statuses only (optional UX)
      CommentList.jsx
      CommentForm.jsx
      ErrorMessage.jsx     # shared error banner
    App.jsx
    main.jsx
```

### UX notes

- **List:** keyword input + status dropdown; results from API (not local-only filter of a mock).
- **Detail:** show all ticket fields + comments; edit form for title/description/priority/assignee.
- **Status:** either dropdown of allowed next statuses, or buttons; on `400`, show backend message via `ErrorMessage`.
- **Errors:** never silent — validation, invalid transition, 404, network failure all show a clear message.

---

## Database Design

See `data-model.md`.

Summary: `users`, `tickets`, `comments`; status/priority as ENUM; FKs from tickets/comments → users; comments → tickets.

---

## Validation Strategy

| Layer | What |
| --- | --- |
| Backend validators | Required fields, allowed priority/status strings, user ids exist |
| Status module | Transition legality only |
| DB | ENUM + FK + NOT NULL as last line of defence |
| Frontend | Basic required fields for UX; **backend remains source of truth** |

---

## Error Handling Strategy

| Case | Backend | Frontend |
| --- | --- | --- |
| Validation fail | `400` + `{ message, errors? }` | Show message on form/page |
| Invalid status transition | `400` + clear message | Show on detail page |
| Ticket not found | `404` | Not-found state |
| Server / DB down | `500` | Generic “something went wrong / API unavailable” |
| Network failure | — | Same usable message (not blank crash) |

Use one Express `errorHandler` middleware so controllers can `next(err)` with a small `AppError` (`statusCode`, `message`).

---

## Testing Strategy Link

See `test-strategy.md`.

Priority for Core: **integration tests** that hit the status-change path (valid transitions succeed, invalid rejected). The small `statusTransition` module makes those tests straightforward.
