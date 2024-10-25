import { Link, useLocation } from "@remix-run/react";
import { RiArrowRightLine } from "@remixicon/react";
import { useDebounce } from "@uidotdev/usehooks";
import clsx from "clsx";
import MiniSearch from "minisearch";
import { useState, useEffect } from "react";
import { Dependency, Pkg } from "../data/types";
import { InfoPill } from "./info-pill";

type Props = Pick<
  Pkg,
  | "depends"
  | "imports"
  | "enhances"
  | "suggests"
  | "linkingto"
  | "reverse_depends"
  | "reverse_imports"
  | "reverse_suggests"
  | "reverse_enhances"
  | "reverse_linkingto"
>;

type SearchableDependency = Dependency & { group: string };

export function PackageDependencySearch(props: Props) {
  const {
    depends,
    imports,
    enhances,
    suggests,
    linkingto,
    reverse_depends,
    reverse_imports,
    reverse_suggests,
    reverse_enhances,
    reverse_linkingto,
  } = props;

  const totalCounts: Array<[string, number]> = [
    ["Depends", depends?.length ?? 0],
    ["Imports", imports?.length ?? 0],
    ["Enhances", enhances?.length ?? 0],
    ["Suggests", suggests?.length ?? 0],
    ["Linking To", linkingto?.length ?? 0],
    ["Reverse Depends", reverse_depends?.length ?? 0],
    ["Reverse Imports", reverse_imports?.length ?? 0],
    ["Reverse Suggests", reverse_suggests?.length ?? 0],
    ["Reverse Enhances", reverse_enhances?.length ?? 0],
    ["Reverse LinkingTo", reverse_linkingto?.length ?? 0],
  ];

  const hasAny = totalCounts.some(([, count]) => count > 0);

  const [input, setInput] = useState("");
  const [searchResults, setSearchResults] = useState<
    Array<SearchableDependency>
  >([]);
  const [store, setStore] = useState<MiniSearch<SearchableDependency>>(() =>
    initSearch(props),
  );

  // use debounce search
  const debouncedSearch = useDebounce(input, 150);
  useEffect(() => {
    const results = store.search(debouncedSearch, { fuzzy: 0.8, prefix: true });
    setSearchResults(
      results.map((r) => ({
        name: r.name,
        link: r.link,
        group: r.group,
      })),
    );
  }, [debouncedSearch]);

  const location = useLocation();
  useEffect(() => {
    return;
    // Remix doesn't unmount Outlets when navigating to a different route,
    // so we need to reset the search state when the route changes.
    setInput("");
    setSearchResults([]);
  }, [location.pathname]);

  if (!hasAny) {
    return null;
  }

  const groupedResults = searchResults.reduce(
    (acc, item) => {
      if (!acc[item.group]) {
        acc[item.group] = [];
      }
      acc[item.group].push(item);
      return acc;
    },
    {} as Record<string, Array<SearchableDependency>>,
  );

  return (
    <>
      <div
        className={clsx(
          "relative border-t border-gray-dim bg-gradient-to-b rounded-xl min-h-16 flex flex-col items-center p-4 overflow-hidden",
        )}
      >
        <form
          className="peer relative w-full flex items-center gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            const input = document.getElementById("search") as HTMLInputElement;
            setInput(input.value);
          }}
        >
          <input
            type="text"
            id="search"
            placeholder="Type to search dependencies..."
            className="bg-transparent p-1 flex-grow focus:outline-none"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          {input ? (
            <button
              type="button"
              onClick={() => {
                setInput("");
                store.search("");
              }}
              className="text-gray-dim border bg-iris-ghost border-gray-normal px-2 py-1 rounded-md text-xs uppercase"
            >
              Clear
            </button>
          ) : null}
          <button
            type="submit"
            className="bg-iris-ui px-2 py-1 rounded-md border border-gray-dim text-xs uppercase"
          >
            Search
          </button>
        </form>

        <div className="absolute isolate bg-gradient-to-b inset-0 from-gray-4 dark:from-gray-12 -z-10 peer-focus-within:from-iris-6 dark:peer-focus-within:from-iris-12" />
      </div>

      {!input ? (
        <ul className="flex gap-2 flex-wrap">
          {totalCounts.map(([group, count]) =>
            count ? (
              <li key={group}>
                <InfoPill label={group}>
                  {count} {count === 1 ? "package" : "packages"}
                </InfoPill>
              </li>
            ) : null,
          )}
        </ul>
      ) : null}

      {input ? (
        <ul className="grid grid-cols-1 gap-4">
          {Object.entries(groupedResults).map(([group, items]) => (
            <li key={group}>
              <ul className="flex flex-wrap gap-2">
                {items.map((item) => (
                  <li key={item.name}>
                    <Link to={item.link || `/package/${item.link}`}>
                      <InfoPill
                        label={item.group}
                        className="bg-gray-ghost transition-colors"
                      >
                        {item.name}{" "}
                        <RiArrowRightLine
                          size={16}
                          className="group-hover/pill:animate-wiggle-more group-hover/pill:animate-infinite"
                        />
                      </InfoPill>
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      ) : null}
    </>
  );
}

function initSearch(params: Props): MiniSearch<SearchableDependency> {
  const {
    depends,
    imports,
    enhances,
    suggests,
    linkingto,
    reverse_depends,
    reverse_imports,
    reverse_suggests,
    reverse_enhances,
    reverse_linkingto,
  } = params;

  const fields: Array<keyof Dependency> = ["name"];
  const storeFields: Array<keyof SearchableDependency> = [
    "name",
    "link",
    "group",
  ];
  const store = new MiniSearch({
    fields, // fields to index for full-text search
    storeFields, // fields to return with search results
  });

  const groups = [
    ["Depends", depends],
    ["Imports", imports],
    ["Enhances", enhances],
    ["Suggests", suggests],
    ["Linking To", linkingto],
    ["Reverse Depends", reverse_depends],
    ["Reverse Imports", reverse_imports],
    ["Reverse Suggests", reverse_suggests],
    ["Reverse Enhances", reverse_enhances],
    ["Reverse LinkingTo", reverse_linkingto],
  ] as const;

  let items: Array<SearchableDependency> = [];

  groups.forEach(([group, dependencies]) => {
    if (dependencies && dependencies.length) {
      items = items.concat(
        dependencies.map((d) => ({
          id: `${d.name}-${group}`,
          name: d.name,
          link: `/package/${d.name}`,
          group,
        })),
      );
    }
  });

  // Deduplicate items
  items = items.filter(
    (item, index, self) =>
      index ===
      self.findIndex((t) => t.name === item.name && t.group === item.group),
  );

  store.addAll(items);

  return store;
}
