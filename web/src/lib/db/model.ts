import type { Pkg } from '$lib/package/type';
import type { TAItem } from 'src/sw/types';
import Fuse from 'fuse.js';

let overviewData: Pkg[] | undefined;
let typeAheadData: TAItem[] | undefined;
let sitemapData: [string, string] | undefined;

let instance: Fuse<Pkg> | undefined;

const overviewUrl = import.meta.env.VITE_OVERVIEW_PKGS_URL;
const taUrl = import.meta.env.VITE_TA_PKGS_URL;
const selectUrl = import.meta.env.VITE_SELECT_PKG_URL;
const sitemapUrl = import.meta.env.VITE_SITEMAP_PKGS_URL;

/**
 *
 * @returns
 */
export async function db(): Promise<Fuse<Pkg>> {
  if (!instance) {
    const items = await overview();
    // Apply schema for the search index.
    // Note that each key by default has '1'-weight.
    const next = new Fuse(items, {
      threshold: 0.35,
      keys: [
        {
          name: 'name',
          weight: 2
        },
        {
          name: 'title',
          weight: 1.5
        },
        'author_names'
      ]
    });
    instance = next;
  }
  return instance;
}

/**
 *
 * @param params
 * @returns
 */
export async function select(params: { id: string }): Promise<Pkg | undefined> {
  const { id } = params;
  const url = selectUrl.replace('{{id}}', id);

  const res = await fetcher<Pkg>(url, '');
  return Array.isArray(res) ? res[0] : res;
}

export async function overview() {
  if (!overviewData) {
    overviewData = await fetcher<Pkg[]>(overviewUrl, '');
  }
  return overviewData;
}

/**
 *
 * @returns
 */
export async function typeAheadTuples() {
  if (!typeAheadData) {
    const raw = await fetcher<[string, string]>(taUrl, '');
    typeAheadData = raw.map(([id, slug]) => ({ id, slug }));
  }
  return typeAheadData;
}

/**
 *
 * @returns
 */
export async function sitemapTuples() {
  if (!sitemapData) {
    sitemapData = await fetcher<[string, string]>(sitemapUrl, '');
  }
  return sitemapData;
}

const fetcher = async <T>(href: string, path?: string): Promise<T> => {
  return fetch(href + (path || ''), {
    headers: {
      Authorization: `Token ${import.meta.env.VITE_API_KEY}`,
      'Content-Type': 'application/json',
      Accept: 'application/json'
    }
  }).then((res) => res.json());
};
