import { json } from '@sveltejs/kit';
import { typeAheadTuples } from '$lib/db/model';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ setHeaders, fetch }) => {
  const items = await typeAheadTuples(fetch);

  setHeaders({
    'Cache-Control': `max-age=${60 * 60 * 4}`
  });

  return json({
    items
  });
};
