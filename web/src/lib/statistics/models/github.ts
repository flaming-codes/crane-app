import type { GithubTrendItem } from '../types/github';

export const githubTrendRanges = ['6h', '12h', '24h', '48h', '72h', '1w', '2w', '1m'];

export async function fetchReposByStars(params: {
  range: typeof githubTrendRanges[number];
}): Promise<{ items: GithubTrendItem[] }> {
  const { range } = params;

  const fetcher = async () =>
    fetch(`${import.meta.env.VITE_STATS_GH_TRENDS_BASE_URL}/${range}.json`, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

  try {
    const res = await fetcher();
    const items = await res.json();
    return { items };
  } catch (error) {
    console.error(error);
    return { items: [] };
  }
}
