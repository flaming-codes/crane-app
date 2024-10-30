import { RiExternalLinkLine } from "@remixicon/react";
import { ExternalLink } from "./external-link";

export function DataProvidedByCRANLabel() {
  return (
    <p className="text-gray-dim mt-16 text-right text-xs">
      Data provided by{" "}
      <ExternalLink
        href="https://github.com/r-hub/cranlogs.app"
        className="inline-flex items-center gap-1 underline underline-offset-4"
      >
        cranlogs
        <RiExternalLinkLine size={10} className="text-gray-dim" />
      </ExternalLink>
    </p>
  );
}
