# Support Ticket Management System

AI Capability Exercise — Full-stack mini project (Core only).

## Project option

**Support Ticket Management System** (backend-leaning Core)

## Stack (to be finalized during setup)

- Frontend: React
- Backend: Node.js
- Database: MySQL (local)

## Repository layout

```
ai-practical-assessment/
  README.md
  candidate-info.md
  tool-workflow.md
  requirements-analysis.md
  acceptance-criteria.md
  implementation-plan.md
  design-notes.md
  api-contract.md
  data-model.md
  ui-flow.md
  test-strategy.md
  test-results.md
  debugging-notes.md
  code-review-notes.md
  review-fixes.md
  pr-description.md
  reflection.md
  final-ai-usage-summary.md
  ai-prompts/
  tool-specific/cursor-workflow/
  database/
    schema-or-migrations/
    seed-data/
    setup-notes.md
  project/
    frontend/
    backend/
    db/
  src/
  tests/
```

## Setup

> Fill this section after the app is built.

### Prerequisites

- Node.js
- MySQL running locally
- npm / yarn

### Database

See `database/setup-notes.md`.

### Backend

```bash
# steps to be added
```

### Frontend

```bash
# steps to be added
```

### Environment

Copy `.env.example` files once they exist. Do not commit secrets.

## Core features

- Create / list / view / update tickets
- Status transitions via enforced state machine
- Comments on tickets
- Keyword search + status filter
- Seeded users (no user-management UI)
- Backend validation + clear UI errors
- Integration tests for status state machine

## Stretch

Not in scope for this submission.
