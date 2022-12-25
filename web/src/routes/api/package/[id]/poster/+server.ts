import type { RequestHandler } from '@sveltejs/kit';
import { generateOgPosterImage } from '$lib/seo/model';

export const GET: RequestHandler = async (ctx) => {
  const imageBuffer = await generateOgPosterImage('package', ctx.params.id);
  return new Response(imageBuffer, {
    headers: {
      'Content-Type': 'image/jpeg',
      'Cache-Control': 'public, max-age=86400 s-maxage=86400'
    }
  });
};
