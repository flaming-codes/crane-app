import { expect, test } from '@playwright/test';

test('binary page mounts', async ({ page }) => {
  await page.goto('/binary');
  expect(await page.textContent('h1')).toBe('R Binary');
});
