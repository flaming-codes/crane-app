import { AuthorService } from "../data/author.service";
import { PackageService } from "../data/package.service";
import { BASE_URL } from "./app";

export const SITEMAP_FILE_CHUNK_SIZE = 5_000;

/**
 * Encode a string to be used in a URL. This is a complement to `decodeURIComponent`,
 * which doesn't encode all required characters.
 * @param source
 * @returns
 */
export function encodeSitemapSymbols(source: string): string {
  return source
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

/**
 * Decode symbols that are encoded in sitemap.xml and don't
 * get decoded by 'decodeUriComponent'.
 * @param source
 * @returns
 */
export function decodeSitemapSymbols(source: string): string {
  return source
    .replaceAll("&amp;", "&")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", '"')
    .replaceAll("&apos;", "'");
}

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
  const { path, lastmod, changefreq = "monthly", priority = 0.8 } = params;
  return `<url><loc>${BASE_URL}${path}</loc><lastmod>${lastmod}</lastmod><changefreq>${changefreq}</changefreq><priority>${priority}</priority></url>`.trim();
}

export function composeAuthorUrl([name, lastmod]: [
  string,
  string | undefined,
]) {
  return composeUrlElement({
    path: `/author/${encodeSitemapSymbols(encodeURIComponent(name))}`,
    lastmod: lastmod || getTodayLastmod(),
    priority: "0.8",
  });
}

export function composePackageUrl([slug, lastmod]: [
  string,
  string | undefined,
]) {
  return composeUrlElement({
    path: `/package/${encodeSitemapSymbols(slug)}`,
    lastmod: lastmod || getTodayLastmod(),
    priority: "1.0",
  });
}

export async function mapDomainToSitemapData(
  source: string,
): Promise<Array<[string, string | undefined]>> {
  switch (source) {
    case "packages":
      return PackageService.getAllSitemapPackages();
    case "authors":
      return AuthorService.getAllSitemapAuthors();

    default:
      throw new Error(
        `[mapDomainToSitemapData] Invalid composition source: ${source}`,
      );
  }
}

export function mapComposerToDomain(source: string) {
  switch (source) {
    case "packages":
      return composePackageUrl;
    case "authors":
      return composeAuthorUrl;

    default:
      throw new Error(
        `[mapComposerToDomain] Invalid composition source: ${source}`,
      );
  }
}
