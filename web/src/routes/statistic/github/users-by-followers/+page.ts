import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async () => {
  throw redirect(301, '/statistic/github/users-by-followers/24h');
};
