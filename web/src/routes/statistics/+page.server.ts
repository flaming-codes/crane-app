import { getReposByStars } from '$lib/statistics/models/github';
import type { PageServerLoad } from '.svelte-kit/types/src/routes/$types';

export const load: PageServerLoad = async ({ setHeaders }) => {
  const octo = getReposByStars();

  setHeaders({
    'Cache-Control': 's-maxage=3600, stale-while-revalidate=86400'
  });

  return {
    octo
  };
};
