import { Link } from "@remix-run/react";
import {
  RiArrowRightSLine,
  RiCloseFill,
  RiFireFill,
  RiGlassesFill,
} from "@remixicon/react";
import { useLockBodyScroll } from "@uidotdev/usehooks";
import {
  ChangeEvent,
  PropsWithChildren,
  ReactNode,
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
import clsx from "clsx";
import { sendEvent } from "./plausible";

type Props = {
  searchContentRef: RefObject<HTMLDivElement>;
  inputRef: RefObject<HTMLInputElement>;
  isFocused: boolean;
  setIsFocused: (isFocused: boolean) => void;
  actions?: ReactNode;
  inputClassName?: string;
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
  const {
    searchContentRef,
    inputRef,
    isFocused,
    setIsFocused,
    actions,
    inputClassName,
  } = props;

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
      action: "/api/search?index",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSelect = useCallback(() => {
    setInput("");
    setIsFocused(false);
    inputRef.current?.blur();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isFocused]),
  );

  useKeyboardShortcut(
    "cmd+k",
    useCallback(() => {
      inputRef.current?.focus();
      setIsFocused(true);
      sendEvent("focus-search-shortcut-used", {
        props: {
          origin: window.location.pathname,
        },
      });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
  );

  return (
    <>
      <div className="flex h-14 items-center">
        <input
          ref={inputRef}
          type="search"
          autoCapitalize="none"
          autoCorrect="off"
          autoComplete="off"
          spellCheck="false"
          placeholder={
            isFocused ? "Type to search for packages and authors" : "Search..."
          }
          className={clsx(
            "h-full flex-1 bg-transparent focus:outline-none",
            inputClassName,
          )}
          value={input}
          onFocus={() => setIsFocused(true)}
          onChange={onChange}
        />
        {actions}
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
    <div className="fixed left-0 top-14 z-10 h-[calc(100%-56px)] w-full animate-fade overflow-y-auto bg-white/90 py-16 backdrop-blur-xl duration-200 animate-duration-150 dark:bg-black/90">
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
                            onClick={() => {
                              onSelect(item);
                              sendEvent("search-suggestion-selected", {
                                props: {
                                  category: "package",
                                  suggestion: item.slug,
                                },
                              });
                            }}
                          >
                            <InfoPill
                              variant="iris"
                              label={<FlameOfFame score={item.score} />}
                            >
                              <span className="shrink-0">{item.name}</span>{" "}
                              <span className="text-gray-dim text-xs">
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
                            onClick={() => {
                              onSelect(item);
                              sendEvent("search-suggestion-selected", {
                                props: {
                                  category: "author",
                                  suggestion: item.slug,
                                },
                              });
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
                    className="mb-2 ml-2 inline animate-wiggle animate-infinite"
                  />
                </p>
                <div className="text-gray-dim mt-28 space-y-1 text-center text-sm">
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
                  className="bg-gray-ghost border-gray-dim text-gray-dim flex items-center gap-2 overflow-hidden rounded-md border px-2 py-1 text-sm"
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

  return (
    <RiFireFill
      size={16}
      className="animate-pulse text-ruby-9 animate-duration-1000"
    />
  );
}
