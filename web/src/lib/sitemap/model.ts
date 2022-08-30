/**
 * Generate a single <url> element for the sitemap.xml file.
 * @param params
 * @returns
 */
export function composeUrlElement(params: {
  path: string;
  lastmod: string;
  changefreq?: string;
  priority?: number;
}) {
  const { path, lastmod, changefreq = 'monthly', priority = 0.8 } = params;
  return `
      <url>
        <loc>https://www.cran-e.com${path}</loc>
        <lastmod>${lastmod}</lastmod>
        <changefreq>${changefreq}</changefreq>
        <priority>${priority}</priority>
      </url>
    `.trim();
}
