import { authors } from '$lib/db/model';
import { composeUrlElement } from '$lib/sitemap/model';
import { error, type RequestHandler } from '@sveltejs/kit';

export const prerender = true;

export const GET: RequestHandler = async () => {
  const data = await authors();

  if (!data) {
    throw error(500, 'Failed to fetch sitemap tuples');
  }

  const today = new Date().toISOString().slice(0, 10);

  return new Response(
    `<?xml version="1.0" encoding="UTF-8" ?>
    <urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">
      ${Object.keys(data)
        .map((name) => {
          const slug = encodeURIComponent(name);
          return composeUrlElement({ path: `/author/${slug}`, lastmod: today, priority: 0.8 });
        })
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
