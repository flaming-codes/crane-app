import { json } from '@sveltejs/kit';
import {
  packagesOverviewDb,
  packagesOverview,
  authorsOverview,
  authorsOverviewDb
} from '$lib/db/model';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async (ctx) => {
  const query = ctx.url.searchParams.get('q') as string;
  const isAll = ctx.url.searchParams.get('all') === 'true';
  const page = Number.parseInt(ctx.url.searchParams.get('page') || '0', 10);
  const size = Number.parseInt(ctx.url.searchParams.get('size') || '50', 10);

  const startIndex = page * size;
  const endIndex = (page + 1) * size;
  if (isAll) {
    const packages = await packagesOverview();
    const hits = packages.slice(startIndex, endIndex);

    // Max 6 authors to display.
    const authors = (await authorsOverview()).slice(0, 6);

    return json({
      hits,
      total: packages.length,
      page,
      size,
      isEnd: hits.length < size,
      authors
    });
  }

  const packageHits = (await packagesOverviewDb()).search(query);
  const packagePartialHits = packageHits.slice(startIndex, endIndex).map(({ item }) => item);

  const authors = (await authorsOverviewDb())
    .search(query)
    .map(({ item }) => item)
    .slice(0, 6);

  return json({
    hits: packagePartialHits,
    total: packageHits.length,
    page,
    size,
    isEnd: packagePartialHits.length < size,
    authors
  });
};
