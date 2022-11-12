import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('textbox', { name: 'Search' }).click();
  await expect(page).toHaveURL('http://localhost:4173/');

  await page.getByPlaceholder('enter search...').fill('lukas schönmann');
  await expect(page).toHaveURL('http://localhost:4173/#packages');

  await page.getByRole('link', { name: 'Lukas Schönmann 1 package' }).click();
  await expect(page).toHaveURL('http://localhost:4173/author/Lukas%20Sch%C3%B6nmann');
});
