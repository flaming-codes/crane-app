import { data } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { PackageInsightService } from "../data/package-insight.service.server";
import { Header } from "../modules/header";
import { AnchorLink, Anchors, composeAnchorItems } from "../modules/anchors";
import { PageContentSection } from "../modules/page-content-section";
import { PageContent } from "../modules/page-content";
import { InfoCard } from "../modules/info-card";
import { Separator } from "../modules/separator";
import { Tag } from "../modules/tag";
import { hoursToSeconds } from "date-fns";
import {
  DataProvidedByCRANLabel,
  ProvidedByLabel,
} from "../modules/provided-by-label";
import { PackageService } from "../data/package.service";
import { AIPackageService } from "../ai/packages.service.server";

const anchors = composeAnchorItems(["Analysis", "Trending Packages"]);

type LoaderData = {
  trends: {
    package: string;
    increase: string;
  }[];
  summary: string;
};

export const loader = async () => {
  const [trends] = await Promise.all([
    PackageInsightService.getTrendingPackages(),
  ]);

  const composeContext = async () => {
    // We slice to ensure no context window issues with the AI model,
    // and to keep the response concise.
    const packageSlugs = trends.slice(0, 20).map((trend) => trend.package);
    const packageDetails = await Promise.allSettled(
      packageSlugs.map((slug) => PackageService.getPackageByName(slug)),
    ).then((res) => {
      return res.map((r) => (r.status === "fulfilled" ? r.value : undefined));
    });

    return packageDetails
      .filter(Boolean)
      .map((pkg) =>
        [
          `# ${pkg?.name} (${trends.find((t) => t.package === pkg?.name)?.increase} increase)`,
          pkg?.title,
          pkg?.description,
        ].join("\n"),
      )
      .join("\n\n");
  };

  const summary = await AIPackageService.generateTrendsSummary(composeContext);

  const loaderData: LoaderData = {
    trends: trends || [],
    summary,
  };

  return data(loaderData, {
    headers: {
      "Cache-Control": `public, s-maxage=${hoursToSeconds(6)}`,
    },
  });
};

export default function StatisticPackagesPage() {
  const { trends, summary } = useLoaderData<LoaderData>();

  return (
    <>
      <Header
        gradient="bronze"
        headline="Trends"
        subline="Top trending packages by downloads from CRAN"
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
