import { fetchReposByStars } from '$lib/statistics/models/github';
import type { PageServerLoad } from '.svelte-kit/types/src/routes/$types';

export const load: PageServerLoad = async ({ setHeaders, fetch }) => {
  setHeaders({
    'Cache-Control': 's-maxage=3600, stale-while-revalidate=86400'
  });

  return fetchReposByStars({ range: '6h' });
};
