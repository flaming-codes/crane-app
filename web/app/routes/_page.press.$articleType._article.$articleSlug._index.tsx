import { ArticleSynopsis, ProminentArticleImage } from "../modules/press";
import { PageContentSection } from "../modules/page-content-section";
import { Separator } from "../modules/separator";
import { data, LoaderFunctionArgs, useLoaderData } from "react-router";
import { PageContent } from "../modules/page-content";
import { Header } from "../modules/header";
import { Anchors, AnchorLink } from "../modules/anchors";
import { Tag } from "../modules/tag";
import { ArticleService } from "../data/article.service.server";
import { mergeMeta } from "../modules/meta";
import { BASE_URL } from "../modules/app";
import { format, hoursToSeconds } from "date-fns";
import { ClientOnly } from "remix-utils/client-only";
import { IS_DEV } from "../modules/app.server";

type LoaderData = {
  article: NonNullable<
    Awaited<ReturnType<typeof ArticleService.getArticleBySlug>>
  >;
};

export const handle = {
  hasFooter: true,
};

export const loader = async (args: LoaderFunctionArgs) => {
  const { articleSlug, articleType } = args.params;

  if (!articleSlug || !articleType) {
    throw new Response("Not found", { status: 404 });
  }

  const article = await ArticleService.getArticleBySlug(
    articleSlug,
    articleType,
  );

  if (!article) {
    throw new Response("Not found", { status: 404 });
  }

  return data(
    {
      article,
    },
    IS_DEV
      ? undefined
      : {
          headers: {
            "Cache-Control": `public, max-age=${hoursToSeconds(12)}, s-maxage=${hoursToSeconds(72)}`,
          },
        },
  );
};

export const meta = mergeMeta((params) => {
  const { article } = params.data as LoaderData;

  if (!article) {
    return [];
  }

  return [
    { title: `${article.title} | CRAN/E` },
    { name: "description", content: article.subline },
    { property: "og:title", content: `${article.title} | CRAN/E` },
    {
      property: "og:url",
      content: `${BASE_URL}/press/${article.type}/${encodeURIComponent(article.slug)}`,
    },
    { property: "og:description", content: article.subline },
    {
      property: "og:image",
      content: `${BASE_URL}/press/${article.type}/${encodeURIComponent(article.slug)}/og?${new URLSearchParams(
        Object.entries({
          headline: article.title,
          subline: article.subline || "",
        }),
      )}`,
    },
  ];
});

export default function NewsArticleCraneV2() {
  const { article } = useLoaderData<LoaderData>();

  const hasSections = article && article.sections.length > 0;

  return (
    <>
      <Header
        gradient={article.type === "news" ? "amethyst" : "opal"}
        headline={article.title}
        subline={article.subline}
        ornament={<Tag>{article.type}</Tag>}
      />

      {hasSections ? (
        <Anchors>
          {article.sections.map((section) => (
            <AnchorLink key={section.fragment} fragment={section.fragment}>
              {section.headline}
            </AnchorLink>
          ))}
        </Anchors>
      ) : null}

      <PageContent>
        <ArticleSynopsis
          type={article.type}
          createdAt={format(article.created_at, "dd-MM-yyyy")}
          updatedAt={
            article.updated_at
              ? format(article.updated_at, "dd-MM-yyyy")
              : undefined
          }
          authors={article.authors.map((a) => a.name)}
        >
          <p
            dangerouslySetInnerHTML={{
              __html: article.synopsis_html,
            }}
          />
        </ArticleSynopsis>

        <Separator className="my-8" />

        {article.sections.map((section, index) => (
          <PageContentSection
            key={index}
            variant="prose"
            headline={section.headline}
            fragment={section.fragment}
          >
            {section.body.map((content, index) => {
              switch (content.type) {
                case "html":
                  return (
                    <div
                      key={index}
                      dangerouslySetInnerHTML={{
                        __html: content.value,
                      }}
                    />
                  );
                case "image":
                  return (
                    <ProminentArticleImage
                      key={index}
                      src={content.value.src}
                      caption={content.value.caption}
                    />
                  );
              }
            })}
          </PageContentSection>
        ))}

        <ClientOnly>
          {() => (
            <p className="text-gray-dim mt-16 text-center text-sm lg:mt-32">
              Published on {format(article.created_at, "dd-MM-yyyy")} by{" "}
              {article.authors.map((a) => a.name).join(", ")}
            </p>
          )}
        </ClientOnly>
      </PageContent>
    </>
  );
}
