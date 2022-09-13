import { authors } from '$lib/db/model';
import { handler } from '$lib/sitemap/handler';
import { composeAuthorUrl } from '$lib/sitemap/model';
import type { RequestHandler } from '@sveltejs/kit';

export const prerender = true;

export const GET: RequestHandler = handler({
  page: 3,
  promisedItems: authors().then((record) => Object.keys(record)),
  mapper: composeAuthorUrl
});
