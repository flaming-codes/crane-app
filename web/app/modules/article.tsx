import { PropsWithChildren } from "react";
import { mergeMeta } from "./meta";
import { InfoPill } from "./info-pill";
import clsx from "clsx";

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
  return [
    { title: `${article?.title} | CRAN/E` },
    { name: "description", content: article?.subline },
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
