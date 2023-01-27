import { authors, packagesOverview } from '$lib/db/model';
import { decodeSitemapSymbols } from '$lib/sitemap/parse';
import { error } from '@sveltejs/kit';
import { differenceInCalendarDays } from 'date-fns';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, fetch }) => {
  const id = decodeSitemapSymbols(params.id);
  const data = await authors(fetch);

  const authorData = data[id];

  if (!authorData) {
    throw error(404, id);
  }

  const overviewData = await packagesOverview(fetch);
  // TODO: simplify once the migration is done.
  const packageNames = 'packages' in authorData ? authorData.packages : authorData;
  const packages = packageNames
    .map((name) => overviewData.find((p) => p.name === name)!)
    .filter(Boolean);

  const otherAuthors = packages
    .map((p) => p.author_names)
    .flat()
    .filter((name, i, arr) => name !== id && arr.indexOf(name) === i);

  const totalOtherAuthors = otherAuthors.length;

  // TODO: move to data-generation.
  const events: Record<string, [{ day: string; month: string; type: string }]> = {
    'Lukas Schönmann': [{ day: '04', month: '11', type: 'birthday' }]
  };
  // TODO: Fatal flaw: this will use the server-time as the current time.
  const now = new Date();
  const activeEventType = events[id]?.find(
    ({ day, month }) =>
      Math.abs(differenceInCalendarDays(now, new Date(`${now.getFullYear()}-${month}-${day}`))) <= 2
  )?.type;

  return {
    id,
    packages,
    otherAuthors,
    totalOtherAuthors,
    links: 'links' in authorData ? authorData.links : [],
    activeEventType
  };
};
