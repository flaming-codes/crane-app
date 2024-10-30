import { json, LoaderFunctionArgs } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { PackageInsightService } from "../data/package-insight.service.server";
import {
  TopDownloadedPackagesRange,
  topDownloadedPackagesRangeSchema,
} from "../data/package-insight.shape";
import { z } from "zod";
import { Header } from "../modules/header";
import { AnchorLink, Anchors, composeAnchorItems } from "../modules/anchors";
import { PageContentSection } from "../modules/page-content-section";
import { PageContent } from "../modules/page-content";
import { InfoCard } from "../modules/info-card";
import { Separator } from "../modules/separator";
import { Tag } from "../modules/tag";
import { ClientOnly } from "remix-utils/client-only";
import { hoursToSeconds } from "date-fns";
import { DataProvidedByCRANLabel } from "../modules/provided-by-label";

const anchors = composeAnchorItems(["Top Downloads", "Trending Packages"]);

export async function loader(params: LoaderFunctionArgs) {
  const { request } = params;
  const searchParams = new URLSearchParams(request.url.split("?")[1]);

  let topDownloadedRange: TopDownloadedPackagesRange = "last-day";
  let topDownloadedCount = 20;
  const topDownloadedRangeRes = topDownloadedPackagesRangeSchema.safeParse(
    searchParams.get("range"),
  );
  const topDownloadedCountRes = z.number().safeParse(searchParams.get("count"));
  if (topDownloadedRangeRes.data) {
    topDownloadedRange = topDownloadedRangeRes.data;
  }
  if (topDownloadedCountRes.data) {
    topDownloadedCount = topDownloadedCountRes.data;
  }

  const [topDownloads, trends] = await Promise.all([
    PackageInsightService.getTopDownloadedPackages(
      topDownloadedRange,
      topDownloadedCount,
    ),
    PackageInsightService.getTrendingPackages(),
  ]);

  return json(
    {
      topDownloads: topDownloads || [],
      trends: trends || [],
    },
    {
      headers: {
        "Cache-Control": `public, s-maxage=${hoursToSeconds(6)}`,
      },
    },
  );
}

export default function StatisticPackagesPage() {
  const { topDownloads, trends } = useLoaderData<typeof loader>();

  const nrFormatter = Intl.NumberFormat();

  return (
    <>
      <Header
        gradient="bronze"
        headline="CRAN Statistics"
        subline="Top downloaded packages and trending packages"
        ornament={<Tag>Statistics</Tag>}
      />

      <Anchors>
        {anchors.map(({ slug, name }) => (
          <AnchorLink key={slug} fragment={slug}>
            {name}
          </AnchorLink>
        ))}
      </Anchors>

      <PageContent>
        <PageContentSection headline="Top downloads" fragment="top-downloads">
          <p>
            The top downloads are the packages that were downloaded the most
            during the last day.
          </p>
          <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {topDownloads.downloads.map(
              ({ package: name, downloads }, index) => (
                <li key={index}>
                  <Link to={`/package/${encodeURIComponent(name)}`}>
                    <InfoCard variant="sand" icon="internal">
                      <div className="space-y-2">
                        <h3 className="font-mono">{name}</h3>
                        <ClientOnly>
                          {() => (
                            <p className="text-gray-dim animate-fade animate-duration-150">
                              {nrFormatter.format(downloads)}{" "}
                              {downloads === 1 ? "download" : "Downloads"}
                            </p>
                          )}
                        </ClientOnly>
                      </div>
                    </InfoCard>
                  </Link>
                </li>
              ),
            )}
          </ul>
          <DataProvidedByCRANLabel />
        </PageContentSection>

        <Separator />

        <PageContentSection
          headline="Trending packages"
          fragment="trending-packages"
        >
          <p>
            Trending packages are the ones that were downloaded at least 1000
            times during last week, and that substantially increased their
            download counts, compared to the average weekly downloads in the
            previous 24 weeks.
          </p>
          <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {trends.map(({ package: name, increase }) => (
              <li key={name}>
                <Link to={`/package/${encodeURIComponent(name)}`}>
                  <InfoCard variant="sand" icon="external">
                    <div className="space-y-2">
                      <h3 className="font-mono">{name}</h3>
                      <p className="text-gray-dim">{increase}</p>
                    </div>
                  </InfoCard>
                </Link>
              </li>
            ))}
          </ul>
          <DataProvidedByCRANLabel />
        </PageContentSection>
      </PageContent>
      <Separator />
    </>
  );
}
