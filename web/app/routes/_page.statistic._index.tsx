import { Link } from "@remix-run/react";
import { Anchors, AnchorLink, composeAnchorItems } from "../modules/anchors";
import { PageContent } from "../modules/page-content";
import { PageContentSection } from "../modules/page-content-section";
import { InfoCard } from "../modules/info-card";
import { Header } from "../modules/header";
import { Tag } from "../modules/tag";
import { mergeMeta } from "../modules/meta";
import { Separator } from "../modules/separator";

const anchors = composeAnchorItems(["Site usage", "CRAN data"]);

export const meta = mergeMeta(() => {
  return [
    { title: "Statistics | CRAN/E" },
    { name: "description", content: "Data insights on CRAN/E" },
  ];
});

export default function StatisticsOverviewPage() {
  return (
    <>
      <Header
        gradient="bronze"
        headline="Insights"
        subline="Get insights into CRAN/E and CRAN data"
        ornament={<Tag>Statistics</Tag>}
      />

      <Anchors>
        {anchors.map(({ name, slug }) => (
          <AnchorLink key={slug} fragment={slug}>
            {name}
          </AnchorLink>
        ))}
      </Anchors>

      <PageContent>
        <PageContentSection
          headline="Site usage"
          subline="See what packages and authors are trending on CRAN/E"
          fragment={"site-usage"}
        >
          <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            <li>
              <Link prefetch="intent" to="/statistic/crane/page-visits">
                <InfoCard variant="bronze" icon="internal" className="min-h-60">
                  <div className="space-y-2">
                    <h3>Page trends</h3>
                    <p className="text-gray-dim">
                      See what pages are trending on CRAN/E.
                    </p>
                  </div>
                </InfoCard>
              </Link>
            </li>
          </ul>
        </PageContentSection>

        <Separator />

        <PageContentSection
          headline="CRAN data"
          subline="Get insights into CRAN data"
          fragment={"cran-data"}
        >
          <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            <li>
              <Link prefetch="intent" to="/statistic/packages">
                <InfoCard variant="bronze" icon="internal" className="min-h-60">
                  <div className="space-y-2">
                    <h3>Package downloads</h3>
                    <p className="text-gray-dim">
                      See what packages are trending on CRAN/E.
                    </p>
                  </div>
                </InfoCard>
              </Link>
            </li>
          </ul>
        </PageContentSection>
      </PageContent>
    </>
  );
}
