import { sitemapTuples } from '$lib/db/model';
import { handler } from '$lib/sitemap/handler';
import { composePackageUrl } from '$lib/sitemap/model';
import type { RequestHandler } from '@sveltejs/kit';

export const prerender = true;

export const GET: RequestHandler = handler({
  page: 3,
  promisedItems: sitemapTuples(),
  mapper: composePackageUrl
});
