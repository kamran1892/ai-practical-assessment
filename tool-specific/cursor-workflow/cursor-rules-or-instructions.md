# Cursor Rules / Instructions

## Always

- Work only on **Core** unless I explicitly ask for Stretch
- Prefer MySQL for persistence
- Put app code under `project/frontend`, `project/backend`, `project/db`
- Keep lifecycle docs at repo root updated when decisions change
- After meaningful AI sessions, remind me to log prompts under `ai-prompts/`

## Code

- Validate on backend; show clear errors on frontend
- Centralize status transition rules in one place on the backend
- No passwords, API keys, or `.env` secrets committed
- Use `.env.example` with placeholders only

## Tests

- Mandatory: integration tests for valid and invalid status transitions

## Tone of help

- Explain briefly why a design choice matters
- If I ask something curious (LLD, architecture), answer then tie it back to this project
