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

  const countDependencies = depends?.length || 0;
  const countImports = imports?.length || 0;
  const countEnhances = enhances?.length || 0;
  const countSuggests = suggests?.length || 0;
  const countLinkingto = linkingto?.length || 0;
  const countReverseDepends = reverse_depends?.length || 0;
  const countReverseImports = reverse_imports?.length || 0;
  const countReverseSuggests = reverse_suggests?.length || 0;
  const countReverseEnhances = reverse_enhances?.length || 0;
  const countReverseLinkingto = reverse_linkingto?.length || 0;

  const totalCounts: Array<[string, number]> = [
    ["Depends", countDependencies],
    ["Imports", countImports],
    ["Enhances", countEnhances],
    ["Suggests", countSuggests],
    ["Linking To", countLinkingto],
    ["Reverse Depends", countReverseDepends],
    ["Reverse Imports", countReverseImports],
    ["Reverse Suggests", countReverseSuggests],
    ["Reverse Enhances", countReverseEnhances],
    ["Reverse LinkingTo", countReverseLinkingto],
  ];
  const hasAny = totalCounts.some(([, count]) => count > 0);

  const [input, setInput] = useState("");
  const [searchResults, setSearchResults] = useState<
    Array<SearchableDependency>
  >([]);
  const [store, setStore] = useState(() => {
    const fields: Array<keyof Dependency> = ["name"];
    const storeFields: Array<keyof SearchableDependency> = [
      "name",
      "link",
      "group",
    ];
    const store = new MiniSearch({
      idField: "name",
      fields, // fields to index for full-text search
      storeFields, // fields to return with search results
    });

    let items: Array<SearchableDependency> = [];
    if (depends) {
      items = items.concat(depends.map((d) => ({ ...d, group: "Depends" })));
    }
    if (imports) {
      items = items.concat(imports.map((d) => ({ ...d, group: "Imports" })));
    }
    if (enhances) {
      items = items.concat(enhances.map((d) => ({ ...d, group: "Enhances" })));
    }
    if (suggests) {
      items = items.concat(suggests.map((d) => ({ ...d, group: "Suggests" })));
    }
    if (linkingto) {
      items = items.concat(
        linkingto.map((d) => ({ ...d, group: "Linking To" })),
      );
    }
    if (reverse_depends) {
      items = items.concat(
        reverse_depends.map((d) => ({
          ...d,

          group: "Reverse Depends",
        })),
      );
    }
    if (reverse_imports) {
      items = items.concat(
        reverse_imports.map((d) => ({
          ...d,

          group: "Reverse Imports",
        })),
      );
    }
    if (reverse_suggests) {
      items = items.concat(
        reverse_suggests.map((d) => ({
          ...d,

          group: "Reverse Suggests",
        })),
      );
    }
    if (reverse_enhances) {
      items = items.concat(
        reverse_enhances.map((d) => ({
          ...d,

          group: "Reverse Enhances",
        })),
      );
    }
    if (reverse_linkingto) {
      items = items.concat(
        reverse_linkingto.map((d) => ({
          ...d,

          group: "Reverse LinkingTo",
        })),
      );
    }
    store.addAll(items);
    return store;
  });

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
          "border-t border-gray-dim bg-gradient-to-b rounded-xl min-h-16 flex flex-col items-center p-4 overflow-hidden",
          "relative ",
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

        <div className="absolute isolate bg-gradient-to-b inset-0 from-gray-12 -z-10 peer-focus-within:from-iris-12" />
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
                    <Link to={`/package/${item.name}`}>
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
