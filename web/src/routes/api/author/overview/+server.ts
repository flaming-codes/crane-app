import { json } from '@sveltejs/kit';
import { authorsOverview, authorsOverviewDb } from '$lib/db/model';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async (ctx) => {
  const query = ctx.url.searchParams.get('q') as string;
  const isAll = ctx.url.searchParams.get('all') === 'true';
  const page = Number.parseInt(ctx.url.searchParams.get('page') || '0', 10);
  const size = Number.parseInt(ctx.url.searchParams.get('size') || '50', 10);

  const startIndex = page * size;
  const endIndex = (page + 1) * size;

  if (isAll) {
    const all = await authorsOverview(ctx.fetch);
    const hits = all.slice(0, 6);

    return json({
      hits,
      total: all.length,
      page,
      size
    });
  }

  const hits = (await authorsOverviewDb(ctx.fetch)).search(query).map(({ item }) => item);

  return json({
    hits: hits.slice(0, 6),
    total: hits.length,
    page,
    size,
    isEnd: hits.length < size
  });
};
