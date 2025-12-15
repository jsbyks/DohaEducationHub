import { test, expect } from '@playwright/test';

test('no htmlFor hydration mismatch on /schools', async ({ page }) => {
  const consoleMessages: string[] = [];
  page.on('console', (msg) => consoleMessages.push(msg.text()));

  await page.goto('http://localhost:3002/schools');
  // wait for page to be interactive
  await page.waitForLoadState('networkidle');

  const hasMismatch = consoleMessages.some((m) => /htmlFor.*did not match/i.test(m));
  expect(hasMismatch).toBeFalsy();
});
