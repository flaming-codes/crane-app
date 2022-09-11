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
