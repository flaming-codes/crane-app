import { getTopPages } from '$lib/statistics/models/plausible';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ setHeaders, fetch }) => {
  setHeaders({ 'Cache-Control': 's-maxage=60, stale-while-revalidate=180' });

  try {
    const { results } = await getTopPages(fetch);
    console.log(results);

    const grouped: Record<'author' | 'package', Array<(typeof results)[number]>> = {
      author: [],
      package: []
    };

    results.forEach((item) => {
      const domain = item.page.indexOf('/author/') === 0 ? 'author' : 'package';
      if (!grouped[domain]) {
        grouped[domain] = [];
      }
      grouped[domain].push(item);
    });

    return { grouped };
  } catch (e) {
    throw error(500, 'Failed to fetch top pages');
  }
};
