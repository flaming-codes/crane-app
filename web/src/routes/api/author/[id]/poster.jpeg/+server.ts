import { error, type RequestHandler } from '@sveltejs/kit';
import { fetchOgPosterImage } from '$lib/seo/model';

export const GET: RequestHandler = async (ctx) => {
  if (!ctx.params.id) {
    throw error(400, 'Missing author id');
  }

  const imageBuffer = await fetchOgPosterImage(ctx.fetch, 'author', ctx.params.id);
  return new Response(imageBuffer, {
    headers: {
      'Content-Type': 'image/jpeg',
      'Cache-Control': 's-maxage=3600, stale-while-revalidate=86400'
    }
  });
};
