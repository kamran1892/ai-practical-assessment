# Requirement Analysis

## Selected Project Option

Support Ticket Management System

## My Understanding (in your own words)

We need a small support ticket app. User can create tickets, see the list, open a ticket, update basic fields, add comments, search/filter, and move the ticket through a fixed status flow.

Users are not managed from the UI. No login/auth for app.

The important part is the status state machine. Only these moves are allowed:

Open → In Progress
In Progress → Resolved
Resolved → Closed
Open → Cancelled
In Progress → Cancelled

Anything else should be rejected by the backend, and the UI should show a clear error. Backend must validate inputs that comes in the request. We also need integration testing.

## Functional Requirements

1. Create a ticket (title, description, priority, assignee, creator from seeded users).
2. New ticket always starts as **Open**.
3. List all tickets from MySQL.
4. Open ticket detail (fields + comments).
5. Update ticket fields (title, description, priority, assignee).
6. Change ticket status only via allowed transitions (see state machine).
7. Reject invalid status changes (backend error + clear UI message).
8. Add a comment to a ticket (message + author from seeded users).
9. Search tickets by keyword (title and/or description).
10. Filter ticket list by status.
11. Use seeded users for creator / assignee / comment author (no user CRUD UI, no login).

## Non-Functional Requirements

1. Stack: React frontend, Node.js backend, MySQL local.
2. Data must persist after restart (real MySQL, not mock-only).
3. Backend validates requests and returns clear error messages.
4. Frontend shows useful errors (not silent fail / blank crash).
5. App must run locally from README (schema/migrations + seed).
6. No secrets in git (`.env.example` only; real `.env` gitignored).
7. Integration tests must cover valid and invalid status transitions.
8. Core scope only — skip Stretch features.

## Assumptions

1. Authentication is not required for Core; any UI user can perform Core actions.
2. Users are created only via seed data (no register/login/user admin UI).
3. `createdBy` / comment author / assignee are chosen from seeded users (e.g. dropdown).
4. Priority values will be a small fixed set (e.g. Low / Medium / High) decided during design.
5. Status values match the state machine exactly: Open, In Progress, Resolved, Closed, Cancelled.
6. Keyword search is simple (title/description contains text); no full-text ranking needed for Core.
7. One MySQL database on the developer machine is enough; no production deployment required.
8. “Internal users” means app users of this mini system, not SSO/AD integration.
9. Updating ticket fields and changing status can be separate API actions (cleaner for testing the state machine).

## Clarifications (questions for a product owner)

1. For Core, is it OK that anyone using the UI can create/update any ticket (since there is no auth)?
2. When creating a ticket, should status always start as **Open**, or can the user pick an initial status?
3. Can a ticket be reassigned after it is Resolved/Closed/Cancelled, or should field updates be blocked in terminal statuses?
4. For keyword search, is matching **title + description** enough, or should comment text also be searched?
5. Who can be selected as `assignedTo` — any seeded user, or only users with a specific role (e.g. agent)?
6. Should cancelled/closed tickets still appear in the default list, or only when filtered?
7. Is soft-delete needed for tickets/comments, or is hard keep-all-history enough for Core?

*(Working decisions if PO is unavailable: no auth; new tickets always Open; allow field updates unless we later decide to lock terminal statuses; search title+description only; any seeded user can be assignee; all statuses visible in list; no soft-delete.)*

## Edge Cases

### Ticket status (important)

Allowed moves only:
- Open → In Progress
- Open → Cancelled
- In Progress → Resolved
- In Progress → Cancelled
- Resolved → Closed

Must reject (examples):
1. Open → Resolved / Closed (skipping steps)
2. In Progress → Open / Closed (wrong direction or skip)
3. Resolved → Open / In Progress / Cancelled
4. Closed → anything (terminal)
5. Cancelled → anything (terminal)
6. Same status again (e.g. Open → Open)
7. Unknown / misspelled status value (e.g. "Done", "in_progress")
8. Setting status on create to anything other than Open (or allowing client to pick status)
9. Changing status on a ticket that does not exist → 404
10. Second click / race: ticket already moved; next transition must use **current DB status**, not stale UI state

### Other

11. Empty/missing required fields on create or update → 400 with clear message.
12. Unknown user id for assignee / createdBy / comment author → validation error.
13. Invalid priority value → validation error.
14. Empty comment message → reject.
15. Comment on missing ticket → 404.
16. Empty search keyword → treat as no keyword filter.
17. Unknown status in filter → clear behaviour (prefer 400; decide in API contract).
18. DB down → backend error; UI shows a usable message.
19. After restart, tickets and comments still load from MySQL.
