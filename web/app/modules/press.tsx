import { PropsWithChildren, ReactNode } from "react";
import { InfoPill } from "./info-pill";
import { clsx } from "clsx";
import { InfoCard } from "./info-card";
import { ClientOnly } from "remix-utils/client-only";
import { cva, VariantProps } from "cva";

type Props = PropsWithChildren<
  Required<VariantProps<typeof twBase>> & {
    createdAt: string;
    updatedAt?: string;
    authors: string[];
    footer?: ReactNode;
  }
>;

const twBase = cva({
  base: [
    "inline-block bg-linear-to-tl bg-clip-text font-semibold text-transparent",
    "animate-fade",
    "text-gray-dim mt-8 w-3/4 text-xl leading-relaxed md:w-2/3",
  ],
  variants: {
    gradient: {
      amethyst:
        "from-violet-9 to-purple-11 dark:from-violet-10 dark:to-purple-7",
      opal: "from-iris-10 to-sky-10 dark:to-sky-8",
    },
  },
});

export function ArticleSynopsis(props: Props) {
  const { createdAt, updatedAt, authors, gradient, children, footer } = props;

  return (
    <section className="space-y-12">
      <ClientOnly fallback={<div className="h-[215px]" />}>
        {() => <div className={twBase({ gradient })}>{children}</div>}
      </ClientOnly>
      <footer className="animate-fade flex gap-2">
        <ClientOnly
          fallback={
            <InfoPill size="sm" label="Publication">
              ...
            </InfoPill>
          }
        >
          {() => (
            <InfoPill size="sm" label="Publication" className="animate-fade">
              <time dateTime={createdAt}>{createdAt}</time>
              {updatedAt && (
                <>
                  {" "}
                  (updated <time dateTime={updatedAt}>{updatedAt}</time>)
                </>
              )}
            </InfoPill>
          )}
        </ClientOnly>
        <InfoPill size="sm" label="Authors">
          {authors.join(", ")}
        </InfoPill>
        {footer}
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
    variant: "amethyst" | "opal";
  }>,
) {
  const { headline, subline, createdAt, variant, children } = props;

  return (
    <InfoCard variant="none" className="relative isolate">
      <div className="grid gap-4 sm:min-h-60 sm:grid-cols-2">
        <div
          className={clsx(
            "absolute inset-0 bg-linear-to-br",
            "opacity-0 transition-opacity duration-500 group-hover/card:opacity-100 group-hover/card:backdrop-blur-xs",
            {
              "from-violet-6 dark:from-violet-12": variant === "amethyst",
              "from-sky-4 dark:from-skya-12": variant === "opal",
            },
          )}
        />
        <div className="z-10 space-y-1">
          <ClientOnly
            fallback={
              <span className="text-gray-dim font-mono text-xs">...</span>
            }
          >
            {() => (
              <span className="text-gray-dim font-mono text-xs">
                {createdAt}
              </span>
            )}
          </ClientOnly>
          <h3 className="text-lg">{headline}</h3>
          <p className="text-gray-dim pt-2">{subline}</p>
        </div>
        <div
          className={clsx(
            "text-gray-dim relative -z-10 hidden overflow-hidden px-4 text-xl leading-relaxed opacity-50 sm:block",
            "after:absolute after:inset-x-0 after:bottom-0 after:h-full after:bg-linear-to-t after:content-[''] dark:after:from-black",
          )}
        >
          {children}
        </div>
      </div>
    </InfoCard>
  );
}
