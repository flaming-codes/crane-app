import { authors, overview } from '$lib/db/model';
import type { PageServerLoad } from '.svelte-kit/types/src/routes/$types';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
  const { id } = params as { id: string };
  const data = await authors();

  console.log({ length: Object.keys(data).length });

  const packageNames = data[id];

  if (!packageNames) {
    throw error(404, id);
  }

  const overviewData = await overview();
  const packages = packageNames
    .map((name) => overviewData.find((p) => p.name === name)!)
    .filter(Boolean);

  return { id, packages };
};
