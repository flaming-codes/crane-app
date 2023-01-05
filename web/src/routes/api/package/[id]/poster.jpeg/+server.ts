import { error, type RequestHandler } from '@sveltejs/kit';
import { fetchOgPosterImage } from '$lib/seo/model';

export const GET: RequestHandler = async (ctx) => {
  if (!ctx.params.id) {
    throw error(400, 'Missing package id');
  }

  const imageBuffer = await fetchOgPosterImage('package', ctx.params.id);

  // 1 week.
  const cacheThreshold = 60 * 60 * 24 * 7;

  return new Response(imageBuffer, {
    headers: {
      'Content-Type': 'image/jpeg',
      'Cache-Control': `s-maxage=${cacheThreshold}, stale-while-revalidate=${cacheThreshold + 60}`
    }
  });
};
