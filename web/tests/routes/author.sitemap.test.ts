import { expect, test } from '@playwright/test';
// @ts-expect-error Issue w/ PW right now.
import { fetchAuthors } from '../utils.ts';

test('authors sitemap threshold', async () => {
  // Current threshold that defines how many sitemap files to generate.
  // If this test fails, add a new sitemap and increment the threshold.
  // Increment should be 10k.
  const threshold = 30_000;
  const record = await fetchAuthors();
  expect(Object.keys(record).length).toBeLessThan(threshold);
});
