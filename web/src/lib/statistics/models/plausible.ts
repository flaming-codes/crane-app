const base = 'https://plausible.io/api/v1/stats';
const siteId = import.meta.env.VITE_PLAUSIBLE_SITE_ID;
const token = import.meta.env.VITE_PLAUSIBLE_API_KEY;

function composeRequest(fetch: Fetch, url: string, params: Record<string, string>) {
  const query = Object.entries(params)
    .map(([key, value]) => `${key}=${value}`)
    .join('&');
  return fetch(`${url}?${query}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
}

export async function getTopPages(
  fetch: Fetch
): Promise<{ results: Array<{ page: string; visitors: number }> }> {
  const res = await composeRequest(fetch, `${base}/breakdown`, {
    site_id: siteId,
    period: 'day',
    property: 'event:page'
  });

  if (!res.ok) {
    throw new Error('Failed to fetch top pages');
  }

  return res.json();
}
