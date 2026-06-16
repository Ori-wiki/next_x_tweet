import AxeBuilder from '@axe-core/playwright';
import { test, expect } from './fixtures';

test('logs in with a demo account', async ({ loginAsJane, page }) => {
  await loginAsJane();

  await expect(page.getByRole('heading', { name: 'Your demo dashboard' })).toBeVisible();
});

test('creates a tweet from the home timeline', async ({ loginAsJane, page }) => {
  await loginAsJane();
  await page.goto('/');

  const content = `E2E tweet ${Date.now()}`;
  await page.getByRole('textbox', { name: 'New tweet' }).fill(content);
  await page.getByRole('button', { name: 'Post tweet' }).click();

  await expect(page.getByText(content)).toBeVisible();
});

test('likes a tweet', async ({ loginAsJane, page }) => {
  await loginAsJane();
  await page.goto('/');

  await page.getByRole('button', { name: /^Like: / }).first().click();

  await expect(page.getByText('Tweet liked.')).toBeVisible();
  await expect(page.getByRole('button', { name: /^Unlike: / }).first()).toBeVisible();
});

test('bookmarks a tweet', async ({ loginAsJane, page }) => {
  await loginAsJane();
  await page.goto('/');

  await page.getByRole('button', { name: /^Bookmark: / }).first().click();

  await expect(page.getByText('Tweet saved to bookmarks.')).toBeVisible();
  await expect(page.getByRole('button', { name: /^Bookmarked: / }).first()).toBeVisible();
});

test('home page has no obvious accessibility violations', async ({ loginAsJane, page }) => {
  await loginAsJane();
  await page.goto('/');

  const results = await new AxeBuilder({ page })
    .disableRules(['color-contrast'])
    .analyze();

  expect(results.violations).toEqual([]);
});
