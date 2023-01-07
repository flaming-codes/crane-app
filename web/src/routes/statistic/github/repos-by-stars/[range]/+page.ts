import { fetchReposByStars, githubTrendRanges } from '$lib/statistics/models/github';
import type { PageLoad } from '.svelte-kit/types/src/routes/$types';
import { error } from '@sveltejs/kit';

export const load: PageLoad = async ({ params, setHeaders }) => {
  setHeaders({
    'Cache-Control': 's-maxage=3600, stale-while-revalidate=7200'
  });

  // @ts-expect-error Range not picked up by type inference.
  const range: typeof githubTrendRanges[number] = params.range;

  if (!githubTrendRanges.includes(range)) {
    throw error(401, `Invalid range: ${range}`);
  }

  const { items } = await fetchReposByStars({ range });

  return {
    items,
    ranges: githubTrendRanges,
    selectedRange: range
  };
};
