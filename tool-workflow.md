# Tool Workflow

## Primary AI tool used

Cursor

## How I provide project context to the tool

- Point Cursor at the assessment folder (`@ai-practical-assessment`)
- Attach the current artifact for the step: requirements, `api-contract.md`, `data-model.md`, `design-notes.md`, `acceptance-criteria.md`
- Keep scope short in the prompt (“Core only”, “no Stretch”, “don’t build X yet”)
- Log important prompts under `ai-prompts/`

## How I use AI for requirement analysis

- Ask for simple functional / non-functional points and status edge cases
- Rewrite “My Understanding” in my own words
- Keep Stretch features out of the checklist

## How I use AI for planning and design

- Draft `data-model.md`, `api-contract.md`, `ui-flow.md`, `design-notes.md`, `implementation-plan.md`
- Decide LLD early: controllers → services → DB + one `statusTransition` module
- Review AI suggestions before any SQL or code

## How I use AI for code generation

- Generate in slices: DB → health check → ticket CRUD → status + comments → frontend → tests
- Ask for Express (not Nest) to keep the stack simple
- Require validation and clear error messages in the same step as the API

## How I validate AI-generated code

- Run MySQL schema/seed and check row counts
- Curl / browser for each endpoint and screen
- Run `npm test` for state-machine integration tests
- Reject Stretch extras and secret values in `.env.example`

## How I use AI for testing

- Ask for integration tests that hit `PATCH /api/tickets/:id/status` against real MySQL
- Require both valid success and invalid `400` cases
- Record command + output in `test-results.md`

## How I use AI for debugging

- Paste the error message / failing test, not passwords
- Ask for the smallest fix; re-run the same test or curl

## How I use AI for code review

- Ask for a focused review (state machine, validation, errors, messy files)
- Keep findings in `code-review-notes.md`
- Apply only important fixes; list them in `review-fixes.md`

## What information I avoid sharing unnecessarily with AI tools

- Real DB passwords / production `.env`
- Customer data or production dumps
- Private tokens / employer secrets

## How I would reuse this workflow in a real project

1. Spec first (requirements → API contract → data model)
2. Thin layers + one place for critical business rules
3. Generate code in small steps; test after each step
4. Keep a short prompt log and a review/fix trail
5. Never let the model expand scope without an explicit ask
