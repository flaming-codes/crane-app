import { githubTrendRanges, fetchUsersByFollowers } from '$lib/statistics/models/github';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, setHeaders }) => {
  setHeaders({
    'Cache-Control': 's-maxage=3600, stale-while-revalidate=7200'
  });

  // @ts-expect-error Range not picked up by type inference.
  const range: typeof githubTrendRanges[number] = params.range;

  if (!githubTrendRanges.includes(range)) {
    throw error(401, `Invalid range: ${range}`);
  }

  const { items } = await fetchUsersByFollowers({ range });

  return {
    items: items.slice(0, 3),
    selectedRange: range
  };
};
