import type { GithubTrendItem } from '../types/github';

export async function fetchReposByStars(params: {
  range: string;
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
