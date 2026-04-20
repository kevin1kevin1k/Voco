import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(async () => {
    localStorage.clear();
    await new Promise((resolve) => {
      const request = indexedDB.deleteDatabase('voco_assets');
      request.onsuccess = () => resolve();
      request.onerror = () => resolve();
      request.onblocked = () => resolve();
    });
  });
  await page.reload();
});

test('family grid renders with a board theme and keeps recommendations visible after interaction', async ({ page }) => {
  await page.getByLabel('主導航').getByRole('button', { name: '家人' }).click();

  const gridRoot = page.locator('.grid-view');
  await expect(gridRoot).toHaveAttribute('data-board-theme', 'family');

  const sonButton = page.getByRole('button', { name: '兒子' });
  await expect(sonButton).toBeVisible();
  await sonButton.click();

  const recommendationRegion = page.getByRole('region', { name: '推薦詞彙' });
  await expect(recommendationRegion).toBeVisible();
});
