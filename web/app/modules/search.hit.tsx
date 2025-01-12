import { Link } from "react-router";
import { Database, Enums } from "../data/supabase.types.generated";
import { Tag } from "./tag";
import { PropsWithChildren, ReactNode } from "react";
import {
  RiArrowRightUpLine,
  RiBookOpenFill,
  RiCodeSSlashFill,
  RiMarkdownFill,
} from "@remixicon/react";

export type BaseSearchHit = { id: number; name: string; synopsis?: string };

export type PackageSemanticSearchHit = BaseSearchHit & {
  sources: Array<
    [
      /* source name */ string,
      /* source data */
      Database["public"]["Functions"]["match_package_embeddings"]["Returns"],
    ]
  >;
};

export type SearchHitsResults = {
  combined: Array<BaseSearchHit | PackageSemanticSearchHit>;
  authors: { hits: BaseSearchHit[] };
  packages: {
    hits: {
      lexical: BaseSearchHit[];
      semantic: PackageSemanticSearchHit[];
      isSemanticPreferred: boolean;
    };
  };
};

export function PackageHit(props: {
  item: BaseSearchHit | PackageSemanticSearchHit;
  onClick: () => void;
}) {
  const { item, onClick } = props;
  const { name, synopsis } = item;

  const sources = "sources" in item ? item.sources : [];
  const hasSources = sources.length > 0;

  const originLabel =
    "sources" in item ? "Sources from semantic search:" : "Lexical search hit";

  return (
    <>
      <HitLink
        to={`/package/${name}`}
        name={name}
        tag={<Tag borderGradients="iris">CRAN Package</Tag>}
        onClick={onClick}
      >
        {synopsis ? <p className="text-gray-dim">{synopsis}</p> : null}
      </HitLink>

      <OriginLabel>{originLabel}</OriginLabel>

      {hasSources ? (
        <ul className="mt-2 flex flex-wrap gap-2">
          {sources.map(([sourceName, sourceData], i) => {
            const data = sourceData.at(i);
            if (!data) {
              return null;
            }

            const isInternal = data.source_type === "internal";
            const hasSource = Boolean(data.source_url);

            const content = (
              <Tag size="sm" className="flex items-center gap-2 leading-none">
                {data.source_name}
                {!isInternal && hasSource ? (
                  <SourceMimeIcon mime={data.source_mime_type} />
                ) : null}
              </Tag>
            );

            return (
              <li key={sourceName} className="opacity-80">
                {isInternal ? (
                  <Link
                    to={data.source_url || `/package/${name}`}
                    prefetch="intent"
                    onClick={onClick}
                  >
                    {content}
                  </Link>
                ) : (
                  <a
                    href={data.source_url}
                    className="transition-all duration-200 hover:brightness-125"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {content}
                  </a>
                )}
              </li>
            );
          })}
        </ul>
      ) : null}
    </>
  );
}

function SourceMimeIcon({
  mime,
}: {
  mime: Enums<"package_embedding_source_mime_type">;
}) {
  switch (mime) {
    case "application/pdf":
      return <RiBookOpenFill size={12} />;
    case "text/html":
    case "text/code":
      return <RiCodeSSlashFill size={12} />;
    case "text/markdown":
      return <RiMarkdownFill size={12} />;
    default:
      return <RiArrowRightUpLine size={12} />;
  }
}

export function AuthorHit(props: { item: BaseSearchHit; onClick: () => void }) {
  const { item, onClick } = props;
  const { name } = item;

  return (
    <>
      <HitLink
        to={`/author/${name}`}
        name={name}
        tag={<Tag borderGradients="jade">CRAN Author</Tag>}
        onClick={onClick}
      />
      <OriginLabel>Lexical search hit</OriginLabel>
    </>
  );
}

function HitLink(
  props: PropsWithChildren<{
    to: string;
    name: string;
    tag: ReactNode;
    onClick: () => void;
  }>,
) {
  const { to, name, tag, onClick, children } = props;

  return (
    <Link
      to={to}
      className="transition-all duration-200 hover:brightness-125"
      prefetch="intent"
      onClick={onClick}
    >
      <div className="flex items-center gap-4 leading-none">
        <span className="text-lg font-semibold">{name}</span>
        {tag}
      </div>
      {children}
    </Link>
  );
}

function OriginLabel(props: PropsWithChildren) {
  return (
    <span className="mt-1 text-xs font-semibold opacity-50">
      {props.children}
    </span>
  );
}
