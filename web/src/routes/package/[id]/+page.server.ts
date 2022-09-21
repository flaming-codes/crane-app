import { select } from '$lib/db/model';
import {
  parseOverviewTuples,
  parseMaintainer,
  parseMaterials,
  parseAboutItems,
  parseContacts,
  parseDependencies,
  parseMacOsBinaries,
  parseWindowsBinaries
} from '$lib/package/models/parse';
import type { Pkg } from '$lib/package/type';
import { getPackageDownloadsLastNDays } from '$lib/statistics/models/cran';
import { decodeSitemapSymbols } from '$lib/sitemap/parse';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
  const id = decodeSitemapSymbols(params.id);

  let item: Pkg | undefined;

  try {
    item = await select({ id });
  } catch (reason) {
    console.error(reason);
  }

  if (!item) {
    throw error(404, id);
  }

  const overviewTuples = parseOverviewTuples(item);
  const maintainer = parseMaintainer(item);
  const materials = parseMaterials(item);
  const aboutItems = parseAboutItems(item);
  const contacts = parseContacts(item);

  item.macos_binaries = parseMacOsBinaries(item);
  item.windows_binaries = parseWindowsBinaries(item);

  const getDownloads = async (days: number) => {
    const res = await getPackageDownloadsLastNDays({ name: item!.name, days });
    return res?.[0]?.downloads;
  };

  // Fetch all statistics in parallel.
  const statistics = await Promise.all([
    getDownloads(1),
    getDownloads(7),
    getDownloads(30),
    getDownloads(90),
    getDownloads(365)
  ]);

  // Aggregate the statistics into a single object.
  const downloads = [
    { value: statistics[0], label: 'Last 24 hours' },
    { value: statistics[1], label: 'Last 7 days' },
    { value: statistics[2], label: 'Last 30 days' },
    { value: statistics[3], label: 'Last 90 days' },
    { value: statistics[4], label: 'Last 365 days' }
  ];

  const dependencyGroups = [
    'depends',
    'imports',
    'suggests',
    'enhances',
    'linkingto',
    'reverse_depends',
    'reverse_imports',
    'reverse_suggests',
    'reverse_enhances',
    'reverse_linkingto'
  ] as const;

  dependencyGroups.forEach((key) => {
    if (item && item[key]) {
      item[key] = parseDependencies(item[key]!);
    }
  });

  return {
    item,
    overviewTuples,
    maintainer,
    materials,
    aboutItems,
    contacts,
    downloads
  };
};
