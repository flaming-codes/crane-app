import { expect, test } from '@playwright/test';

test('how-to page mounts', async ({ page }) => {
  await page.goto('/how-to');
  expect(await page.textContent('h1')).toBe('How-To');
});
