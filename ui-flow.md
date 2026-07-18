# UI Flow

Three screens only (Core). No login.

## Screens

1. **Ticket list** — `/tickets`  
2. **Create ticket** — `/tickets/new`  
3. **Ticket detail** — `/tickets/:id` (view / update / status change / comments)

---

## Screen 1 — Ticket list

**Shows**
- Keyword search input (`q`)
- Status filter dropdown (All + each status)
- Ticket rows: title, priority, status, assignee, created date
- Link/button: **New ticket**
- Each row links to detail

**APIs**
- `GET /api/tickets?q=&status=`

**Happy path**
1. Page loads → fetch tickets → show list (includes seed data after setup).
2. User types keyword and/or picks status → refetch with query params → list updates.
3. User clicks a ticket → go to detail.
4. User clicks **New ticket** → go to create.

**Error path**
- API/network fail → show banner: e.g. “Could not load tickets. Check that the API is running.”
- Invalid status filter (shouldn’t happen if dropdown-only) → show API `message`.

---

## Screen 2 — Create ticket

**Shows**
- Form: title, description, priority, createdBy (user dropdown), assignedTo (user dropdown, optional/unassigned)
- Submit + Cancel (cancel → back to list)

**APIs**
- `GET /api/users` (dropdowns)
- `POST /api/tickets`

**Happy path**
1. Load users into dropdowns.
2. User fills form → submit.
3. On `201` → navigate to new ticket detail (or list). New ticket appears as **Open**.

**Error path**
- Validation `400` → show `message` / field errors above or under the form; stay on page.
- Network fail → usable error banner; do not clear the whole form silently.

---

## Screen 3 — Ticket detail

**Shows**
- Ticket fields: title, description, priority, status, assignee, creator, timestamps
- Edit form (or inline edit) for title, description, priority, assignee → Save
- **Status actions:** buttons or select listing only **allowed next** statuses (from current status). If none (Closed/Cancelled), show “No further status changes.”
- Comments list + add-comment form (message + author dropdown)

**APIs**
- `GET /api/tickets/:id`
- `PATCH /api/tickets/:id` (fields)
- `PATCH /api/tickets/:id/status`
- `POST /api/tickets/:id/comments`
- `GET /api/users` (dropdowns)

**Happy path**
1. Load ticket + comments.
2. Edit fields → Save → success feedback; values persist after refresh.
3. Pick allowed next status → status updates on page.
4. Add comment → comment appears in list without leaving the page.

---

## Invalid status change — how it should look in UI

Goal: never silent; never a blank crash.

1. User tries an illegal move (e.g. Open → Resolved), either by:
   - choosing it if UI somehow sends it, or
   - stale UI after another change, or
   - a bug that offers a bad option.
2. Frontend calls `PATCH /api/tickets/:id/status`.
3. Backend returns **`400`** with a clear message, e.g.  
   `Invalid status transition from Open to Resolved`
4. UI behaviour:
   - Keep the ticket on the **current** status (do not optimistically flip).
   - Show a visible **error alert/banner** near the status controls (red/error style), with the backend `message` text.
   - Optionally disable the failing control briefly or leave selection cleared.
5. After a successful transition, clear the error banner and refresh displayed status (and allowed next actions).

**Nice UX (recommended, not Stretch):** only render buttons for allowed next statuses so bad transitions are rare; still handle `400` for races/stale data.

---

## Other error paths (detail)

| Case | UI |
| --- | --- |
| Ticket `404` | “Ticket not found” + link back to list |
| Field update `400` | Show message on edit form |
| Comment `400` | Show message on comment form |
| Network / `500` | Page-level banner; keep existing content if already loaded |

---

## Navigation

```
Ticket list ──► Create ticket ──► (after create) Detail
     │                                ▲
     └──────────► Detail ─────────────┘
                      │
                      └──► List (back link)
```

No auth screens. Creator/assignee/comment author always chosen from seeded users.
