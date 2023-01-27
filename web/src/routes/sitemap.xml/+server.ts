import { sitemapFileChunkSize } from '$lib/sitemap/constants';
import { mapDomainToSitemapData } from '$lib/sitemap/model';
import type { RequestHandler } from '@sveltejs/kit';

export const prerender = true;

export const GET: RequestHandler = async () => {
  const [packagesSize, authorsSize] = await Promise.all([
    mapDomainToSitemapData(fetch, 'packages'),
    mapDomainToSitemapData(fetch, 'authors')
  ]).then((items) => {
    return items.map((item) => Math.ceil(item.length / sitemapFileChunkSize));
  });

  return new Response(
    `<?xml version="1.0" encoding="UTF-8" ?>
    <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      <sitemap>
        <loc>https://www.cran-e.com/sitemap-common.xml</loc>
      </sitemap>
      <sitemap>
        <loc>https://www.cran-e.com/sitemap-statistic.xml</loc>
      </sitemap>
      ${Array.from(
        { length: packagesSize },
        (_, i) => `
        <sitemap>
          <loc>https://www.cran-e.com/sitemap-packages-${i}.xml</loc>
        </sitemap>`
      ).join('')}
         ${Array.from(
           { length: authorsSize },
           (_, i) => `
        <sitemap>
          <loc>https://www.cran-e.com/sitemap-authors-${i}.xml</loc>
        </sitemap>`
         ).join('')}
    </sitemapindex>`.trim(),
    {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'max-age=3600, s-maxage=3600'
      }
    }
  );
};
