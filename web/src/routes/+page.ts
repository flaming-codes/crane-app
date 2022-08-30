import type { PageLoad } from './$types';

export const load: PageLoad = async ({ data, setHeaders }) => {
  setHeaders({
    'cache-control': `public, max-age=${60 * 60 * 24}`
  });

  return data;
};
