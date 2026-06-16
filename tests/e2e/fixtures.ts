import { execSync } from 'node:child_process';
import { expect, test as base, type Page } from '@playwright/test';

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

interface Fixtures {
  loginAsJane: () => Promise<void>;
}

export const test = base.extend<Fixtures>({
  loginAsJane: async ({ page }, applyFixture) => {
    await applyFixture(() => loginAsJane(page));
  },
});

test.beforeEach(() => {
  resetDatabase();
});

export { expect };
