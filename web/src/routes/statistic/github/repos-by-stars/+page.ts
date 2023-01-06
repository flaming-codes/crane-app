import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async () => {
  throw redirect(301, '/statistic/github/repos-by-stars/6h');
};
