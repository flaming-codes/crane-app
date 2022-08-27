import { expect, test } from '@playwright/test';
// @ts-expect-error Issue w/ PW right now.
import { fetchOverviewItems, split } from '../utils.ts';

test('package details pages mount', async ({ page }) => {
  test.setTimeout(80_000_000);

  const splits = split(await fetchOverviewItems(), { chunks: 4 });

  const chunksIndex = 0;
  const items = splits[chunksIndex];

  let i = 0;
  let lastPct = 0;

  for (const [_, name] of items) {
    await page.goto('/package/' + name);
    expect(await page.textContent('h1')).toBe(name);

    const pct = Math.round((i / items.length) * 100);
    if (pct !== lastPct) {
      console.log(`[${chunksIndex}]: ${pct}%`);
      lastPct = pct;
    }

    i++;
  }
});
