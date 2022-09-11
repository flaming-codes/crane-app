import { sitemapTuples } from '$lib/db/model';
import { handler } from '$lib/sitemap/handler';
import { composeUrlElement } from '$lib/sitemap/model';
import type { RequestHandler } from '@sveltejs/kit';

export const prerender = true;

export const GET: RequestHandler = handler({
  page: 0,
  promisedItems: sitemapTuples(),
  mapper: ([slug, lastmod]) => composeUrlElement({ path: `/package/${slug}`, lastmod, priority: 1 })
});
