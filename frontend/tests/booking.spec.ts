import { test, expect } from '@playwright/test';

test('booking flow (smoke)', async ({ page }) => {
  // Assumes NEXT_PUBLIC_BASE_URL is set in Playwright config or env
  await page.goto('/teachers');
  await expect(page.locator('text=Find Private Tutors')).toBeVisible();

  // Click first teacher card
  const firstCard = page.locator('data-testid=teacher-card').first();
  await firstCard.click();

  // Open booking modal
  await page.click('text=Book Session');
  await expect(page.locator('text=Book a Session')).toBeVisible();

  // Fill basic details (subject, date, time)
  await page.fill('input[label=Subject]', 'Mathematics');
  await page.selectOption('select[label=Grade Level]', 'Primary');
  await page.fill('input[type=date]', '2025-12-30');
  await page.fill('input[type=time]', '10:00');

  // Continue (note: this is a smoke test; payment step may require backend / stripe)
  await page.click('text=Continue to Payment');
  await expect(page.locator('text=Booking Created!')).toBeVisible();
});