import {
  composeUrlElement,
  getTodayLastmod,
  mapComposerToDomain,
  mapDomainToSitemapData
} from '$lib/sitemap/model';
import { error, type RequestHandler } from '@sveltejs/kit';

export const prerender = true;

/**
 * This is a catch-all for the single-slug routes that
 * are not handled by the other, explicitly named  routes.
 *
 * For example, the route /how-to is handled by the code
 * in /routes/how-to/*.
 *
 * This server-handler is only used to dynamically create
 * all sitemap files except the sitemap-index file, which
 * is defined in /routes/sitemap-index/+server.ts.
 */
export const GET: RequestHandler = async (props) => {
  const { params } = props;
  const { slug } = params;

  if (slug === 'sitemap-common') {
    const today = getTodayLastmod();

    return new Response(
      `<?xml version="1.0" encoding="UTF-8" ?>
      <urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">
          ${composeUrlElement({ path: '', lastmod: today })}
          ${composeUrlElement({ path: '/about', lastmod: '2022-08-20', changefreq: 'monthly' })}
          ${composeUrlElement({ path: '/how-to', lastmod: '2022-08-20', changefreq: 'monthly' })}
      </urlset>`.trim(),
      {
        headers: {
          'Content-Type': 'application/xml',
          'Cache-Control': 'max-age=0, s-maxage=3600',
          'X-Robots-Tag': 'noindex'
        }
      }
    );
  }

  if (slug?.startsWith('sitemap-')) {
    const domain = slug.split('-')[1];
    const page = parseInt(slug.split('-')[2], 10);
    const size = 5_000;
    console.log('domain', domain, 'page', page, 'size', size);

    const mapper = mapComposerToDomain(domain);
    const allTuples = await mapDomainToSitemapData(domain);

    if (!allTuples) {
      throw error(500, 'Failed to fetch sitemap tuples');
    }

    const threshold = page * size;
    const tuples = allTuples.slice(threshold, threshold + size);

    return new Response(
      `<?xml version="1.0" encoding="UTF-8" ?><urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">${tuples
        .map(
          // @ts-expect-error 'mapper' and 'allTuples' will match.
          mapper
        )
        .join('')}</urlset>`.trim(),
      {
        headers: {
          'Content-Type': 'application/xml',
          'Cache-Control': 'public, max-age=3600, s-maxage=3600',
          'X-Robots-Tag': 'noindex'
        }
      }
    );
  }

  throw error(404, 'Not found');
};
