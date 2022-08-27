import type { PageLoad } from './$types';

export const load: PageLoad = async ({ setHeaders }) => {
  setHeaders({
    'cache-control': `public, max-age=${60 * 60 * 24}`
  });
};
