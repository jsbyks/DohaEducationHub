# Running Playwright E2E tests locally

Preconditions:
- Start the backend locally with `ENABLE_TEST_ENDPOINTS=1` set in your environment, e.g.:

```bash
cd backend
export ENABLE_TEST_ENDPOINTS=1
uvicorn main:app --reload --port 8000
```

- Start the frontend locally:

```bash
cd frontend
npm run dev
```

Run E2E tests:

```bash
cd frontend
./scripts/run_e2e.sh
```

Notes:
- The tests use backend test endpoints to create test users, teachers, simulate payments, and create payouts. Do NOT enable `ENABLE_TEST_ENDPOINTS` in production.
- If your local UI differs (selectors, labels), update `frontend/tests/e2e/booking_payment.spec.ts` accordingly.
