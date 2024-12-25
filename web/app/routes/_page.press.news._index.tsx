import { PageContent } from "../modules/page-content";
import { PageContentSection } from "../modules/page-content-section";
import { Header } from "../modules/header";
import { mergeMeta } from "../modules/meta";
import { Link } from "react-router";
import { ArticlePreviewInfoCard } from "../modules/article";
import { BASE_URL } from "../modules/app";

export const handle = {
  hasFooter: true,
};

export const meta = mergeMeta(() => {
  return [
    { title: "Newsroom | CRAN/E" },
    { name: "description", content: "Latest news and updates of CRAN/E" },
    { property: "og:title", content: "Newsroom | CRAN/E" },
    { property: "og:url", content: `${BASE_URL}/press/news` },
    {
      property: "og:description",
      content: "Latest news and updates of CRAN/E",
    },
    { property: "og:image", content: `${BASE_URL}/press/news/og` },
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
            <Link viewTransition to="crane-v2">
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
