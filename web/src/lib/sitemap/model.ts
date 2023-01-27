import { authors, sitemapTuples } from '$lib/db/model';
import { encodeSitemapSymbols } from './parse';

export function getTodayLastmod() {
  return new Date().toISOString().slice(0, 10);
}

/**
 * Generate a single <url> element for the sitemap.xml file.
 * @param params
 * @returns
 */
export function composeUrlElement(params: {
  path: string;
  lastmod: string;
  changefreq?: string;
  priority?: string;
}) {
  const { path, lastmod, changefreq = 'monthly', priority = 0.8 } = params;
  return `<url><loc>https://www.cran-e.com${path}</loc><lastmod>${lastmod}</lastmod><changefreq>${changefreq}</changefreq><priority>${priority}</priority></url>`.trim();
}

export function composeAuthorUrl(name: string) {
  return composeUrlElement({
    path: `/author/${encodeSitemapSymbols(encodeURIComponent(name))}`,
    lastmod: getTodayLastmod(),
    priority: '0.8'
  });
}

export function composePackageUrl([slug, lastmod]: [string, string]) {
  return composeUrlElement({
    path: `/package/${encodeSitemapSymbols(slug)}`,
    lastmod,
    priority: '1.0'
  });
}

export function composeCategoryUrl(name: string) {
  return composeUrlElement({
    path: `/category/${encodeSitemapSymbols(encodeURIComponent(name))}`,
    lastmod: getTodayLastmod(),
    priority: '0.8'
  });
}

export function mapDomainToSitemapData(fetch: Fetch, source: string) {
  switch (source) {
    case 'packages':
      return sitemapTuples(fetch);
    case 'authors':
      return authors(fetch).then((record) => Object.keys(record));
    case 'categories':
      // TODO: fetch categories from API.
      return [];

    default:
      throw new Error(`Invalid composition source: ${source}`);
  }
}

export function mapComposerToDomain(source: string) {
  switch (source) {
    case 'packages':
      return composePackageUrl;
    case 'authors':
      return composeAuthorUrl;
    case 'categories':
      return composeCategoryUrl;

    default:
      throw new Error(`Invalid composition source: ${source}`);
  }
}
