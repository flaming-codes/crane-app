import { PropsWithChildren } from "react";
import { mergeMeta } from "./meta";
import { InfoPill } from "./info-pill";
import { clsx } from "clsx";
import { InfoCard } from "./info-card";
import { BASE_URL } from "./app";

export type NewsArticleHandle = {
  slug: string;
  title: string;
  subline?: string;
  createdAt: string;
  updatedAt?: string;
  authors: string[];
  categories: Array<"general" | "announcement">;
  sections: Array<{ name: string; fragment: string }>;
};

export const composeArticleMeta = mergeMeta(({ matches }) => {
  const article = findArticleMatch(matches);
  if (!article) {
    throw new Error("No article found");
  }

  return [
    { title: `${article?.title} | CRAN/E` },
    { name: "description", content: article.subline },
    { property: "og:title", content: `${article.title} | CRAN/E` },
    {
      property: "og:url",
      content: `${BASE_URL}/press/news/${encodeURIComponent(article.slug)}`,
    },
    { property: "og:description", content: article.subline },
    {
      property: "og:image",
      content: `${BASE_URL}/press/news/${encodeURIComponent(article.slug)}/og?${new URLSearchParams(
        Object.entries({
          headline: article.title,
          subline: article.subline || "",
        }),
      )}`,
    },
  ];
});

export function findArticleMatch(
  matches: Array<{ handle?: unknown }>,
): NewsArticleHandle | undefined {
  const match = matches.find(
    (match) =>
      match.handle &&
      (match.handle as { article?: NewsArticleHandle })?.article,
  );

  return (match?.handle as { article?: NewsArticleHandle })?.article;
}

export function ArticleSynopsis(
  props: PropsWithChildren<{
    createdAt: string;
    updatedAt?: string;
    authors: string[];
  }>,
) {
  const { createdAt, updatedAt, authors, children } = props;

  return (
    <section className="space-y-12">
      <p
        className={clsx(
          "inline-block bg-gradient-to-tl from-violet-9 to-purple-11 bg-clip-text font-semibold text-transparent dark:from-violet-10 dark:to-purple-7",
          "text-gray-dim mt-8 w-3/4 text-xl leading-relaxed md:w-2/3",
        )}
      >
        {children}
      </p>
      <footer className="flex gap-2">
        <InfoPill size="sm" label="Publication">
          <time dateTime={createdAt}>{createdAt}</time>
          {updatedAt && (
            <>
              {" "}
              (updated <time dateTime={updatedAt}>{updatedAt}</time>)
            </>
          )}
        </InfoPill>
        <InfoPill size="sm" label="Authors">
          {authors.join(", ")}
        </InfoPill>
      </footer>
    </section>
  );
}

export function ProminentArticleImage(props: { src: string; caption: string }) {
  const { src, caption } = props;

  return (
    <figure className="my-4 space-y-2 md:my-8">
      <img
        src={src}
        alt="Screenshot of the CRAN/E 2.0 start page"
        className="mx-auto md:max-w-prose"
      />
      <figcaption className="text-gray-dim px-4 text-center text-xs">
        {caption}
      </figcaption>
    </figure>
  );
}

export function ArticlePreviewInfoCard(
  props: PropsWithChildren<{
    headline: string;
    subline: string;
    createdAt: string;
  }>,
) {
  const { headline, subline, createdAt, children } = props;

  return (
    <InfoCard variant="none" className="relative isolate">
      <div className="grid gap-4 sm:min-h-60 sm:grid-cols-2">
        <div
          className={clsx(
            "absolute inset-0 bg-gradient-to-br from-violet-6 dark:from-violet-12",
            "opacity-0 transition-opacity duration-500 group-hover/card:opacity-100",
          )}
        />
        <div className="z-10 space-y-1">
          <span className="text-gray-dim font-mono text-xs">{createdAt}</span>
          <h3 className="text-lg">{headline}</h3>
          <p className="text-gray-dim pt-2">{subline}</p>
        </div>
        <div
          className={clsx(
            "text-gray-dim relative -z-10 hidden overflow-hidden px-4 text-xl leading-relaxed opacity-50 sm:block",
            "after:absolute after:inset-x-0 after:bottom-0 after:h-full after:bg-gradient-to-t after:content-[''] after:dark:from-black",
          )}
        >
          {children}
        </div>
      </div>
    </InfoCard>
  );
}
