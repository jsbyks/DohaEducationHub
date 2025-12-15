import { test, expect, request } from '@playwright/test';

// This E2E test assumes a deployed preview or local dev server is available.
// Set PLAYWRIGHT_BASE_URL to the frontend URL (e.g. http://localhost:3000) when running locally.
// The backend test endpoints used here require ENABLE_TEST_ENDPOINTS=1 to be set in the backend process.

const BASE_URL = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000';
const API_BASE = process.env.PLAYWRIGHT_API_BASE || `${BASE_URL}/api`;

test.describe('Booking + Payment flow (smoke)', () => {
  test('book a teacher and simulate payment via test webhook', async ({ page }) => {
    // Create test teacher via backend test endpoint
    const req = await request.newContext();
    const createResp = await req.post(`${API_BASE}/test/create-teacher`, {
      data: { full_name: 'E2E Teacher', bio: 'Test teacher for E2E' }
    });
    expect(createResp.ok()).toBeTruthy();
    const teacher = await createResp.json();
    const teacherId = teacher.id;

    // Create an admin user and get token
    const adminResp = await req.post(`${API_BASE}/test/create-user`, { data: { email: 'admin@e2e.test', password: 'adminpass', full_name: 'E2E Admin', is_admin: true } });
    expect(adminResp.ok()).toBeTruthy();
    const admin = await adminResp.json();
    const token = admin.access_token;

    // Set admin token in localStorage to simulate logged-in admin
    await page.addInitScript((t) => {
      localStorage.setItem('access_token', t);
    }, token);

    // Open teacher page and do booking via UI
    await page.goto(`${BASE_URL}/teachers/${teacherId}`);

    // TODO: adapt selectors to the app's booking UI (this is a scaffold)
    await page.click('text=Book');
    await page.fill('input[name="subject"]', 'Math');
    await page.fill('input[name="start_time"]', '09:00');
    await page.fill('input[name="scheduled_date"]', '2025-12-30');
    await page.selectOption('select[name="session_type"]', 'online');
    await page.fill('input[name="duration_hours"]', '1');

    // Submit booking and wait for API confirmation
    await page.click('button:has-text("Confirm booking")');
    await page.waitForResponse(resp => resp.url().endsWith('/api/bookings') && resp.status() === 201);

    // Simulate successful payment via test helper
    // Retrieve the latest booking created for this teacher
    const bookingsResp = await req.get(`${API_BASE}/bookings`, { params: {}});

    // Use test helper to simulate webhook (we rely on the booking created above)
    // For simplicity we'll simulate with the ID of the first booking returned
    const bookingsJson = await req.get(`${API_BASE}/bookings`).then(r => r.json());
    const bookingId = bookingsJson.results ? bookingsJson.results[0].id : bookingsJson[0].id;

    const simResp = await req.post(`${API_BASE}/test/simulate-payment-event`, {
      data: { booking_id: bookingId, event_type: 'payment_intent.succeeded' }
    });
    expect(simResp.ok()).toBeTruthy();

    // Now visit admin teachers page and open the teacher details modal
    await page.goto(`${BASE_URL}/admin/teachers`);

    // Wait for admin page to load and show the teacher
    await page.waitForSelector(`text=E2E Teacher`, { timeout: 5000 });
    await page.click(`text=E2E Teacher`);

    // Wait for modal and set stripe account and request payout via UI
    await page.waitForSelector('input[placeholder="acct_"]', { timeout: 5000 });
    await page.fill('input[placeholder="acct_"]', 'acct_test_abc');
    await page.click('button:has-text("Save")');
    await page.fill('input[placeholder="Amount"]', '25');
    await page.click('button:has-text("Request")');

    // Verify payouts list in modal updates
    await page.waitForSelector('text=25 QAR', { timeout: 5000 });

    // Verify test helper payouts endpoint shows the payout
    const payoutsList = await req.get(`${API_BASE}/test/payouts/${teacherId}`);
    expect(payoutsList.ok()).toBeTruthy();
    const payouts = await payoutsList.json();
    expect(payouts.length).toBeGreaterThan(0);

    // Verify UI shows confirmed/paid state (scaffold assertion)
    await page.waitForSelector('text=Booking confirmed', { timeout: 5000 });
  });
});
