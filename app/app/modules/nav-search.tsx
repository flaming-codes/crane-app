import { Link } from "@remix-run/react";
import {
  RiArrowRightSLine,
  RiCloseFill,
  RiFireFill,
  RiGlassesFill,
  RiHomeLine,
} from "@remixicon/react";
import { useLockBodyScroll } from "@uidotdev/usehooks";
import {
  ChangeEvent,
  PropsWithChildren,
  RefObject,
  useCallback,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { ClientOnly } from "remix-utils/client-only";
import { useKeyboardEvent, useKeyboardShortcut } from "./app";
import { useDebounceFetcher } from "remix-utils/use-debounce-fetcher";
import { SearchResult } from "minisearch";
import { Separator } from "./separator";
import { InfoPill } from "./info-pill";

type Props = {
  searchContentRef: RefObject<HTMLDivElement>;
  inputRef: RefObject<HTMLInputElement>;
  isFocused: boolean;
  setIsFocused: (isFocused: boolean) => void;
};

type SearchResults = {
  authors: {
    hits: SearchResult[];
  };
  packages: {
    hits: SearchResult[];
  };
};

const fallbackSearchResults: SearchResults = {
  authors: { hits: [] },
  packages: { hits: [] },
};

export function NavSearch(props: Props) {
  const { searchContentRef, inputRef, isFocused, setIsFocused } = props;

  const [input, setInput] = useState("");
  const fetcher = useDebounceFetcher();
  const actionData =
    (fetcher.data as SearchResults | undefined) || fallbackSearchResults;

  const onChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);

    const data = new FormData();
    data.set("q", e.target.value);
    data.set("action", "all");
    fetcher.submit(data, {
      debounceTimeout: 200,
      method: "POST",
      action: "/search?index",
    });
  }, []);

  const onSelect = useCallback((item?: SearchResult) => {
    setInput("");
    setIsFocused(false);
    inputRef.current?.blur();
  }, []);

  useKeyboardEvent(
    "Escape",
    useCallback(() => {
      if (!isFocused) {
        return;
      }
      setInput("");
      setIsFocused(false);
      inputRef.current?.blur();
    }, [isFocused]),
  );

  useKeyboardShortcut(
    "cmd+k",
    useCallback(() => {
      inputRef.current?.focus();
      setIsFocused(true);
    }, []),
  );

  return (
    <>
      <div className="h-14 flex items-center">
        <input
          ref={inputRef}
          type="search"
          placeholder={
            isFocused ? "Type to search for packages and authors" : "Search"
          }
          className="flex-1 h-full bg-transparent focus:outline-none"
          value={input}
          onFocus={() => setIsFocused(true)}
          onChange={onChange}
        />
        <Link
          to="/"
          className="h-full flex items-center pl-4 group"
          title="Landing page"
        >
          <RiHomeLine
            size={18}
            className="text-gray-dim group-hover:animate-wiggle-more group-hover:animate-infinite"
          />
          <span className="sr-only">Home</span>
        </Link>
      </div>
      {isFocused && searchContentRef.current && actionData ? (
        <ClientOnly>
          {() =>
            createPortal(
              <SearchResults
                data={actionData}
                isDataExpected={input.length > 0}
                onSelect={onSelect}
              />,
              searchContentRef.current!,
            )
          }
        </ClientOnly>
      ) : null}
    </>
  );
}

export function SearchResults(
  props: PropsWithChildren<{
    data: SearchResults;
    isDataExpected?: boolean;
    onSelect: (item?: SearchResult) => void;
  }>,
) {
  const { data, isDataExpected, onSelect, children } = props;
  const { authors, packages } = data;

  useLockBodyScroll();

  return (
    <div className="fixed top-14 py-16 left-0 w-full backdrop-blur-xl bg-white/90 dark:bg-black/90 h-[calc(100%-56px)] z-10 overflow-y-auto">
      <div className="content-grid">
        <div className="full-width">
          <div className="flex flex-col gap-16">
            {isDataExpected ? (
              <>
                <section>
                  <h3 className="pb-6 text-lg">Packages</h3>
                  {packages.hits.length > 0 ? (
                    <ul className="flex flex-wrap gap-2">
                      {packages.hits.map((item) => (
                        <li key={item.id}>
                          <Link
                            to={`/package/${item.slug}`}
                            onClick={(e) => {
                              onSelect(item);
                            }}
                          >
                            <InfoPill
                              variant="iris"
                              label={<FlameOfFame score={item.score} />}
                            >
                              <span className="shrink-0">{item.name}</span>{" "}
                              <span className="text-xs text-gray-dim">
                                by{" "}
                                {sliceNamesWithEllipsis(item.author_names, 3)}
                              </span>
                              <RiArrowRightSLine
                                size={14}
                                className="text-gray-dim"
                              />
                            </InfoPill>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-dim">No packages found</p>
                  )}
                </section>

                <Separator />

                <section>
                  <h3 className="pb-6 text-lg">Authors</h3>
                  {authors.hits.length > 0 ? (
                    <ul className="flex flex-wrap gap-2">
                      {authors.hits.map((item) => (
                        <li key={item.id}>
                          <Link
                            to={`/author/${item.slug}`}
                            onClick={(e) => {
                              onSelect(item);
                            }}
                          >
                            <InfoPill
                              variant="jade"
                              label={<FlameOfFame score={item.score} />}
                            >
                              {item.name}
                            </InfoPill>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-dim">No authors found</p>
                  )}
                </section>
              </>
            ) : (
              <section className="flex flex-col items-center gap-6">
                <p className="text-md text-center">
                  Ready when you are{" "}
                  <RiGlassesFill
                    size={32}
                    className="animate-wiggle animate-infinite inline ml-2 mb-2"
                  />
                </p>
                <div className="text-sm text-center text-gray-dim space-y-1 mt-28">
                  <p>
                    Press{" "}
                    <kbd className="font-mono font-bold">
                      {navigator?.platform?.toLowerCase().includes("mac")
                        ? "⌘"
                        : "Ctrl"}
                    </kbd>{" "}
                    + <kbd className="font-mono font-bold">K</kbd> to open
                    search from anywhere
                  </p>
                  <p>
                    Use <kbd className="font-mono font-bold">Esc</kbd> to close
                    it
                  </p>
                </div>
                <button
                  className="bg-gray-ghost text-sm text-gray-dim flex items-center gap-2 rounded-md py-1 px-2 overflow-hidden border border-gray-dim"
                  onClick={() => onSelect(undefined)}
                >
                  <span>Close</span>
                  <RiCloseFill size={16} className="inline" />
                </button>
              </section>
            )}
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}

function sliceNamesWithEllipsis(names: string[], limit: number) {
  return names.length > limit ? names.slice(0, limit).concat("...") : names;
}

function FlameOfFame(props: { score: number; threshold?: number }) {
  const { score, threshold = 11 } = props;

  if (score < threshold) {
    return null;
  }

  return <RiFireFill size={16} className="text-ruby-9 animate-pulse" />;
}
