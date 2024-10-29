import { Link } from "@remix-run/react";
import {
  RiArrowRightLine,
  RiCollapseVerticalLine,
  RiExpandVerticalLine,
} from "@remixicon/react";
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

  const groupedAll: Array<[string, Dependency[]]> = [
    ["Depends", depends || []],
    ["Imports", imports || []],
    ["Enhances", enhances || []],
    ["Suggests", suggests || []],
    ["Linking To", linkingto || []],
    ["Reverse Depends", reverse_depends || []],
    ["Reverse Imports", reverse_imports || []],
    ["Reverse Suggests", reverse_suggests || []],
    ["Reverse Enhances", reverse_enhances || []],
    ["Reverse LinkingTo", reverse_linkingto || []],
  ];

  const hasAny = groupedAll.some(([, items]) => items.length > 0);

  const [input, setInput] = useState("");
  const [searchResults, setSearchResults] = useState<
    Array<SearchableDependency>
  >([]);
  const [store] = useState<MiniSearch<SearchableDependency>>(() =>
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
  }, [store, debouncedSearch]);

  const [isGroupingEnabled, setIsGroupingEnabled] = useState(true);
  const groupedSearchResults = searchResults.reduce(
    (acc, item) => {
      if (!acc[item.group]) {
        acc[item.group] = [];
      }
      acc[item.group].push(item);
      return acc;
    },
    {} as Record<string, Array<SearchableDependency>>,
  );

  if (!hasAny) {
    return null;
  }

  return (
    <>
      <div
        className={clsx(
          "border-gray-dim relative flex min-h-16 flex-col items-center overflow-hidden rounded-xl border-t bg-gradient-to-b p-4",
        )}
      >
        <form
          className="peer relative flex w-full items-center gap-4"
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
            className="flex-grow bg-transparent p-1 focus:outline-none"
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
              className="border-gray-normal text-gray-dim bg-iris-ghost rounded-md border px-2 py-1 text-xs uppercase"
            >
              Clear
            </button>
          ) : null}
          <button
            type="submit"
            className="border-gray-dim bg-iris-ui rounded-md border px-2 py-1 text-xs uppercase"
          >
            Search
          </button>
        </form>

        <div className="absolute inset-0 isolate -z-10 bg-gradient-to-b from-gray-4 peer-focus-within:from-iris-6 dark:from-gray-12 dark:peer-focus-within:from-iris-12" />
      </div>

      {!input ? (
        <ul className="flex flex-wrap gap-4">
          <li>
            <button onClick={() => setIsGroupingEnabled((prev) => !prev)}>
              <InfoPill
                className="bg-gray-ui"
                label={
                  isGroupingEnabled ? (
                    <RiExpandVerticalLine size={16} className="text-gray-dim" />
                  ) : (
                    <RiCollapseVerticalLine
                      size={16}
                      className="text-gray-dim"
                    />
                  )
                }
              >
                {isGroupingEnabled ? " Expand grouping" : "Restore grouping"}
              </InfoPill>
            </button>
          </li>
          {isGroupingEnabled ? (
            groupedAll.map(([group, items]) => {
              const count = items.length;
              if (!count) {
                return null;
              }
              return (
                <li key={group}>
                  <InfoPill label={group}>
                    {count} {count === 1 ? "package" : "packages"}
                  </InfoPill>
                </li>
              );
            })
          ) : (
            <ul className="flex flex-col gap-4">
              {groupedAll.map(([group, items]) => (
                <li key={group}>
                  <DependencyPills group={group} items={items} />
                </li>
              ))}
            </ul>
          )}
        </ul>
      ) : null}

      {input ? (
        <ul className="flex flex-col gap-4">
          {Object.entries(groupedSearchResults).map(([group, items]) => (
            <li key={group}>
              <DependencyPills group={group} items={items} />
            </li>
          ))}
        </ul>
      ) : null}
    </>
  );
}

function DependencyPills(props: { group: string; items: Array<Dependency> }) {
  const { group, items } = props;
  return (
    <ul className="flex flex-wrap gap-2">
      {items.map((item) => (
        <li key={item.name}>
          <Link to={`/package/${item.name}`}>
            <InfoPill label={group} className="bg-gray-ghost transition-colors">
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