import type { PageLoad } from './$types';

export const load: PageLoad = async ({ data, setHeaders, fetch }) => {
  setHeaders({
    'cache-control': `public, max-age=${60 * 60 * 24}`
  });

  const weeklyDownloads = await getWeeklyDownloads(fetch);

  return { ...data, weeklyDownloads };
};

async function getWeeklyDownloads(fetch: Parameters<PageLoad>[0]['fetch']) {
  const url = `https://cranlogs.r-pkg.org/downloads/total/last-week/ggplot2`;
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });

  const data = await response.json();
  return data;
}
