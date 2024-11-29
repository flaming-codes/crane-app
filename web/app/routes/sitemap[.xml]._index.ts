import { IS_DEV } from "../modules/app.server";
import {
  mapDomainToSitemapData,
  SITEMAP_FILE_CHUNK_SIZE,
} from "../modules/sitemap";

export async function loader() {
  const [packagesSize, authorsSize] = await Promise.all([
    mapDomainToSitemapData("packages"),
    mapDomainToSitemapData("authors"),
  ]).then((items) => {
    return items.map((item) =>
      Math.ceil(item.length / SITEMAP_FILE_CHUNK_SIZE),
    );
  });

  return new Response(
    `<?xml version="1.0" encoding="UTF-8" ?>
    <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      <sitemap>
        <loc>https://cran-e.com/sitemap-common.xml</loc>
      </sitemap>
      <sitemap>
        <loc>https://cran-e.com/sitemap-statistic.xml</loc>
      </sitemap>
      ${Array.from(
        { length: packagesSize },
        (_, i) => `
        <sitemap>
          <loc>https://cran-e.com/sitemap-packages-${i}.xml</loc>
        </sitemap>`,
      ).join("")}
         ${Array.from(
           { length: authorsSize },
           (_, i) => `
        <sitemap>
          <loc>https://cran-e.com/sitemap-authors-${i}.xml</loc>
        </sitemap>`,
         ).join("")}
    </sitemapindex>`.trim(),
    {
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": IS_DEV ? "max-age=0" : "max-age=3600, s-maxage=3600",
      },
    },
  );
}
