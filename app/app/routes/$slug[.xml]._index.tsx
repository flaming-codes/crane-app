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

  if (slug === "sitemap-common.xml") {
    return new Response(
      `<?xml version="1.0" encoding="UTF-8" ?>
      <urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">
          ${composeUrlElement({ path: "", lastmod: today })}
          ${composeUrlElement({ path: "/about", lastmod: "2022-08-20", changefreq: "monthly" })}
          ${composeUrlElement({ path: "/how-to", lastmod: "2022-08-20", changefreq: "monthly" })}
      </urlset>`.trim(),
      {
        headers: {
          "Content-Type": "application/xml",
          "Cache-Control": "public, max-age=3600, s-maxage=3600",
        },
      },
    );
  }

  // TODO: Returning empty urlset for now, need to implement this.
  if (slug === "sitemap-statistic.xml") {
    return new Response(
      `<?xml version="1.0" encoding="UTF-8" ?>
      <urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">
          ${
            ""
            /* ["repos-by-stars", "users-by-followers"].map((domain) =>
            githubTrendRanges
              .map((range) =>
                composeUrlElement({
                  path: `/statistic/github/${domain}/${range}`,
                  lastmod: today,
                  changefreq: "daily",
                }),
              )
              .join(""),
          )*/
          }
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

    console.log(tuples[0]);

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