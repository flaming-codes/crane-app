import { RiExternalLinkLine } from "@remixicon/react";
import { ExternalLink } from "./external-link";
import { ReactNode } from "react";
import { clsx } from "clsx";
export function ProvidedByLabel(props: {
  headline?: string;
  source: string;
  sourceUrl: string;
  icon?: ReactNode;
  className?: string;
}) {
  const {
    headline = "Data provided by",
    source,
    sourceUrl,
    icon,
    className,
  } = props;

  return (
    <p className={clsx("text-gray-dim text-right text-xs", className)}>
      {headline}{" "}
      <ExternalLink
        href={sourceUrl}
        className="inline-flex items-center gap-1 underline underline-offset-4"
      >
        {source}
        {icon || <RiExternalLinkLine size={10} className="text-gray-dim" />}
      </ExternalLink>
    </p>
  );
}

export function DataProvidedByCRANLabel(props: { className?: string }) {
  const { className } = props;

  return (
    <ProvidedByLabel
      source="CRAN"
      sourceUrl="https://cran.r-project.org/"
      className={className}
    />
  );
}
