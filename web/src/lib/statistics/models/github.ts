import type { GithubRepoByStarsTrendItem, GithubUserByFollowersTrendItem } from '../types/github';

export const githubTrendRanges = [
  '1h',
  '6h',
  '12h',
  '24h',
  '48h',
  '72h',
  '1w',
  '2w',
  '1m'
] as const;

export function mapRangeToLabel(source: string) {
  switch (source) {
    case '1h':
      return '1 hour';
    case '6h':
      return '6 hours';
    case '12h':
      return '12 hours';
    case '24h':
      return '24 hours';
    case '48h':
      return '48 hours';
    case '72h':
      return '72 hours';
    case '1w':
      return '1 week';
    case '2w':
      return '2 weeks';
    case '1m':
      return '1 month';
    default:
      return source;
  }
}

async function fetchTrendItems<T>(
  fetch: Fetch,
  params: {
    range: (typeof githubTrendRanges)[number];
    path: string;
  }
): Promise<{ items: T[] }> {
  const { path, range } = params;

  const fetcher = async () =>
    fetch([import.meta.env.VITE_STATS_GH_TRENDS_BASE_URL, path, `${range}.json`].join('/'), {
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

export async function fetchReposByStars(
  fetch: Fetch,
  params: {
    range: (typeof githubTrendRanges)[number];
  }
): Promise<{ items: GithubRepoByStarsTrendItem[] }> {
  const { range } = params;
  return fetchTrendItems<GithubRepoByStarsTrendItem>(fetch, {
    range,
    path: 'repos-by-stars'
  });
}

export async function fetchUsersByFollowers(
  fetch: Fetch,
  params: {
    range: (typeof githubTrendRanges)[number];
  }
): Promise<{ items: GithubUserByFollowersTrendItem[] }> {
  const { range } = params;
  return fetchTrendItems<GithubUserByFollowersTrendItem>(fetch, {
    range,
    path: 'users-by-followers'
  });
}
