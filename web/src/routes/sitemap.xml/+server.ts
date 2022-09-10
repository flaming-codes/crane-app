import type { RequestHandler } from '@sveltejs/kit';

export const prerender = true;

export const GET: RequestHandler = async () => {
  return new Response(
    `<?xml version="1.0" encoding="UTF-8" ?>
    <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      <sitemap>
        <loc>https://www.cran-e.com/sitemap-common.xml</loc>
      </sitemap>
      <sitemap>
        <loc>https://www.cran-e.com/sitemap-packages.xml</loc>
      </sitemap>
      <sitemap>
        <loc>https://www.cran-e.com/sitemap-authors.xml</loc>
      </sitemap>
    </sitemapindex>`.trim(),
    {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'max-age=0, s-maxage=3600',
        'X-Robots-Tag': 'noindex'
      }
    }
  );
};
