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
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
  const { id } = params;

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
    contacts
  };
};
