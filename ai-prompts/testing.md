# AI Prompts — Testing

For each prompt, capture:

- Prompt text (or short summary)
- AI response summary
- What I accepted
- What I changed
- What I rejected (and why)

---

## Prompt 1

**Prompt:**
now write integration tests for the status state machine.
must prove:
1. all valid transitions succeed
2. invalid transitions get rejected
put tests under tests/ or project/backend. update test-strategy.md and after running, help me fill test-results.md.

**Response summary:**
Added Jest+Supertest suite at `project/backend/tests/statusTransition.integration.test.js` (25 tests). Updated `test-strategy.md`, ran `npm test` (all passed), filled `test-results.md`, documented command in README.

**Accepted:**

**Changed:**

**Rejected / why:**
