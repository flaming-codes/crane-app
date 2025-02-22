import { data, LoaderFunctionArgs, Link, useLoaderData } from "react-router";
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
import {
  DataProvidedByCRANLabel,
  ProvidedByLabel,
} from "../modules/provided-by-label";
import { AIPackageService } from "../ai/packages.service.server";
import { PackageService } from "../data/package.service";

const anchors = composeAnchorItems(["Analysis", "Top Downloads"]);

type LoaderData = {
  topDownloads: Awaited<
    ReturnType<typeof PackageInsightService.getTopDownloadedPackages>
  >["downloads"];
  summary: string;
};

export async function loader(params: LoaderFunctionArgs) {
  const { request } = params;
  const searchParams = new URLSearchParams(request.url.split("?")[1]);

  let topDownloadedRange: TopDownloadedPackagesRange = "last-day";
  let topDownloadedCount = 50;
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

  const [topDownloads] = await Promise.all([
    PackageInsightService.getTopDownloadedPackages(
      topDownloadedRange,
      topDownloadedCount,
    ),
  ]);

  const composeContext = async () => {
    const packageSlugs = topDownloads.downloads.map((d) => d.package);

    const packageDetails = await Promise.allSettled(
      packageSlugs.map((slug) => PackageService.getPackageByName(slug)),
    ).then((res) =>
      res.map((r) => (r.status === "fulfilled" ? r.value : undefined)),
    );

    return packageDetails
      .filter(Boolean)
      .map((pkg) =>
        [
          `# ${pkg?.name} (${topDownloads.downloads.find((d) => d.package === pkg?.name)?.downloads} downloads)`,
          pkg?.title,
          pkg?.description,
        ].join("\n"),
      )
      .join("\n\n");
  };

  const summary =
    await AIPackageService.generateTopDownloadsSummary(composeContext);

  const loaderData: LoaderData = {
    topDownloads: topDownloads.downloads || [],
    summary,
  };

  return data(loaderData, {
    headers: {
      "Cache-Control": `public, s-maxage=${hoursToSeconds(6)}`,
    },
  });
}

export default function StatisticPackagesPage() {
  const { summary, topDownloads } = useLoaderData<LoaderData>();

  const nrFormatter = Intl.NumberFormat();

  return (
    <>
      <Header
        gradient="bronze"
        headline="Most Downloaded"
        subline="Top downloaded packages packages from CRAN"
        ornament={<Tag>Statistics</Tag>}
      />

      <Anchors anchorIds={anchors.map((item) => item.slug)}>
        {anchors.map(({ slug, name }) => (
          <AnchorLink key={slug} fragment={slug}>
            {name}
          </AnchorLink>
        ))}
      </Anchors>

      <PageContent>
        <PageContentSection headline="Analysis" fragment="analysis">
          <div
            className="max-w-prose leading-relaxed [&>p]:mt-3"
            dangerouslySetInnerHTML={{ __html: summary }}
          />
          <div>
            <DataProvidedByCRANLabel />
            <ProvidedByLabel
              headline="Summary generated by"
              source="Google Gemini Flash 1.5"
              sourceUrl="https://deepmind.google/technologies/gemini/flash/"
              className="mt-3"
            />
          </div>
        </PageContentSection>

        <PageContentSection headline="Top downloads" fragment="top-downloads">
          <p>
            The top downloads are the packages that were downloaded the most
            during the last day.
          </p>
          <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {topDownloads.map(({ package: name, downloads }, index) => (
              <li key={index}>
                <Link
                  viewTransition
                  to={`/package/${encodeURIComponent(name)}`}
                >
                  <InfoCard variant="sand" icon="internal">
                    <div className="space-y-2">
                      <h3 className="font-mono">{name}</h3>
                      <ClientOnly>
                        {() => (
                          <p className="text-gray-dim animate-fade duration-150">
                            {nrFormatter.format(downloads)}{" "}
                            {downloads === 1 ? "download" : "Downloads"}
                          </p>
                        )}
                      </ClientOnly>
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
