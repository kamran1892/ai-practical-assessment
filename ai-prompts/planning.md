# AI Prompts — Planning

For each prompt, capture:

- Prompt text (or short summary)
- AI response summary
- What I accepted
- What I changed
- What I rejected (and why)

---

## Prompt 1

**Prompt:**
@ai-practical-assessment hi, i have this repo ai-practical-assessment. we are doing Support Ticket Management System. Can you explain in simple words what exactly i need to build and what i should not touch? also tell me which files in this repo i should fill first before writing code.

**Response summary:**
AI explained Core-only ticket app: React + Node + MySQL. Features are create/list/detail/update, comments, keyword search + status filter, and status changes only through the fixed state machine (invalid ones rejected by backend + shown in UI). Also need validation, real DB persistence, state-machine integration tests, docs/prompt history, and no secrets in git. Stretch (auth, user CRUD, pagination, Swagger, Docker, CI, extra test tiers) is out of scope. Suggested filling design docs next (data-model, api-contract, ui-flow, design-notes, implementation-plan, test-strategy) before coding; candidate-info/requirements/acceptance already done.

**Accepted:**
Yes

**Changed:**
No

**Rejected / why:**
No

---

## Prompt 2

**Prompt:**
ok before filling data-model.md and api-contract.md based, help me fill requirements-analysis.md.
i will write the "my understanding" part myself later, but first can you list functional and non functional requirements in simple points?
what edge cases should i keep in mind for ticket status?
you can assume users are only seeded, no login needed, mysql local.
**Response summary:**
AI updated requirements-analysis with simple functional points (create starts Open, list/detail/update, status machine, comments, search+filter, seeded users only) and non-functional points (React/Node/MySQL, persistence, validation/errors, README setup, no secrets, state-machine tests, Core only). Left My Understanding for me to write. Listed status edge cases: skip steps, move backward, touch Closed/Cancelled, same status again, bad status strings, client setting status on create, missing ticket 404, and always check current DB status for stale UI/double-click. Suggested data-model.md next after My Understanding.

**Accepted:**
Yes

**Changed:**
No

**Rejected / why:**
NO

---

## Prompt 3

**Prompt:**
now look at acceptance-criteria.md.
can you map each checkbox to which part of the system will cover it (frontend / backend / db / tests)?
(follow-up: map it in the actual file)
**Response summary:**
Mapped every checkbox in root `acceptance-criteria.md` (and Cursor working copy) to Frontend / Backend / DB / Tests / Docs. UI flows → Frontend+Backend+DB; validation/errors → mainly Backend; status machine proof → Tests; persistence → DB; secrets/docs → Docs.

**Accepted:**

**Changed:**

**Rejected / why:**
