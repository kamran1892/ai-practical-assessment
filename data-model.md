# Data Model

## Database choice

MySQL (local)

## Design decisions (for review)

### Tables

Three tables only for Core:

1. `users` — seeded; no user-management UI
2. `tickets` — main entity
3. `comments` — belong to a ticket

No separate tables for status/priority (see ENUM vs lookup below).

### Status & priority: ENUM vs lookup tables

| Approach | Pros | Cons |
| --- | --- | --- |
| **MySQL ENUM** on `tickets` | Simple; one table; DB rejects unknown values; good for fixed Core set | Changing allowed values later needs `ALTER TABLE`; less flexible if product grows |
| **Lookup tables** (`statuses`, `priorities`) | Easy to add labels later; can store sort order / display name | Extra joins; more seed/migration work; **does not** enforce state-machine transitions anyway |
| **VARCHAR + backend validation** | Portable; easy to change in code | DB alone won’t reject bad values unless you add CHECK |

**Recommendation for this project: use ENUM** for both `status` and `priority`.

**Why:**
- Core values are fixed and small (5 statuses, 3 priorities).
- State-machine rules live in the **backend** either way — lookup tables don’t replace that.
- Keeps schema and seeds simple for a short assessment.
- MySQL still blocks garbage values at the DB layer.

If you later need admin-editable statuses, switch to lookup tables; not needed for Core.

### Naming

- DB columns: `snake_case`
- API/JSON can map to `camelCase` later in `api-contract.md`

### Nullability notes

- `tickets.assigned_to` — **nullable** (ticket can be unassigned; API may still require it on create if we decide so)
- `tickets.created_by` — **required**
- New tickets always get `status = 'Open'` from the backend (not chosen by client)

---

## Entities

### User → table `users` (seeded only)

| Column | Type | Constraints | Notes |
| --- | --- | --- | --- |
| `id` | `INT UNSIGNED` | PK, AUTO_INCREMENT | |
| `name` | `VARCHAR(100)` | NOT NULL | Display name in dropdowns |
| `email` | `VARCHAR(255)` | NOT NULL, UNIQUE | |
| `role` | `ENUM('requester','agent','admin')` | NOT NULL, DEFAULT `'requester'` | Informational for seed; no auth in Core |
| `created_at` | `DATETIME` | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Optional but useful |

### Ticket → table `tickets`

| Column | Type | Constraints | Notes |
| --- | --- | --- | --- |
| `id` | `INT UNSIGNED` | PK, AUTO_INCREMENT | |
| `title` | `VARCHAR(200)` | NOT NULL | Keyword search |
| `description` | `TEXT` | NOT NULL | Keyword search |
| `priority` | `ENUM('Low','Medium','High')` | NOT NULL | |
| `status` | `ENUM('Open','In Progress','Resolved','Closed','Cancelled')` | NOT NULL, DEFAULT `'Open'` | State machine in backend |
| `assigned_to` | `INT UNSIGNED` | NULL, FK → `users.id` | Nullable = unassigned |
| `created_by` | `INT UNSIGNED` | NOT NULL, FK → `users.id` | Creator (seeded user) |
| `created_at` | `DATETIME` | NOT NULL, DEFAULT CURRENT_TIMESTAMP | |
| `updated_at` | `DATETIME` | NOT NULL, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | |

### Comment → table `comments`

| Column | Type | Constraints | Notes |
| --- | --- | --- | --- |
| `id` | `INT UNSIGNED` | PK, AUTO_INCREMENT | |
| `ticket_id` | `INT UNSIGNED` | NOT NULL, FK → `tickets.id` | Cascade delete optional (see below) |
| `message` | `TEXT` | NOT NULL | |
| `created_by` | `INT UNSIGNED` | NOT NULL, FK → `users.id` | Comment author (seeded user) |
| `created_at` | `DATETIME` | NOT NULL, DEFAULT CURRENT_TIMESTAMP | |

---

## Foreign keys

| From | Column | To | On delete (suggested) | Why |
| --- | --- | --- | --- | --- |
| `tickets` | `assigned_to` | `users.id` | `SET NULL` | User removed → ticket stays, unassigned |
| `tickets` | `created_by` | `users.id` | `RESTRICT` | Don’t delete users who created tickets (seed users stay) |
| `comments` | `ticket_id` | `tickets.id` | `CASCADE` | Delete ticket → remove its comments |
| `comments` | `created_by` | `users.id` | `RESTRICT` | Keep comment history consistent |

> For Core, users are seed-only and rarely deleted. `RESTRICT` on user FKs is the safe default.

---

## Relationships

```
users 1 ─── * tickets          (as created_by)
users 1 ─── * tickets          (as assigned_to, optional)
tickets 1 ─── * comments
users 1 ─── * comments         (as created_by)
```

- One user can create many tickets and many comments.
- One ticket has many comments.
- One ticket has one creator; zero or one assignee.

---

## Indexes / search notes

| Index | Table | Columns | Purpose |
| --- | --- | --- | --- |
| PK | all | `id` | Primary key |
| UNIQUE | `users` | `email` | Unique email |
| INDEX | `tickets` | `status` | Status filter |
| INDEX | `tickets` | `assigned_to` | FK + future filters |
| INDEX | `tickets` | `created_by` | FK |
| INDEX | `comments` | `ticket_id` | Load comments for detail |
| INDEX | `comments` | `created_by` | FK |

**Keyword search (Core):** `WHERE title LIKE ? OR description LIKE ?`  
Full-text index is optional / Stretch — not required for Core.

---

## Allowed values (reference)

**Status (state machine enforced in backend):**

| From | Allowed next |
| --- | --- |
| Open | In Progress, Cancelled |
| In Progress | Resolved, Cancelled |
| Resolved | Closed |
| Closed | _(none)_ |
| Cancelled | _(none)_ |

**Priority:** `Low` | `Medium` | `High`

---

## ER sketch

```
users
  id (PK)
  name, email, role, created_at
    │
    ├──< tickets.created_by          (required)
    ├──< tickets.assigned_to         (optional)
    └──< comments.created_by         (required)

tickets
  id (PK)
  title, description
  priority (ENUM), status (ENUM)
  assigned_to (FK → users), created_by (FK → users)
  created_at, updated_at
    │
    └──< comments.ticket_id          (1 ticket → many comments)

comments
  id (PK)
  ticket_id (FK → tickets)
  message
  created_by (FK → users)
  created_at
```
---

## Out of scope for this model

- Auth tables / password / sessions
- Soft-delete columns
- Priority/status lookup tables
- Attachments, tags, audit log of every field change

---

## Open for your review

1. OK with **ENUM** for status + priority (vs lookup tables)?
2. OK with **nullable** `assigned_to`?
3. Priority labels: `Low` / `Medium` / `High` — confirm casing for API consistency.
4. Comment delete with ticket: **CASCADE** OK?
5. Add `role` ENUM values as above, or simplify to `VARCHAR(50)`?
