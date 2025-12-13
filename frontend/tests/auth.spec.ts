import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  const testEmail = `test${Date.now()}@example.com`;
  const testPassword = 'password123';
  const testFullName = 'Test User';

  test.beforeEach(async ({ page }) => {
    // Capture console logs from the page
    page.on('console', message => {
      console.log(`[Browser Console] ${message.text()}`);
    });
    // Navigate to a page that ensures the layout is loaded (e.g., home page)
    await page.goto('/');
  });

  test('should allow a user to register', async ({ page }) => {
    await page.getByRole('link', { name: 'Sign up' }).click();
    await expect(page).toHaveURL('/register');

    await page.getByLabel('Full Name (Optional)').fill(testFullName);
    await page.getByLabel('Email Address').fill(testEmail);
    await page.getByLabel('Password', { exact: true }).fill(testPassword);
    await page.getByLabel('Confirm Password', { exact: true }).fill(testPassword);
    await page.getByRole('button', { name: 'Sign Up' }).click();

    // After successful registration, it should redirect to the dashboard
    await expect(page).toHaveURL('/dashboard');
    await expect(page.getByText(`Welcome, ${testFullName}`)).toBeVisible();
    await expect(page.getByRole('button', { name: 'Sign out' })).toBeVisible();
  });

  test('should allow a user to log in', async ({ page }) => {
    // Assuming a user is already registered (from previous test or setup)
    await page.getByRole('link', { name: 'Sign in' }).click();
    await expect(page).toHaveURL('/login');

    await page.getByLabel('Email Address').fill(testEmail);
    await page.getByLabel('Password', { exact: true }).fill(testPassword);
    await page.getByRole('button', { name: 'Sign In' }).click();

    await expect(page).toHaveURL('/dashboard');
    await expect(page.getByText(`Welcome, ${testFullName}`)).toBeVisible();
    await expect(page.getByRole('button', { name: 'Sign out' })).toBeVisible();
  });

  test('should allow a user to log out', async ({ page }) => {
    // First, log in the user
    await page.getByRole('link', { name: 'Sign in' }).click();
    await page.getByLabel('Email Address').fill(testEmail);
    await page.getByLabel('Password', { exact: true }).fill(testPassword);
    await page.getByRole('button', { name: 'Sign In' }).click();
    await expect(page).toHaveURL('/dashboard');

    // Then, log out
    await page.getByRole('button', { name: 'Sign out' }).click();

    // Should redirect to home page or login page and sign in link should be visible
    await expect(page).not.toHaveURL('/dashboard');
    await expect(page.getByRole('link', { name: 'Sign in' })).toBeVisible();
  });

  test('should show error with incorrect login credentials', async ({ page }) => {
    await page.getByRole('link', { name: 'Sign in' }).click();
    await expect(page).toHaveURL('/login');

    await page.getByLabel('Email Address').fill('wrong@example.com');
    await page.getByLabel('Password', { exact: true }).fill('wrongpassword');
    await page.getByRole('button', { name: 'Sign In' }).click();

    await expect(page.getByText('Login failed. Please check your credentials.')).toBeVisible();
    await expect(page).toHaveURL('/login'); // Should remain on the login page
  });
});
