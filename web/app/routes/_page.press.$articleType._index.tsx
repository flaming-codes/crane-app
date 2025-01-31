import { PageContent } from "../modules/page-content";
import { PageContentSection } from "../modules/page-content-section";
import { Header } from "../modules/header";
import { mergeMeta } from "../modules/meta";
import { data, Link, LoaderFunctionArgs, useLoaderData } from "react-router";
import { ArticlePreviewInfoCard } from "../modules/press";
import { BASE_URL } from "../modules/app";
import { ArticleService } from "../data/article.service.server";
import { Enums } from "../data/supabase.types.generated";
import { format } from "date-fns";
import { ClientOnly } from "remix-utils/client-only";

type LoaderDaa = {
  articles: Awaited<ReturnType<typeof ArticleService.getAllArticlePreviews>>;
  articleType: Enums<"press_article_type"> | (string & {});
};

export const handle = {
  hasFooter: true,
};

export const loader = async (args: LoaderFunctionArgs) => {
  const { params } = args;

  const articleType = params.articleType as
    | Enums<"press_article_type">
    | (string & {});

  const articles = await ArticleService.getAllArticlePreviews(articleType);
  return data({ articles, articleType });
};

export const meta = mergeMeta(({ params }) => {
  const articleType = params.articleType as
    | Enums<"press_article_type">
    | (string & {});

  switch (articleType) {
    case "news":
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

    case "magazine":
    default:
      return [
        { title: "Magazine | CRAN/E" },
        {
          name: "description",
          content: "General & technical articles about CRAN/E",
        },
        { property: "og:title", content: "Magazine | CRAN/E" },
        { property: "og:url", content: `${BASE_URL}/press/magazine` },
        {
          property: "og:description",
          content: "General & technical articles about CRAN/E",
        },
        { property: "og:image", content: `${BASE_URL}/press/magazine/og` },
      ];
  }
});

export default function NewsIndexPage() {
  const { articles, articleType } = useLoaderData<LoaderDaa>();

  const hasArticles = articles.length > 0;

  return (
    <>
      <Header
        gradient={articleType === "news" ? "amethyst" : "opal"}
        headline={articleType === "news" ? "Newsroom" : "Magazine"}
        subline={
          articleType === "news"
            ? "Latest news and updates of CRAN/E"
            : "General & technical articles about CRAN/E"
        }
      />

      <PageContent>
        <PageContentSection headline="Latest articles">
          <ul className="grid grid-cols-1 gap-8">
            {!hasArticles && (
              <li>
                <p>No articles found.</p>
              </li>
            )}
            {articles.map((article) => (
              <Link
                viewTransition
                key={article.slug}
                to={`/press/${article.type}/${article.slug}`}
                prefetch="intent"
              >
                <ArticlePreviewInfoCard
                  headline={article.title}
                  subline={article.subline || ""}
                  variant={articleType === "news" ? "amethyst" : "opal"}
                  createdAt={format(article.created_at, "dd-MM-yyyy")}
                >
                  <ClientOnly fallback={<div className="h-[290px]" />}>
                    {() => (
                      <p
                        dangerouslySetInnerHTML={{
                          __html: article.synopsis_html,
                        }}
                      />
                    )}
                  </ClientOnly>
                </ArticlePreviewInfoCard>
              </Link>
            ))}
          </ul>
        </PageContentSection>
      </PageContent>
    </>
  );
}
