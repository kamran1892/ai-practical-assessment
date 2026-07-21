# Test Results

## How to run tests

Prerequisites: MySQL running, schema + seed applied, `project/backend/.env` set.

```bash
cd project/backend
npm install
npm test
```

Command under the hood: `jest --runInBand --forceExit`  
Suite file: `project/backend/tests/statusTransition.integration.test.js`

## Results summary

| Suite | Result | Notes |
| --- | --- | --- |
| State machine integration | **PASS** | 25 tests — all valid transitions + invalid rejections + unknown status + 404 |
| Date / time of run | 2026-07-21 | Local MySQL (`support_tickets`) |

## Evidence

Latest run output:

```text
PASS tests/statusTransition.integration.test.js (8.772 s)
  Status state machine — integration (API + MySQL)
    all valid transitions succeed
      ✓ Open → In Progress
      ✓ Open → Cancelled
      ✓ In Progress → Resolved
      ✓ In Progress → Cancelled
      ✓ Resolved → Closed
      ✓ ALLOWED_TRANSITIONS map matches the five Core rules
    invalid transitions are rejected
      ✓ Open → Resolved / Closed / Open (same) → 400, status unchanged
      ✓ In Progress → Open / Closed / In Progress → 400, status unchanged
      ✓ Resolved → Open / In Progress / Cancelled → 400, status unchanged
      ✓ Closed → * → 400, status unchanged
      ✓ Cancelled → * → 400, status unchanged
      ✓ unknown status value returns 400
      ✓ missing ticket returns 404

Test Suites: 1 passed, 1 total
Tests:       25 passed, 25 total
Time:        8.864 s
```

Exit code: `0`

## Notes

- Tests hit real Express routes (`PATCH /api/tickets/:id/status`) and persist through MySQL (re-read after each change).
- Jest may print `Force exiting Jest` because the MySQL pool is closed in `afterAll`; suite still passes.
