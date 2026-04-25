import { expect, test } from '@playwright/test';

async function enterEditMode(page) {
  await page.getByRole('button', { name: '編輯' }).click();
  await expect(page.getByRole('button', { name: '完成' })).toBeVisible();
}

async function createGridBoard(page, boardName) {
  await page.getByRole('button', { name: '新增頁面' }).click();
  await page.getByRole('textbox', { name: '頁面名稱' }).fill(boardName);
  await page.getByRole('button', { name: '確認' }).click();
}

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
  await expect(page.getByRole('heading', { name: '首頁' })).toBeVisible();
});

test('新增 Grid 按鈕時可上傳圖片並在 reload 後保留', async ({ page }) => {
  await enterEditMode(page);
  await createGridBoard(page, '圖片按鈕頁');

  await page.getByRole('button', { name: '新增按鈕' }).click();
  await page.getByRole('textbox', { name: '按鈕文字', exact: true }).fill('茶杯');
  await page.getByLabel('按鈕圖片').setInputFiles('public/images/scenes/living-room.png');
  await expect(page.getByAltText('茶杯圖片預覽')).toBeVisible();
  await page.getByRole('button', { name: '確認' }).click();

  await expect(page.getByRole('button', { name: '茶杯' }).locator('img.button-image')).toBeVisible();

  await page.reload();
  await page.getByLabel('主導航').getByRole('button', { name: '圖片按鈕頁' }).click();
  await expect(page.getByRole('button', { name: '茶杯' }).locator('img.button-image')).toBeVisible();
});

test('新增頁面時可上傳首頁入口圖片並在 reload 後保留', async ({ page }) => {
  await enterEditMode(page);
  await page.getByRole('button', { name: '新增頁面' }).click();
  await page.getByRole('textbox', { name: '頁面名稱' }).fill('早餐頁');
  await page.getByLabel('頁面入口圖片').setInputFiles('public/images/scenes/living-room.png');
  await expect(page.getByAltText('早餐頁圖片預覽')).toBeVisible();
  await page.getByRole('button', { name: '確認' }).click();

  await page.getByRole('button', { name: '回首頁' }).click();
  await expect(page.getByRole('button', { name: '早餐頁' }).locator('img.button-image')).toBeVisible();

  await page.reload();
  await expect(page.getByRole('button', { name: '早餐頁' }).locator('img.button-image')).toBeVisible();
});

test('編輯既有按鈕時可新增與移除圖片', async ({ page }) => {
  await enterEditMode(page);
  await createGridBoard(page, '編輯圖片頁');

  await page.getByRole('button', { name: '新增按鈕' }).click();
  await page.getByRole('textbox', { name: '按鈕文字', exact: true }).fill('報紙');
  await page.getByRole('button', { name: '確認' }).click();

  const button = page.getByRole('button', { name: '報紙' });
  await button.click();
  await page.getByLabel('按鈕圖片').setInputFiles('public/images/scenes/living-room.png');
  await page.getByRole('button', { name: '確認' }).click();
  await expect(button.locator('img.button-image')).toBeVisible();

  await button.click();
  await page.getByRole('button', { name: '移除圖片' }).click();
  await page.getByRole('button', { name: '確認' }).click();

  await expect(button.locator('img.button-image')).toHaveCount(0);
});

test('編輯頁面時可新增與移除首頁入口圖片', async ({ page }) => {
  await enterEditMode(page);
  await createGridBoard(page, '入口圖頁');

  await page.getByRole('button', { name: '編輯頁面名稱' }).click();
  await page.getByLabel('頁面入口圖片').setInputFiles('public/images/scenes/living-room.png');
  await page.getByRole('button', { name: '確認' }).click();

  await page.getByRole('button', { name: '回首頁' }).click();
  const entryButton = page.locator('.grid-container').getByRole('button', { name: '入口圖頁' });
  await expect(entryButton.locator('img.button-image')).toBeVisible();

  await page.getByLabel('主導航').getByRole('button', { name: '入口圖頁' }).click();
  await page.getByRole('button', { name: '編輯頁面名稱' }).click();
  await page.getByRole('button', { name: '移除圖片' }).click();
  await page.getByRole('button', { name: '確認' }).click();

  await page.getByRole('button', { name: '回首頁' }).click();
  await expect(entryButton.locator('img.button-image')).toHaveCount(0);
});
