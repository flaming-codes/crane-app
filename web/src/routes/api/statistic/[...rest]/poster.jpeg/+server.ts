import { error, type RequestHandler } from '@sveltejs/kit';
import { fetchOgPosterImage } from '$lib/seo/model';

export const GET: RequestHandler = async ({ params }) => {
  if (!params.rest) {
    throw error(400, 'Missing path fragments');
  }

  const imageBuffer = await fetchOgPosterImage('statistic', ...params.rest.split('/'));
  return new Response(imageBuffer, {
    headers: {
      'Content-Type': 'image/jpeg',
      'Cache-Control': 's-maxage=60, stale-while-revalidate=3600'
    }
  });
};
