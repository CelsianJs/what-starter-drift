import { expect, test } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import { seedCards } from '../../src/data/projects.js';

test.beforeEach(async ({ page }) => {
  page.consoleErrors = [];
  page.on('console', (message) => {
    if (message.type() === 'error' && !message.text().includes('Failed to load resource: the server responded with a status of 404')) {
      page.consoleErrors.push(message.text());
    }
  });
  page.on('pageerror', (error) => page.consoleErrors.push(error.message));
  await page.addInitScript(() => localStorage.removeItem('what-starter-drift-v1'));
});

test.afterEach(async ({ page }) => {
  expect(page.consoleErrors).toEqual([]);
});

test('moves cards, filters list, exports JSON, records activity, and screenshots', async ({ page }, testInfo) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: /cards first/i })).toBeVisible();

  await page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: 'Planner', exact: true }).click();
  await page.locator('article').filter({ has: page.getByRole('link', { name: 'Outline onboarding tour' }) }).getByRole('button', { name: 'Move right' }).click();
  await page.getByRole('button', { name: 'List' }).click();
  await page.getByLabel('Assignee filter').selectOption('Inez');
  await expect(page.getByRole('link', { name: 'QA mobile list density' })).toBeVisible();

  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export JSON' }).click();
  expect((await download).suggestedFilename()).toBe('drift-planner.json');

  await page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: 'Activity', exact: true }).click();
  await expect(page.getByText(/Moved “Outline onboarding tour” to Active/i)).toBeVisible();

  await page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: 'Home', exact: true }).click();
  await page.waitForTimeout(350);
  mkdirSync('test-results/screenshots', { recursive: true });
  await page.screenshot({ path: `test-results/screenshots/drift-${testInfo.project.name}.png`, fullPage: false });
});

test('supports native drag and every direct card route', async ({ page }) => {
  await page.goto('/planner');
  await page.evaluate(() => {
    const target = document.querySelector('[aria-label="Review column"]');
    const dataTransfer = new DataTransfer();
    dataTransfer.setData('text/plain', 'card-meadow');
    target.dispatchEvent(new DragEvent('dragover', { bubbles: true, dataTransfer }));
    target.dispatchEvent(new DragEvent('drop', { bubbles: true, dataTransfer }));
  });
  await expect(page.getByLabel('Review column').getByRole('link', { name: 'Prototype calendar swimlane' })).toBeVisible();
  for (const card of seedCards) {
    await page.goto(`/cards/${card.id}`);
    await expect(page.getByRole('heading', { name: card.title })).toBeVisible();
  }
});

test('storage-denied browsers keep session edits without crashing', async ({ page }) => {
  await page.addInitScript(() => {
    Storage.prototype.setItem = () => {
      throw new Error('storage denied by test');
    };
  });
  await page.goto('/cards/card-tide');
  await page.getByLabel('Card status').selectOption('review');
  await expect(page.getByText(/not saved in this browser/i)).toBeVisible();
  await page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: 'Activity', exact: true }).click();
  await expect(page.getByText(/Moved “Ship billing settings polish” to Review/i).first()).toBeVisible();
});

test('unknown route renders fallback and keyboard focus works', async ({ page }) => {
  await page.goto('/lost-card');
  await expect(page.getByRole('heading', { name: /drifted away/i })).toBeVisible();
  await page.goto('/planner');
  await page.keyboard.press('Tab');
  await expect(page.locator(':focus')).toBeVisible();
});
