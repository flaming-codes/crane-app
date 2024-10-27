import { json, Link, MetaFunction, useLoaderData } from "@remix-run/react";
import { Anchors, AnchorLink } from "../modules/anchors";
import { PageContent } from "../modules/page-content";
import { PageContentSection } from "../modules/page-content-section";
import { InfoCard } from "../modules/info-card";
import { Header } from "../modules/header";
import { Tag } from "../modules/tag";
import { InsightService } from "../data/insight.service";
import { Separator } from "../modules/separator";

const anchors = ["Packages", "Authors"];

export const handle = {
  hasFooter: true,
};

export const meta: MetaFunction = () => {
  return [
    { title: "Page Visits | CRAN/E" },
    {
      name: "description",
      content: "Data insights about page visits of CRAN/E",
    },
  ];
};

export async function loader() {
  const grouped = await InsightService.getTopPages();
  return json(grouped);
}

export default function StatisticsCranPageVisitTrendsPage() {
  const { authors, packages } = useLoaderData<typeof loader>();

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
