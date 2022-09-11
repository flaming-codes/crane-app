import { expect, test } from '@playwright/test';
// @ts-expect-error Issue w/ PW right now.
import { fetchOverviewItems } from '../utils.ts';

test('package sitemap threshold', async () => {
  // Current threshold that defines how many sitemap files to generate.
  // If this test fails, add a new sitemap and increment the threshold.
  // Increment should be 10k.
  const threshold = 20_000;
  const items = await fetchOverviewItems();
  expect(items.length).toBeLessThan(threshold);
});
