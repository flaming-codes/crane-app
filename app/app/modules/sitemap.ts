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
