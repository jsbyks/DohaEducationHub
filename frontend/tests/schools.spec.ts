
import { test, expect } from '@playwright/test';

test.describe('School Search and Filtering', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/schools');
  });

  test('should display a list of schools', async ({ page }) => {
    await expect(page.getByText(/Found \d+ schools?/)).toBeVisible();
    const schoolCards = await page.getByTestId('school-card').count();
    expect(schoolCards).toBeGreaterThan(0);
  });

  test('should filter schools by name', async ({ page }) => {
    await page.getByLabel('School Name').fill('International');
    await expect(page.getByTestId('school-card').first()).toBeVisible();
    const schoolCards = await page.getByTestId('school-card').all();
    for (const card of schoolCards) {
      await expect(card).toContainText('International');
    }
  });

  test('should filter schools by curriculum', async ({ page }) => {
    await page.getByLabel('Curriculum').selectOption('British');
    await expect(page.getByTestId('school-card').first()).toBeVisible();
    const schoolCards = await page.getByTestId('school-card').all();
    for (const card of schoolCards) {
      await expect(card).toContainText('British');
    }
  });

  test('should clear filters', async ({ page }) => {
    await page.getByLabel('School Name').fill('International');
    await page.getByLabel('Curriculum').selectOption('British');
    
    await page.getByRole('button', { name: 'Clear Filters' }).click();

    const searchInput = await page.getByLabel('School Name').inputValue();
    expect(searchInput).toBe('');

    const curriculumSelect = await page.getByLabel('Curriculum').inputValue();
    expect(curriculumSelect).toBe('');
  });
});
