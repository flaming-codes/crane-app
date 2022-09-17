import type { OverviewPkg, Pkg } from '$lib/package/type';
import type { TAItem } from './adapters/types';
import Fuse from 'fuse.js';
import type { OverviewAuthor } from '$lib/author/types';
import { encodeSitemapSymbols } from '$lib/sitemap/parse';

let packagesOverviewData: OverviewPkg[] | undefined;
let typeAheadData: TAItem[] | undefined;
let sitemapData: Array<[string, string]> | undefined;
let authorData: Record<string, string[] | { packages: string[]; links?: string[] }> | undefined;
let authorOverviewData: OverviewAuthor[] | undefined;

let packagesOverviewFuse: Fuse<OverviewPkg> | undefined;
let authorsOverviewFuse: Fuse<OverviewAuthor> | undefined;

const overviewUrl = import.meta.env.VITE_OVERVIEW_PKGS_URL;
const taUrl = import.meta.env.VITE_TA_PKGS_URL;
const selectUrl = import.meta.env.VITE_SELECT_PKG_URL;
const sitemapUrl = import.meta.env.VITE_SITEMAP_PKGS_URL;
const authorUrl = import.meta.env.VITE_AP_PKGS_URL;

/**
 *
 * @returns
 */
export async function packagesOverviewDb(): Promise<Fuse<OverviewPkg>> {
  if (!packagesOverviewFuse) {
    const items = await packagesOverview();
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
    packagesOverviewFuse = next;
  }
  return packagesOverviewFuse;
}

/**
 *
 * @returns
 */
export async function authorsOverviewDb(): Promise<Fuse<OverviewAuthor>> {
  if (!authorsOverviewFuse) {
    const items = await authorsOverview();
    const next = new Fuse(items, {
      threshold: 0.35,
      keys: [{ name: 'name' }]
    });
    authorsOverviewFuse = next;
  }
  return authorsOverviewFuse;
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

export async function packagesOverview() {
  if (!packagesOverviewData) {
    packagesOverviewData = await fetcher<OverviewPkg[]>(overviewUrl, '');
  }
  return packagesOverviewData;
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
export async function authors() {
  if (!authorData) {
    authorData = await fetcher<Record<string, string[]>>(authorUrl, '');
  }
  return authorData;
}

/**
 *
 * @returns
 */
export async function authorsOverview() {
  if (!authorOverviewData) {
    const authorsMap = await authors();
    authorOverviewData = Object.entries(authorsMap).map(([name, packageNames]) => ({
      name,
      slug: encodeSitemapSymbols(encodeURIComponent(name)),
      totalPackages: Array.isArray(packageNames)
        ? packageNames.length
        : packageNames.packages.length
    }));
  }
  return authorOverviewData;
}

/**
 *
 * @returns
 */
export async function sitemapTuples() {
  if (!sitemapData) {
    sitemapData = await fetcher<Array<[string, string]>>(sitemapUrl, '');
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
