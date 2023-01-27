import { select } from '$lib/db/model';
import type { Pkg } from '$lib/package/type';
import { decodeSitemapSymbols } from '$lib/sitemap/parse';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, fetch }) => {
  const id = decodeSitemapSymbols(params.id);

  let item: Pkg | undefined;

  try {
    item = await select(fetch, { id });
  } catch (reason) {
    console.error(reason);
  }

  if (!item) {
    throw error(404, id);
  }

  return {
    name: item.name,
    title: item.title
  };
};
