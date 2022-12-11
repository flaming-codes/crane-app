import { decodeSitemapSymbols } from '$lib/sitemap/parse';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
  const id = decodeSitemapSymbols(params.id);

  // TODO: fetch category data from API
  const res = false;
  if (!res) {
    throw error(404, id || '-');
  }
  return { id };
};
