import { useLoaderData } from "@remix-run/react";
import { Anchors, AnchorLink } from "../modules/anchors";
import { PageContent } from "../modules/page-content";
import { PageContentSection } from "../modules/page-content-section";
import { InfoCard } from "../modules/info-card";
import { Header } from "../modules/header";
import { Tag } from "../modules/tag";
import { mergeMeta } from "../modules/meta";
import { AIPackageService } from "../ai/packages.service.server";
import { PackageInsightService } from "../data/package-insight.service.server";
import {
  DataProvidedByCRANLabel,
  ProvidedByLabel,
} from "../modules/provided-by-label";

export const meta = mergeMeta(() => {
  return [
    { title: "R-Versions | CRAN/E" },
    {
      name: "description",
      content: "Detailed description of R versions on CRAN/E",
    },
  ];
});

export async function loader() {
  const items = await AIPackageService.generateRVersionsSummary(async () =>
    PackageInsightService.getReleasesHTML(),
  );
  return { items };
}

export default function StatisticsCranPageVisitTrendsPage() {
  const { items } = useLoaderData<typeof loader>();

  const sorted = items.sort((a, b) => {
    return a.platform.localeCompare(b.platform);
  });
  const anchors = sorted.map(({ platform }) => platform);

  return (
    <>
      <Header
        gradient="bronze"
        headline="R Releases"
        subline="Detailed description of R versions on CRAN/E"
        ornament={<Tag>Statistics</Tag>}
      />

      <Anchors>
        {anchors.map((anchor) => (
          <AnchorLink key={anchor} fragment={anchor.toLowerCase()}>
            {anchor}
          </AnchorLink>
        ))}
      </Anchors>

      <PageContent>
        {sorted.map(({ platform, releases }, index) => (
          <PageContentSection
            key={index}
            headline={platform}
            fragment={platform.toLowerCase()}
          >
            <ul className="grid grid-cols-1 gap-4">
              {releases.map((release, index) => (
                <li key={index}>
                  <InfoCard variant="none">
                    <div className="space-y-2">
                      <h3 className="font-semibold">{release.version}</h3>
                      <p>{release.description}</p>
                      <p className="text-gray-dim">
                        <time dateTime={release.date}>{release.date}</time>
                      </p>
                    </div>
                  </InfoCard>
                </li>
              ))}
            </ul>

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
        ))}
      </PageContent>
    </>
  );
}
