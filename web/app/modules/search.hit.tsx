import { Link } from "react-router";
import { Database } from "../data/supabase.types.generated";
import { Tag } from "./tag";
import { RiArrowRightUpLine } from "@remixicon/react";

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
  authors: { hits: BaseSearchHit[] };
  packages: {
    hits: {
      lexical: BaseSearchHit[];
      semantic: PackageSemanticSearchHit[];
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

  return (
    <div>
      <Link
        to={`/package/${name}`}
        className="transition-all duration-200 hover:brightness-125"
        onClick={onClick}
      >
        <div className="flex items-center gap-4 leading-none">
          <span className="text-lg font-semibold">{name}</span>
          <Tag gradients="iris">CRAN Package</Tag>
        </div>
        {synopsis ? <p className="text-gray-dim">{synopsis}</p> : null}
      </Link>
      {hasSources ? (
        <div className="mt-2 flex gap-2">
          <span className="mt-1 text-xs font-semibold uppercase opacity-50">
            Sources
          </span>
          <ul className="flex flex-wrap gap-2">
            {sources.map(([sourceName, sourceData]) => {
              const refData = sourceData.at(0);
              if (!refData) {
                return null;
              }

              const content = (
                <Tag size="sm" className="flex items-center gap-2 leading-none">
                  {sourceName}{" "}
                  {refData.source_type === "remote" ? (
                    <RiArrowRightUpLine size={14} />
                  ) : null}
                </Tag>
              );

              return (
                <li key={sourceName}>
                  {refData.source_type === "internal" ? (
                    <Link
                      to={refData.source_url || `/package/${name}`}
                      className="transition-all duration-200 hover:brightness-125"
                      onClick={onClick}
                    >
                      {content}
                    </Link>
                  ) : (
                    <a
                      href={refData.source_url}
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
        </div>
      ) : null}
    </div>
  );
}
