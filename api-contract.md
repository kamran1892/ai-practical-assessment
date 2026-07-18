# API Contract

Base URL: `http://localhost:<PORT>/api`  
JSON request/response. No auth headers (Core).

**Shared error shape**

```json
{
  "message": "Human-readable error",
  "errors": ["optional field-level details"]
}
```

| Status | When |
| --- | --- |
| `400` | Validation failure or invalid status transition |
| `404` | Ticket (or related resource) not found |
| `500` | Unexpected server/DB error |

**Comments: nested under ticket (decision)**

Comments are a sub-resource of a ticket, so we use:

- `POST /api/tickets/:id/comments` — add comment  
- Comments returned inside `GET /api/tickets/:id` — no separate list endpoint for Core  

Why (common REST practice): a comment always belongs to one ticket; nesting makes ownership clear and keeps the API surface small. Top-level `/comments` is usually for global feeds or admin tools — not needed here.

---

## 1. List seeded users

- Method: `GET`
- Path: `/api/users`
- Purpose: Populate creator / assignee / comment-author dropdowns

### Request

No body. No query params required.

### Response `200`

```json
[
  {
    "id": 1,
    "name": "Alice Agent",
    "email": "alice@example.com",
    "role": "agent"
  }
]
```

### Validation Rules

- None (read-only seed list)

### Error Responses

- `500` — DB/server failure

---

## 2. List tickets (search + status filter)

- Method: `GET`
- Path: `/api/tickets`
- Purpose: Ticket list for UI; optional keyword + status filter

### Request

Query params:

| Param | Type | Required | Notes |
| --- | --- | --- | --- |
| `q` | string | no | Keyword; match title **or** description (`LIKE`). Empty/omitted = no keyword filter |
| `status` | string | no | Exact status enum value. Omitted = all statuses |

Example: `GET /api/tickets?q=login&status=Open`

### Response `200`

```json
[
  {
    "id": 1,
    "title": "Cannot login",
    "description": "User sees 500 on login",
    "priority": "High",
    "status": "Open",
    "assignedTo": {
      "id": 2,
      "name": "Bob"
    },
    "createdBy": {
      "id": 1,
      "name": "Alice"
    },
    "createdAt": "2026-07-18T10:00:00.000Z",
    "updatedAt": "2026-07-18T10:00:00.000Z"
  }
]
```

`assignedTo` may be `null` if unassigned.  
List responses do **not** need to include comments.

### Validation Rules

- If `status` is provided, it must be one of: `Open`, `In Progress`, `Resolved`, `Closed`, `Cancelled`
- `q`: optional string; trim; empty string treated as omitted

### Error Responses

- `400` — unknown `status` value
- `500` — server/DB error

---

## 3. Create ticket

- Method: `POST`
- Path: `/api/tickets`
- Purpose: Create ticket; status always starts as `Open`

### Request

```json
{
  "title": "Cannot login",
  "description": "User sees 500 on login",
  "priority": "High",
  "createdBy": 1,
  "assignedTo": 2
}
```

`assignedTo` may be `null` or omitted (unassigned).

### Response `201`

```json
{
  "id": 10,
  "title": "Cannot login",
  "description": "User sees 500 on login",
  "priority": "High",
  "status": "Open",
  "assignedTo": { "id": 2, "name": "Bob" },
  "createdBy": { "id": 1, "name": "Alice" },
  "createdAt": "2026-07-18T12:00:00.000Z",
  "updatedAt": "2026-07-18T12:00:00.000Z",
  "comments": []
}
```

### Validation Rules

- `title` — required, non-empty string, max 200 chars
- `description` — required, non-empty string
- `priority` — required; one of `Low`, `Medium`, `High`
- `createdBy` — required; must exist in `users`
- `assignedTo` — optional; if present/non-null, must exist in `users`
- Client **must not** set `status` (ignored if sent, or reject with `400` — prefer **reject** if `status` is present)
- New ticket `status` is always `Open` (set by backend)

### Error Responses

- `400` — missing/invalid fields, unknown user id, client sent `status`
- `500` — server/DB error

---

## 4. Get ticket detail

- Method: `GET`
- Path: `/api/tickets/:id`
- Purpose: Detail view — fields + comments

### Request

No body. `:id` = ticket id.

### Response `200`

