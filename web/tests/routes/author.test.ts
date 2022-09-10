import { expect, test } from '@playwright/test';

test('specific author page mounts', async ({ page }) => {
  await page.goto('/author/Lukas%20Schönmann');
  expect(await page.textContent('h1')).toBe('Lukas Schönmann');
});
