import { expect, test } from '@playwright/test';

test('about page mounts', async ({ page }) => {
  await page.goto('/about');
  expect(await page.textContent('h1')).toBe('About');
});
