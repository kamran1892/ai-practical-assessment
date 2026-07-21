# Reflection

## What I Built

A Core support ticket app: React frontend, Node/Express backend, MySQL. Main flows are create/list/detail/update, comments, search/filter, and a strict status lifecycle with integration tests.

## How I Used AI (across the lifecycle)

I used Cursor step by step instead of “build everything”:

1. Clarify requirements and acceptance mapping  
2. Design data model, API contract, UI flow, LLD  
3. Implement DB → backend → frontend → tests  
4. Review and fix only important issues  
5. Write setup/docs and submission artifacts  

Prompts are logged under `ai-prompts/`.

## What AI Helped With Most

- Turning vague assessment text into concrete checklists and contracts
- Scaffolding consistent Express layers and React pages quickly
- Generating state-machine integration test cases from the transition table
- Drafting README / PR / reflection structure

## What AI Got Wrong

- Sometimes suggested Stretch items (auth, Swagger, extra test tiers)
- Needed correction to keep status rules in **one** backend module
- Once risked putting a real-looking password in `.env.example` — corrected to placeholders only
- Newer Vite scaffolding needed a newer Node than this machine; fell back to a manual Vite 5 setup

## How I Validated AI Output

- Compared output to `acceptance-criteria.md` and `api-contract.md`
- Ran schema/seed, curl, UI click-through, and `npm test`
- Kept invalid status transitions proven by API tests, not only UI buttons

## What I Would Improve Next

- Add auth when the product needs it
- Debounce search and tighten FE/BE shared constants
- Add CI to run the state-machine suite on every push
- More deliberate debugging notes when something fails in the wild

## Reusable Workflow (prompts, rules, specs, templates)

1. Spec docs before code  
2. Small implementation slices with an exit check each time  
3. Critical business rules in one testable module  
4. Prompt log + review/fix notes for auditability  
5. Explicit “out of scope” list to stop AI scope creep  