```json
{
  "id": 1,
  "title": "Cannot login",
  "description": "User sees 500 on login",
  "priority": "High",
  "status": "Open",
  "assignedTo": { "id": 2, "name": "Bob" },
  "createdBy": { "id": 1, "name": "Alice" },
  "createdAt": "2026-07-18T10:00:00.000Z",
  "updatedAt": "2026-07-18T10:00:00.000Z",
  "comments": [
    {
      "id": 1,
      "message": "Looking into this",
      "createdBy": { "id": 2, "name": "Bob" },
      "createdAt": "2026-07-18T11:00:00.000Z"
    }
  ]
}
```

### Validation Rules

- `:id` must be a positive integer

### Error Responses

- `404` — ticket not found  
  `{ "message": "Ticket not found" }`
- `500` — server/DB error

---

## 5. Update ticket fields

- Method: `PATCH`
- Path: `/api/tickets/:id`
- Purpose: Update title, description, priority, assignee only (**not** status)

### Request

```json
{
  "title": "Cannot login (updated)",
  "description": "Still failing after deploy",
  "priority": "Medium",
  "assignedTo": 3
}
```

All fields optional, but at least one must be present. Send only fields being changed, or full set from the form — either is fine if validated.

### Response `200`

Same shape as get ticket detail (including `comments`).

### Validation Rules

- Ticket must exist
- If `title` present — non-empty, max 200
- If `description` present — non-empty
- If `priority` present — `Low` | `Medium` | `High`
- If `assignedTo` present — `null` or existing user id
- **`status` must not be updated here** — if client sends `status`, return `400` (use status endpoint)

### Error Responses

- `400` — validation failure / status field not allowed here
- `404` — ticket not found
- `500` — server/DB error

---

## 6. Change ticket status

- Method: `PATCH`
- Path: `/api/tickets/:id/status`
- Purpose: Apply one allowed state-machine transition

### Request

```json
{
  "status": "In Progress"
}
```

### Response `200`

```json
{
  "id": 1,
  "title": "Cannot login",
  "description": "User sees 500 on login",
  "priority": "High",
  "status": "In Progress",
  "assignedTo": { "id": 2, "name": "Bob" },
  "createdBy": { "id": 1, "name": "Alice" },
  "createdAt": "2026-07-18T10:00:00.000Z",
  "updatedAt": "2026-07-18T12:30:00.000Z",
  "comments": []
}
```

### Validation Rules

- Ticket must exist
- `status` — required; must be a valid enum value
- Transition must be allowed from **current DB status** (see table below)
- Same status again (e.g. Open → Open) is **invalid**

### Error Responses

- `400` — invalid value or illegal transition  
  Example: `{ "message": "Invalid status transition from Open to Resolved" }`
- `404` — ticket not found
- `500` — server/DB error

---

## 7. Add comment (nested)

- Method: `POST`
- Path: `/api/tickets/:id/comments`
- Purpose: Add a comment to an existing ticket

### Request

```json
{
  "message": "Reproduced on staging",
  "createdBy": 2
}
```

### Response `201`

```json
{
  "id": 5,
  "ticketId": 1,
  "message": "Reproduced on staging",
  "createdBy": { "id": 2, "name": "Bob" },
  "createdAt": "2026-07-18T13:00:00.000Z"
}
```

### Validation Rules

- Ticket `:id` must exist → else `404`
- `message` — required, non-empty string
- `createdBy` — required; must exist in `users`

### Error Responses

- `400` — missing/empty message or invalid/unknown `createdBy`
- `404` — ticket not found
- `500` — server/DB error

---

## Endpoint summary

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/api/users` | Seeded users for dropdowns |
| `GET` | `/api/tickets` | List + `q` + `status` |
| `POST` | `/api/tickets` | Create (status = Open) |
| `GET` | `/api/tickets/:id` | Detail + comments |
| `PATCH` | `/api/tickets/:id` | Update fields (not status) |
| `PATCH` | `/api/tickets/:id/status` | Status transition |
| `POST` | `/api/tickets/:id/comments` | Add comment |

---

## Status transition rules (backend)

| From | Allowed next |
| --- | --- |
| Open | In Progress, Cancelled |
| In Progress | Resolved, Cancelled |
| Resolved | Closed |
| Closed | _(none)_ |
| Cancelled | _(none)_ |

**Priority values:** `Low` | `Medium` | `High`  
**Status values:** `Open` | `In Progress` | `Resolved` | `Closed` | `Cancelled`
