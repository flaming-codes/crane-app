import { json } from '@sveltejs/kit';
import { typeAheadTuples } from '$lib/db/model';
import type { RequestHandler } from './$types';

/**
 * !IMPORTANT: This function is only called in dev, on prod it's intercepted in src/service-worker.ts
 *
 * @param ctx
 * @returns
 */
export const GET: RequestHandler = async (ctx) => {
  const q = ctx.url.searchParams.get('q') as string;
  const offset = parseInt(ctx.url.searchParams.get('offset') as string, 10);

  const items = await typeAheadTuples();
  const hits = items.filter(({ id }) => id.startsWith(q));
  const i = offset % hits.length;
  const hit = hits[i] || {};

  return json(hit);
};
