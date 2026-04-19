import { test, expect } from '@playwright/test';

// Helper: enter edit mode
async function enterEditMode(page) {
  await page.getByRole('button', { name: '編輯' }).click();
  await expect(page.getByRole('button', { name: '完成' })).toBeVisible();
}

// Helper: create a new board with the given name
async function createBoard(page, boardName) {
  await page.getByRole('button', { name: '新增頁面' }).click();
  await page.getByRole('textbox', { name: '頁面名稱' }).fill(boardName);
  await page.getByRole('button', { name: '確認' }).click();
}

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  // Clear localStorage so each test starts fresh
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

test('新增板面後出現在 nav categories', async ({ page }) => {
  await enterEditMode(page);
  await createBoard(page, '測試頁面');

  // The new board's nav category button should exist in the nav bar
  await expect(page.getByRole('button', { name: '測試頁面' })).toBeVisible();
});

test('返回後仍可透過 nav category 重新導航', async ({ page }) => {
  await enterEditMode(page);
  await createBoard(page, '測試頁面');

  // Navigate back to previous board
  await page.getByRole('button', { name: '返回上一頁' }).click();

  // Category button should still be in nav bar
  const categoryBtn = page.getByLabel('主導航').getByRole('button', { name: '測試頁面' });
  await expect(categoryBtn).toBeVisible();

  // Clicking it should navigate to the new board
  await categoryBtn.click();
  await expect(page.getByRole('heading', { name: '測試頁面' })).toBeVisible();
});

test('頁面 reload 後 localStorage 持久化', async ({ page }) => {
  await enterEditMode(page);
  await createBoard(page, '持久化頁面');

  // Reload the page
  await page.reload();

  // Category button should survive reload (via localStorage)
  const categoryButton = page.getByLabel('主導航').getByRole('button', { name: '持久化頁面' });
  await expect(categoryButton).toBeVisible();

  // Re-open the board after reload
  await categoryButton.click();
  await expect(page.getByRole('heading', { name: '持久化頁面' })).toBeVisible();
});

test('新增按鈕後出現在 grid', async ({ page }) => {
  await enterEditMode(page);
  await createBoard(page, '按鈕測試頁');

  // Now add a button to the new board
  await page.getByRole('button', { name: '新增按鈕' }).click();
  await page.getByRole('textbox', { name: '按鈕文字', exact: true }).fill('咖啡');
  await page.getByRole('button', { name: '確認' }).click();

  // The button should appear in the grid
  await expect(page.getByRole('button', { name: '咖啡' })).toBeVisible();
});

test('新增 VSD 頁面後可上傳背景圖並在 reload 後保留', async ({ page }) => {
  await enterEditMode(page);
  await page.getByRole('button', { name: '新增頁面' }).click();
  await page.getByRole('textbox', { name: '頁面名稱' }).fill('客廳場景');
  await page.getByRole('combobox', { name: '版面類型' }).selectOption('vsd');
  await page.getByRole('button', { name: '確認' }).click();

  await expect(page.getByRole('heading', { name: '客廳場景' })).toBeVisible();

  await page.locator('input[type="file"]').setInputFiles('public/images/scenes/living-room.svg');
  await expect(page.locator('.vsd-background')).toBeVisible();

  await page.reload();

  const reloadedCategoryButton = page.getByLabel('主導航').getByRole('button', { name: '客廳場景' });
  await expect(reloadedCategoryButton).toBeVisible();
  await reloadedCategoryButton.click();
  await expect(page.getByRole('heading', { name: '客廳場景' })).toBeVisible();
  await expect(page.locator('.vsd-background')).toBeVisible();
});
