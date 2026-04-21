import { expect, test } from '@playwright/test';
import { expectSpeechCall, prepareFreshApp } from './helpers/browserState';

test.beforeEach(async ({ page }) => {
  await prepareFreshApp(page);
  await page.goto('/');
  await expect(page.getByRole('heading', { name: '首頁' })).toBeVisible();
});

test('primary hierarchy categories switch to valid boards', async ({ page }) => {
  const nav = page.getByRole('navigation', { name: '主導航' });
  const categories = [
    { label: '住家', heading: '住家', view: '.vsd-view' },
    { label: '家人', heading: '家人', view: '.grid-view[data-board-theme="family"]' },
    { label: '醫療', heading: '醫療', view: '.grid-view[data-board-theme="medical"]' },
    { label: '地點', heading: '地點', view: '.grid-view[data-board-theme="places"]' },
  ];

  for (const category of categories) {
    await nav.getByRole('button', { name: category.label }).click();
    await expect(page.getByRole('heading', { name: category.heading })).toBeVisible();
    await expect(page.locator(category.view)).toBeVisible();
    await expect(nav.getByRole('button', { name: category.label })).toHaveAttribute(
      'aria-current',
      'page'
    );
  }
});

test('grid buttons speak their configured vocalization', async ({ page }) => {
  await page.getByRole('navigation', { name: '主導航' }).getByRole('button', { name: '家人' }).click();

  await page.locator('.grid-container').getByRole('button', { name: '兒子' }).click();

  await expectSpeechCall(page, '兒子');
});

test('vsd hotspots speak their configured vocalization', async ({ page }) => {
  await page.getByRole('navigation', { name: '主導航' }).getByRole('button', { name: '住家' }).click();

  await page.getByRole('button', { name: '我想看電視' }).click();

  await expectSpeechCall(page, '我想看電視');
});

test('back and home controls keep hierarchy history predictable', async ({ page }) => {
  const nav = page.getByRole('navigation', { name: '主導航' });

  await nav.getByRole('button', { name: '住家' }).click();
  await nav.getByRole('button', { name: '家人' }).click();
  await expect(page.getByRole('heading', { name: '家人' })).toBeVisible();

  await nav.getByRole('button', { name: '返回上一頁' }).click();
  await expect(page.getByRole('heading', { name: '住家' })).toBeVisible();

  await nav.getByRole('button', { name: '回首頁' }).click();
  await expect(page.getByRole('heading', { name: '首頁' })).toBeVisible();
  await expect(nav.getByRole('button', { name: '返回上一頁' })).toBeHidden();
});
