import { packagesOverview } from '$lib/db/model';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
  const page = Number.parseInt(url.searchParams.get('page') || '0', 10);
  const size = Number.parseInt(url.searchParams.get('size') || '50', 10);
  const items = await packagesOverview();
  const hits = items.slice(page * size, (page + 1) * size);

  return {
    initialAll: {
      hits,
      total: items.length,
      page,
      size,
      isEnd: hits.length < size
    }
  };
};
