# AI Prompts — Design

For each prompt, capture:

- Prompt text (or short summary)
- AI response summary
- What I accepted
- What I changed
- What I rejected (and why)

---

## Prompt 1

**Prompt:**
before creating any tables, i want to discuss DB design architecture first.
i have mysql on my local. for User, Ticket, Comment , what tables, columns, types, foreign keys you suggest?
also should status and priority be ENUM or separate lookup tables? what is better for this project and why?
please draft data-model.md but dont create sql files yet. i want to review first.

**Response summary:**
Drafted three tables (`users`, `tickets`, `comments`) with types/FKs/indexes. Recommended MySQL ENUM for status + priority for Core (fixed small set; state machine still in backend; simpler than lookup tables). Left open questions: nullable assignee, CASCADE on comments, role ENUM vs VARCHAR.

**Accepted:**

**Changed:**

**Rejected / why:**

---

## Prompt 2

**Prompt:**
i have a question for this ticket system, which LLD concepts actually make sense?
like controllers, services, repositories, state machine as a separate module etc. or is that overengineering for a this project?
i want clean structure but not too complex. suggest a simple LLD for backend and also how frontend pages can be organised.
then update design-notes.md with the architecture overview.

**Response summary:**
Recommended routes/controllers + services + thin DB layer + separate pure `statusTransition` module. Skip full repository/DI/CQRS as overkill. Frontend: 3 pages (list, create, detail) + small components (form, search/filter, status actions, comments, error). Wrote architecture into `design-notes.md`.

**Accepted:**
Yes

**Changed:**
No

**Rejected / why:**
No

---

## Prompt 3

**Prompt:**
next can we list all endpoints i need for with method, path, request body, response, and validation rules. put it in api-contract.md.
for ui-flow.md just 3 screens is fine - list, create, detail. also mention how invalid status change should look in UI.
should comments be separate endpoint or nested under ticket? what do top devs usually do?

**Response summary:**
Filled `api-contract.md` with 7 endpoints: users list, tickets CRUD-ish (list/create/get/patch fields), nested status + nested comments. Recommended nesting comments under ticket (`POST /tickets/:id/comments`, comments embedded in GET detail) — common REST sub-resource pattern. Filled `ui-flow.md` with list/create/detail and invalid status = keep current status + show backend 400 message in error banner.

**Accepted:**
Yes
**Changed:**
No
**Rejected / why:**
No