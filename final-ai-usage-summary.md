# Final AI Usage Summary

## Primary tool

Cursor

## Lifecycle coverage

| Activity | Used AI? | Evidence (file / prompt log) |
| --- | --- | --- |
| Requirement analysis | Yes | `ai-prompts/planning.md`, `requirements-analysis.md` |
| Planning / design | Yes | `ai-prompts/design.md`, `data-model.md`, `api-contract.md`, `design-notes.md`, `implementation-plan.md` |
| Implementation | Yes | `ai-prompts/implementation.md`, `project/backend`, `project/frontend`, `database/` |
| Testing | Yes | `ai-prompts/testing.md`, `project/backend/tests/`, `test-results.md` |
| Debugging | Light / as needed | `ai-prompts/debugging.md` (add notes if you hit real bugs) |
| Code review | Yes | `ai-prompts/code-review.md`, `code-review-notes.md`, `review-fixes.md` |
| Documentation | Yes | `README.md`, `tool-workflow.md`, `pr-description.md`, `reflection.md` |

## What I accepted from AI

- Core feature breakdown and acceptance coverage mapping
- DB design with ENUM status/priority for this assessment size
- Express LLD (controllers / services / queries + `statusTransition`)
- Nested comments under `/tickets/:id/comments`
- Jest + Supertest integration suite structure
- Drafts for README, PR description, reflection, workflow docs

## What I changed or rejected

- Rejected Stretch: auth, user CRUD UI, pagination, Swagger, Docker, CI
- Forced status changes into a dedicated module/endpoint (not mixed into field update)
- Reset any real password out of `.env.example`
- Applied only important review fixes (safe status update, JSON 400, LIKE escape)
- Skipped shared FE/BE package and large refactors as overkill for Core

## Responsible usage notes

- No production data shared with the tool
- Real credentials only in local `.env` (gitignored)
- AI output treated as draft — validated with MySQL, UI, and automated tests
- Prompt history kept for transparency under `ai-prompts/`
