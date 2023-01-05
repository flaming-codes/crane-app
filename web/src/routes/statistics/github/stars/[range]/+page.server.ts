import { typeAheadTuples } from '$lib/db/model';
import {
  fetchReposByStars,
  githubTrendRanges,
  mapRangeToLabel
} from '$lib/statistics/models/github';
import type { PageServerLoad } from '.svelte-kit/types/src/routes/$types';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params, setHeaders }) => {
  setHeaders({
    'Cache-Control': 's-maxage=3600, stale-while-revalidate=7200'
  });

  // @ts-expect-error Range not picked up by type inference.
  const range: typeof githubTrendRanges[number] = params.range;

  if (!githubTrendRanges.includes(range)) {
    throw error(401, `Invalid range: ${range}`);
  }

  const { items } = await fetchReposByStars({ range });
  const packageNames = await typeAheadTuples();

  // Validate the github repos against the package names
  // to determine if they are available on CRAN/E.
  const enhancedItems = items.map((item) => {
    const next = { ...item, crane: { packageSlug: '' } };
    const pkg = packageNames.find((pkg) => pkg.id === item.original.name);
    if (pkg) {
      next.crane.packageSlug = pkg.slug;
    }
    return next;
  });

  return {
    items: enhancedItems,
    ranges: githubTrendRanges,
    selectedRange: range,
    selectedRangeLabel: mapRangeToLabel(range)
  };
};
