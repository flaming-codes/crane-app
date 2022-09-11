import { error, type RequestHandler } from '@sveltejs/kit';

export const handler =
  <T>(params: {
    page: number;
    promisedItems: Promise<T[]>;
    size?: number;
    mapper: (item: T) => string;
  }): RequestHandler =>
  async () => {
    const { page, promisedItems, size = 10_000, mapper } = params;
    const allTuples = await promisedItems;

    if (!allTuples) {
      throw error(500, 'Failed to fetch sitemap tuples');
    }

    const threshold = page * size;
    const tuples = allTuples.slice(threshold, threshold + size);

    return new Response(
      `<?xml version="1.0" encoding="UTF-8" ?>
        <urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">
        ${tuples.map(mapper).join('')}
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
