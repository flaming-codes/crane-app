import { sitemapFileChunkSize } from '$lib/sitemap/constants';
import {
  composeUrlElement,
  getTodayLastmod,
  mapComposerToDomain,
  mapDomainToSitemapData
} from '$lib/sitemap/model';
import { githubTrendRanges } from '$lib/statistics/models/github';
import { error, type RequestHandler } from '@sveltejs/kit';

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
  const { params, fetch } = props;
  const { slug } = params;

  if (slug === 'sitemap-common.xml') {
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
          'Cache-Control': 'public, max-age=3600, s-maxage=3600'
        }
      }
    );
  }

  if (slug === 'sitemap-statistic.xml') {
    const today = getTodayLastmod();

    return new Response(
      `<?xml version="1.0" encoding="UTF-8" ?>
      <urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">
          ${['repos-by-stars', 'users-by-followers'].map((domain) =>
            githubTrendRanges
              .map((range) =>
                composeUrlElement({
                  path: `/statistic/github/${domain}/${range}`,
                  lastmod: today,
                  changefreq: 'daily'
                })
              )
              .join('')
          )}
      </urlset>`.trim(),
      {
        headers: {
          'Content-Type': 'application/xml',
          'Cache-Control': 'public, max-age=3600, s-maxage=3600'
        }
      }
    );
  }

  if (slug?.startsWith('sitemap-')) {
    const domain = slug.split('-')[1];
    const page = parseInt(slug.split('-')[2], 10);

    const mapper = mapComposerToDomain(domain);
    const allTuples = await mapDomainToSitemapData(fetch, domain);

    if (!allTuples) {
      throw error(500, 'Failed to fetch sitemap tuples');
    }

    const threshold = page * sitemapFileChunkSize;
    const tuples = allTuples.slice(threshold, threshold + sitemapFileChunkSize);

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
          'Cache-Control': 'public, max-age=3600, s-maxage=3600'
        }
      }
    );
  }

  // All static routes (i.e. files) take precedence over dynamic routes,
  // so we can safely assume that the request is for a dynamic route only.
  throw error(404, 'Not found');
};
