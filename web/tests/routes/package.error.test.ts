import { expect, test } from '@playwright/test';

test('error-page for a non-existing package mounts', async ({ page }) => {
  await page.goto('/package/non-existing');
  expect(await page.textContent('h1')).toBe('Not found');
});
