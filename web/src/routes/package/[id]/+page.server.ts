import { select } from '$lib/db/model';
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

  return {
    item
  };
};
