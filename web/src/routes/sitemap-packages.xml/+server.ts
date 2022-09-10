import { sitemapTuples } from '$lib/db/model';
import { composeUrlElement } from '$lib/sitemap/model';
import { error, type RequestHandler } from '@sveltejs/kit';

export const prerender = true;

export const GET: RequestHandler = async () => {
  const tuples = await sitemapTuples();

  if (!tuples) {
    throw error(500, 'Failed to fetch sitemap tuples');
  }

  return new Response(
    `<?xml version="1.0" encoding="UTF-8" ?>
    <urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">
      ${tuples
        .map(([slug, lastmod]) =>
          composeUrlElement({ path: `/package/${slug}`, lastmod, priority: 1 })
        )
        .join('\n')}
    </urlset>`.trim(),
    {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'max-age=0, s-maxage=3600',
        'X-Robots-Tag': 'noindex'
      }
    }
  );
};
