import { error } from '@sveltejs/kit';
import licenses from '../../../static/licenses.json';
import type { PageServerLoad } from './$types';

export const prerender = true;

export const load: PageServerLoad = async () => {
  if (!licenses) {
    throw error(404, 'Not found');
  }

  return { licenses };
};
