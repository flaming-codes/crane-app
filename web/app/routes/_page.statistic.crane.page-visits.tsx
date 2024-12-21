import { Link, useLoaderData } from "react-router";
import { Anchors, AnchorLink } from "../modules/anchors";
import { PageContent } from "../modules/page-content";
import { PageContentSection } from "../modules/page-content-section";
import { InfoCard } from "../modules/info-card";
import { Header } from "../modules/header";
import { Tag } from "../modules/tag";
import { PageInsightService } from "../data/page-insight.service";
import { Separator } from "../modules/separator";
import { mergeMeta } from "../modules/meta";

const anchors = ["Sites", "Packages", "Authors"];

export const meta = mergeMeta(() => {
  return [
    { title: "Page Visits | CRAN/E" },
    {
      name: "description",
      content: "Data insights about page visits of CRAN/E",
    },
  ];
});

export const loader = async () => {
  return PageInsightService.getTopPages();
};

export default function StatisticsCranPageVisitTrendsPage() {
  const { authors, packages, start, about } = useLoaderData<typeof loader>();

  const hasAnyCommon = start.length > 0 || about.length > 0;

  return (
    <>
      <Header
        gradient="bronze"
        headline="Trending page visits"
        subline="See what pages are trending on CRAN/E"
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
        {hasAnyCommon ? (
          <>
            <PageContentSection headline="Sites" fragment="sites">
              <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                {[...start, ...about].map((item, index) => (
                  <li key={index}>
                    <Link to={item.page}>
                      <InfoCard variant="sand" icon="internal">
                        <div className="space-y-2">
                          <h3 className="font-mono">
                            {item.page.replace("/package/", "")}
                          </h3>
                          <p className="text-gray-dim">
                            {item.visitors}{" "}
                            {item.visitors === 1 ? "visitor" : "visitors"}
                          </p>
                        </div>
                      </InfoCard>
                    </Link>
                  </li>
                ))}
              </ul>
            </PageContentSection>

            <Separator />
          </>
        ) : null}

        <PageContentSection headline="Packages" fragment="packages">
          <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {packages.map((item, index) => (
              <li key={index}>
                <Link to={item.page}>
                  <InfoCard variant="iris" icon="internal">
                    <div className="space-y-2">
                      <h3>{item.page.replace("/package/", "")}</h3>
                      <p className="text-gray-dim">
                        {item.visitors}{" "}
                        {item.visitors === 1 ? "visitor" : "visitors"}
                      </p>
                    </div>
                  </InfoCard>
                </Link>
              </li>
            ))}
          </ul>
        </PageContentSection>

        <Separator />

        <PageContentSection headline="Authors" fragment="authors">
          <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {authors.map((item, index) => (
              <li key={index}>
                <Link to={item.page}>
                  <InfoCard variant="jade" icon="internal">
                    <div className="space-y-2">
                      <h3>{item.page.replace("/author/", "")}</h3>
                      <p className="text-gray-dim">
                        {item.visitors}{" "}
                        {item.visitors === 1 ? "visitor" : "visitors"}
                      </p>
                    </div>
                  </InfoCard>
                </Link>
              </li>
            ))}
          </ul>
        </PageContentSection>
      </PageContent>
    </>
  );
}
