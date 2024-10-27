import { json, Link, MetaFunction } from "@remix-run/react";
import { Anchors, AnchorLink } from "../modules/anchors";
import { PageContent } from "../modules/page-content";
import { PageContentSection } from "../modules/page-content-section";
import { InfoCard } from "../modules/info-card";

const anchors = ["Site usage"];

export const handle = {
  hasFooter: true,
};

export const meta: MetaFunction = () => {
  return [
    { title: "Statistics | CRAN/E" },
    { name: "description", content: "Data insights on CRAN/E" },
  ];
};

export function loader() {
  return json({});
}

export default function StatisticsOverviewPage() {
  return (
    <>
      <Anchors>
        {anchors.map((anchor) => (
          <AnchorLink key={anchor} fragment={anchor.toLowerCase()}>
            {anchor}
          </AnchorLink>
        ))}
      </Anchors>
      <PageContent>
        <h1 className="text-3xl">Statistics</h1>

        <PageContentSection headline="Site usage" fragment="site-usage">
          <p>See what packages and authors are trending on CRAN/E.</p>
          <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            <li>
              <Link to="/statistic/crane/page-visits">
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
      </PageContent>
    </>
  );
}
