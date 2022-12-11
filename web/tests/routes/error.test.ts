import { expect, test } from '@playwright/test';

test('general purpose error page for missing path mounts', async ({ page }) => {
  await page.goto('/non-existing');
  expect(await page.textContent('h1')).toBe('Not found');
});
