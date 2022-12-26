import type { RequestHandler } from '@sveltejs/kit';
import { fetchOgPosterImage } from '$lib/seo/model';

export const GET: RequestHandler = async (ctx) => {
  const imageBuffer = await fetchOgPosterImage('author', ctx.params.id);
  return new Response(imageBuffer, {
    headers: {
      'Content-Type': 'image/jpeg',
      'Cache-Control': 's-maxage=3600, stale-while-revalidate=86400'
    }
  });
};
