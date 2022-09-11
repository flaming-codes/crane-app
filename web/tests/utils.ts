export async function fetchOverviewItems(): Promise<[string, string][]> {
  const url = process.env.VITE_TA_TEST_PKG_URL;
  const key = process.env.VITE_API_KEY;

  if (!url || !key) {
    throw new Error('VITE_TA_TEST_PKG_URL and VITE_API_KEY must be set');
  }

  return fetch(url, {
    headers: {
      Authorization: `Token ${key}`,
      'Content-Type': 'application/json',
      Accept: 'application/json'
    }
  }).then((res) => res.json());
}

export async function fetchAuthors(): Promise<Record<string, string[]>> {
  const url = process.env.VITE_AP_PKGS_URL;
  const key = process.env.VITE_API_KEY;

  if (!url || !key) {
    throw new Error('VITE_AP_PKGS_URL and VITE_API_KEY must be set');
  }

  return fetch(url, {
    headers: {
      Authorization: `Token ${key}`,
      'Content-Type': 'application/json',
      Accept: 'application/json'
    }
  }).then((res) => res.json());
}

export function split<T>(source: T[], params: { chunks: number }) {
  const { chunks } = params;

  return source.reduce((acc, item, i) => {
    if (!acc[i % chunks]) acc[i % chunks] = [];
    acc[i % chunks].push(item);

    return acc;
  }, [] as T[][]);
}
