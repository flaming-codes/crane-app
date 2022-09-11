import { authors, overview } from '$lib/db/model';
import { decodeSitemapSymbols } from '$lib/sitemap/parse';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
  const id = decodeSitemapSymbols(params.id);
  const data = await authors();

  const packageNames = data[id];

  if (!packageNames) {
    throw error(404, id);
  }

  const overviewData = await overview();
  const packages = packageNames
    .map((name) => overviewData.find((p) => p.name === name)!)
    .filter(Boolean);

  const otherAuthors = packages
    .map((p) => p.author_names)
    .flat()
    .filter((name, i, arr) => name !== id && arr.indexOf(name) === i);

  const totalOtherAuthors = otherAuthors.length;

  return { id, packages, otherAuthors, totalOtherAuthors };
};
