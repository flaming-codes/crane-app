import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('/');

  // Click [aria-label="About this web app"]
  await page.locator('[aria-label="About this web app"]').click();
  await expect(page).toHaveURL('http://localhost:4173/about');

  // Click [aria-label="Latest packages"]
  await page.locator('[aria-label="Latest packages"]').click();
  await expect(page).toHaveURL('http://localhost:4173/');

  // Click [aria-label="Guide for power users"]
  await page.locator('[aria-label="Guide for power users"]').click();
  await expect(page).toHaveURL('http://localhost:4173/how-to');

  // Click [aria-label="Latest packages"]
  await page.locator('[aria-label="Latest packages"]').click();
  await expect(page).toHaveURL('http://localhost:4173/');

  await page.goto('http://localhost:4173/package/xadmix');

  // Click [aria-label="Latest packages"]
  await page.locator('[aria-label="Latest packages"]').click();
  await expect(page).toHaveURL('http://localhost:4173/');

  await page.goto('http://localhost:4173/author/Lukas%20Sch%C3%B6nmann');
  // Click [aria-label="Latest packages"]
  await page.locator('[aria-label="Latest packages"]').click();
  await expect(page).toHaveURL('http://localhost:4173/');
});
