import { sitemapTuples } from '$lib/db/model';
import { composeUrlElement } from '$lib/sitemap/model';
import { error, type RequestHandler } from '@sveltejs/kit';

export const prerender = true;

export const GET: RequestHandler = async ({ setHeaders }) => {
  const tuples = await sitemapTuples();

  if (!tuples) {
    throw error(500, 'Failed to fetch sitemap tuples');
  }

  setHeaders({
    'Cache-Control': `max-age=${60 * 60 * 24}`
  });

  return new Response(
    `
        <?xml version="1.0" encoding="UTF-8" ?>
        <urlset
          xmlns="https://www.sitemaps.org/schemas/sitemap/0.9"
          xmlns:xhtml="https://www.w3.org/1999/xhtml"
          xmlns:mobile="https://www.google.com/schemas/sitemap-mobile/1.0"
          xmlns:news="https://www.google.com/schemas/sitemap-news/0.9"
          xmlns:image="https://www.google.com/schemas/sitemap-image/1.1"
          xmlns:video="https://www.google.com/schemas/sitemap-video/1.1"
        >
          ${composeUrlElement({ path: '/', lastmod: '2022-08-20' })}
          ${composeUrlElement({ path: '/about', lastmod: '2022-08-20' })}
          ${composeUrlElement({ path: '/how-to', lastmod: '2022-08-20' })}
          ${tuples
            .map(([slug, lastmod]) =>
              composeUrlElement({ path: `/package/${slug}`, lastmod, priority: 1 })
            )
            .join('\n')}
        </urlset>
      `.trim(),
    {
      headers: {
        'Content-Type': 'application/xml'
      }
    }
  );
};
