import { execSync } from 'node:child_process';
import { test, expect, type Page } from '@playwright/test';

const testDatabaseUrl = 'file:./e2e.db';

function resetDatabase() {
  execSync('npm run db:push', {
    env: {
      ...process.env,
      DATABASE_URL: testDatabaseUrl,
    },
    stdio: 'ignore',
  });

  execSync('npm run db:seed', {
    env: {
      ...process.env,
      DATABASE_URL: testDatabaseUrl,
    },
    stdio: 'ignore',
  });
}

async function loginAsJane(page: Page) {
  await page.goto('/');
  await page.getByRole('button', { name: 'Choose demo role' }).click();
  await page.getByRole('button', { name: /Jane Dev/ }).click();
  await expect(page).toHaveURL(/\/dashboard$/);
}

test.beforeEach(() => {
  resetDatabase();
});

test('logs in with a demo account', async ({ page }) => {
  await loginAsJane(page);

  await expect(page.getByRole('heading', { name: 'Your demo dashboard' })).toBeVisible();
});

test('creates a tweet from the home timeline', async ({ page }) => {
  await loginAsJane(page);
  await page.goto('/');

  const content = `E2E tweet ${Date.now()}`;
  await page.getByRole('textbox', { name: 'New tweet' }).fill(content);
  await page.getByRole('button', { name: 'Post tweet' }).click();

  await expect(page.getByText(content)).toBeVisible();
});

test('likes a tweet', async ({ page }) => {
  await loginAsJane(page);
  await page.goto('/');

  await page.getByRole('button', { name: /^Like: / }).first().click();

  await expect(page.getByText('Tweet liked.')).toBeVisible();
  await expect(page.getByRole('button', { name: /^Unlike: / }).first()).toBeVisible();
});

test('bookmarks a tweet', async ({ page }) => {
  await loginAsJane(page);
  await page.goto('/');

  await page.getByRole('button', { name: /^Bookmark: / }).first().click();

  await expect(page.getByText('Tweet saved to bookmarks.')).toBeVisible();
  await expect(page.getByRole('button', { name: /^Bookmarked: / }).first()).toBeVisible();
});
