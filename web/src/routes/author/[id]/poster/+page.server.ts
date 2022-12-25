import { authors } from '$lib/db/model';
import { decodeSitemapSymbols } from '$lib/sitemap/parse';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
  const id = decodeSitemapSymbols(params.id);
  const data = await authors();

  const authorData = data[id];

  if (!authorData) {
    throw error(404, id);
  }

  // TODO: simplify once the migration is done.
  const packageNames = 'packages' in authorData ? authorData.packages : authorData;

  return {
    id,
    packageNames
  };
};
