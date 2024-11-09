import { LoaderFunctionArgs } from "@remix-run/node";
import {
  getTodayLastmod,
  composeUrlElement,
  mapComposerToDomain,
  mapDomainToSitemapData,
  SITEMAP_FILE_CHUNK_SIZE,
} from "../modules/sitemap";

/**
 * This is a catch-all for the single-slug routes that
 * are not handled by the other, explicitly named  routes.
 *
 * For example, the route /how-to is handled by the code
 * in /routes/how-to/*.
 *
 * This server-handler is only used to dynamically create
 * all sitemap files except the sitemap-index file, which
 * is defined in /routes/sitemap-index/+server.ts.
 */
export async function loader(props: LoaderFunctionArgs) {
  const { params } = props;
  const { slug } = params;

  const today = getTodayLastmod();

  if (slug === "sitemap-common") {
    return new Response(
      `<?xml version="1.0" encoding="UTF-8" ?>
      <urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">
          ${composeUrlElement({ path: "", lastmod: today })}
          ${composeUrlElement({ path: "/about", lastmod: "2024-10-29", changefreq: "yearly" })}
          ${composeUrlElement({ path: "/privacy", lastmod: "2024-10-29", changefreq: "yearly" })}
          ${composeUrlElement({ path: "/press/news", lastmod: "2024-10-29", changefreq: "monthly" })}
          ${composeUrlElement({ path: "/press/news/crane-v2", lastmod: "2024-10-29", changefreq: "yearly" })}
      </urlset>`.trim(),
      {
        headers: {
          "Content-Type": "application/xml",
          "Cache-Control": "public, max-age=3600, s-maxage=3600",
        },
      },
    );
  }

  if (slug === "sitemap-statistic") {
    return new Response(
      `<?xml version="1.0" encoding="UTF-8" ?>
      <urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">
          ${composeUrlElement({
            path: `/statistic/crane/page-visits`,
            lastmod: today,
            changefreq: "daily",
          })}
          ${composeUrlElement({
            path: `/statistic/package`,
            lastmod: today,
            changefreq: "daily",
          })}
           ${composeUrlElement({
             path: `/statistic/r-releases`,
             lastmod: today,
             changefreq: "daily",
           })}
      </urlset>`.trim(),
      {
        headers: {
          "Content-Type": "application/xml",
          "Cache-Control": "public, max-age=3600, s-maxage=3600",
        },
      },
    );
  }

  if (slug?.startsWith("sitemap-")) {
    const domain = slug.split("-")[1];
    const page = parseInt(slug.split("-")[2], 10);

    const mapper = mapComposerToDomain(domain);
    const allTuples = await mapDomainToSitemapData(domain);

    if (!allTuples) {
      throw new Response("Failed to fetch sitemap tuples", { status: 500 });
    }

    const threshold = page * SITEMAP_FILE_CHUNK_SIZE;
    const tuples = allTuples.slice(
      threshold,
      threshold + SITEMAP_FILE_CHUNK_SIZE,
    );

    return new Response(
      `<?xml version="1.0" encoding="UTF-8" ?><urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">${tuples
        .map(mapper)
        .join("")}</urlset>`.trim(),
      {
        headers: {
          "Content-Type": "application/xml",
          "Cache-Control": "public, max-age=3600, s-maxage=3600",
        },
      },
    );
  }

  // All static routes (i.e. files) take precedence over dynamic routes,
  // so we can safely assume that the request is for a dynamic route only.
  throw new Response("Not found", { status: 404 });
}
