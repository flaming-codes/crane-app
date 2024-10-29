import { PageContent } from "../modules/page-content";
import { PageContentSection } from "../modules/page-content-section";
import { Header } from "../modules/header";
import { mergeMeta } from "../modules/meta";
import { Link } from "@remix-run/react";
import { ArticlePreviewInfoCard } from "../modules/article";

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
          <ul className="grid grid-cols-1">
            <Link to="crane-v2">
              <ArticlePreviewInfoCard
                headline="Announcing CRAN/E 2.0"
                subline="A modernized search platform for the R community"
                createdAt="2024-10-28"
              >
                CRAN/E, the{" "}
                <strong>Comprehensive R Archive Network / Enhanced</strong>, has
                officially launched version 2.0 today. This major release
                introduces a modernized design, significant usability
                enhancements, and an optimized site structure to facilitate
                easier searches, improved information retrieval, and an overall
                more intuitive experience.
              </ArticlePreviewInfoCard>
            </Link>
          </ul>
        </PageContentSection>
      </PageContent>
    </>
  );
}
