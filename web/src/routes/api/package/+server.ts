import { json } from '@sveltejs/kit';
import { db, overview } from '$lib/db/model';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async (ctx) => {
  const query = ctx.url.searchParams.get('q') as string;
  const isAll = ctx.url.searchParams.get('all') === 'true';
  const page = Number.parseInt(ctx.url.searchParams.get('page') || '0', 10);
  const size = Number.parseInt(ctx.url.searchParams.get('size') || '50', 10);

  const startIndex = page * size;
  const endIndex = (page + 1) * size;
  if (isAll) {
    const items = await overview();
    const hits = items.slice(startIndex, endIndex);

    return json({
      hits,
      total: items.length,
      page,
      size,
      isEnd: hits.length < size
    });
  }

  const fuse = await db();
  const hits = fuse.search(query);
  const partialHits = hits.slice(startIndex, endIndex).map(({ item }) => item);

  return json({
    hits: partialHits,
    total: hits.length,
    page,
    size,
    isEnd: partialHits.length < size
  });
};
