import type { TAItem } from '../adapters/types';

/**
 *
 * @returns
 */
export async function fetchTypeAheadItems(): Promise<TAItem[]> {
  const request = new Request(`/api/package/ta/items`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  });

  const res = await fetch(request);
  const { items } = await res.json();

  return items;
}
