import { PageContent } from "../modules/page-content";
import { PageContentSection } from "../modules/page-content-section";
import { Header } from "../modules/header";
import { mergeMeta } from "../modules/meta";
import { Link } from "@remix-run/react";
import { InfoCard } from "../modules/info-card";

export const handle = {
  hasFooter: true,
};

export const meta = mergeMeta(() => {
  return [
    { title: "Newsroom | CRAN/E" },
    { name: "description", content: "Latest news and updates of CRAN/E" },
  ];
});

export default function PrivacyPage() {
  return (
    <>
      <Header
        gradient="amethyst"
        headline="Newsroom"
        subline="Learn more about our latest news and updates"
      />

      <PageContent>
        <PageContentSection headline="Latest articles">
          <ul className="grid grid-cols-2 gap-4 md:grid-cols-3">
            <Link to="crane-v2">
              <InfoCard variant="amethyst" icon="internal" className="min-h-60">
                <div className="space-y-1">
                  <span className="text-gray-dim font-mono text-xs">
                    2024-10-28
                  </span>
                  <h3 className="text-lg">Announcing CRAN/E 2.0</h3>
                  <p className="text-gray-dim pt-2">
                    A modernized search platform for the R community
                  </p>
                </div>
              </InfoCard>
            </Link>
          </ul>
        </PageContentSection>
      </PageContent>
    </>
  );
}
