import { RiGlassesFill, RiCloseFill } from "@remixicon/react";
import { PackageSemanticSearchHit } from "../data/package.shape";
import { SearchHit } from "./search.hit";

export function SearchIdlePlaceholder(props: {
  onSelect: (item?: SearchHit | PackageSemanticSearchHit) => void;
}) {
  const { onSelect } = props;

  return (
    <section className="flex flex-col items-center gap-6">
      <p hidden className="text-md text-center">
        Ready when you are{" "}
        <RiGlassesFill
          size={32}
          className="mb-2 ml-2 inline animate-wiggle animate-duration-700 animate-infinite"
        />
      </p>
      <div className="text-gray-dim mt-28 space-y-1 text-center text-sm">
        <p>
          Press{" "}
          <kbd className="font-mono font-bold">
            {navigator?.platform?.toLowerCase().includes("mac") ? "⌘" : "Ctrl"}
          </kbd>{" "}
          + <kbd className="font-mono font-bold">K</kbd> to open search from
          anywhere
        </p>
        <p>
          Use <kbd className="font-mono font-bold">Esc</kbd> to close it
        </p>
      </div>
      <button
        className="bg-gray-ghost border-gray-dim text-gray-dim flex items-center gap-2 overflow-hidden rounded-md border px-2 py-1 text-sm"
        onClick={() => onSelect(undefined)}
      >
        <span className="leading-none">Close</span>
        <RiCloseFill size={16} className="inline" />
      </button>
    </section>
  );
}
