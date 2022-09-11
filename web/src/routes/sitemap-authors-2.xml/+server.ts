import { authors } from '$lib/db/model';
import { handler } from '$lib/sitemap/handler';
import { composeUrlElement, getTodayLastmod } from '$lib/sitemap/model';
import type { RequestHandler } from '@sveltejs/kit';

export const prerender = true;

export const GET: RequestHandler = handler({
  page: 2,
  promisedItems: authors().then((record) => Object.keys(record)),
  mapper: (name) =>
    composeUrlElement({
      path: `/author/${encodeURIComponent(name)}`,
      lastmod: getTodayLastmod(),
      priority: 0.8
    })
});
