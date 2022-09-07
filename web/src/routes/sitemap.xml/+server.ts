import { sitemapTuples } from '$lib/db/model';
import { composeUrlElement } from '$lib/sitemap/model';
import { error, type RequestHandler } from '@sveltejs/kit';

export const prerender = true;

export const GET: RequestHandler = async () => {
  const tuples = await sitemapTuples();

  if (!tuples) {
    throw error(500, 'Failed to fetch sitemap tuples');
  }

  const encodeXML = (source: string) =>
    source
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');

  return new Response(
    encodeXML(`
    <?xml version="1.0" encoding="UTF-8" ?>
    <urlset
      xmlns="https://www.sitemaps.org/schemas/sitemap/0.9"
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
  `).trim(),
    {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'max-age=0, s-maxage=3600'
      }
    }
  );
};
