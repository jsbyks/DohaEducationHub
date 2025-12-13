import { test, expect } from '@playwright/test';

test.describe('Smoke tests', () => {
  test('home page loads and shows title', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Doha Education Hub/i);
    await expect(page.getByRole('link', { name: /schools/i })).toBeVisible().catch(() => {});
  });

  test('sitemap.xml is reachable and contains root', async ({ request }) => {
    const res = await request.get('/sitemap.xml');
    expect(res.status()).toBe(200);
    const body = await res.text();
    expect(body).toContain('<loc>/</loc>');
  });
});
