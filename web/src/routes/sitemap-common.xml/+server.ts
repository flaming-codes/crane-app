import { composeUrlElement, getTodayLastmod } from '$lib/sitemap/model';
import type { RequestHandler } from '@sveltejs/kit';

export const prerender = true;

export const GET: RequestHandler = async () => {
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
};
