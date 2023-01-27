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
import { decodeSitemapSymbols } from '$lib/sitemap/parse';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getDownloadsWithTrends } from '$lib/package/models/downloads';

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

  const overviewTuples = parseOverviewTuples(item);
  const maintainer = parseMaintainer(item);
  const materials = parseMaterials(item);
  const aboutItems = parseAboutItems(item);
  const contacts = parseContacts(item);

  item.macos_binaries = parseMacOsBinaries(item);
  item.windows_binaries = parseWindowsBinaries(item);

  // Replace the stringified DOIs with links.
  const doiRegex = /<doi:([^>]+)>/g;
  item.description = item.description.replace(
    doiRegex,
    '<a href="https://doi.org/$1" target="_blank" alt="Link to DOI $1">doi:$1</a>'
  );

  const downloads = await getDownloadsWithTrends(item);

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
