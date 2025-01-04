import { Link, useFetcher } from "react-router";
import { useLockBodyScroll } from "@uidotdev/usehooks";
import {
  ChangeEvent,
  PropsWithChildren,
  ReactNode,
  RefObject,
  useCallback,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { ClientOnly } from "remix-utils/client-only";
import { useKeyboardEvent, useKeyboardShortcut } from "./app";
import { Separator } from "./separator";
import { InfoPill } from "./info-pill";
import { clsx } from "clsx";
import { sendEvent } from "./plausible";
import { debounce } from "es-toolkit";
import { PackageSemanticSearchHit } from "../data/package.shape";
import { SearchIdlePlaceholder } from "./search.idle-placeholder";
import { FlameOfFame } from "./search.flame";
import { SearchHit, SearchHitsResults, SemanticHit } from "./search.hit";

type Props = {
  searchContentRef: RefObject<HTMLDivElement>;
  inputRef: RefObject<HTMLInputElement>;
  isFocused: boolean;
  setIsFocused: (isFocused: boolean) => void;
  actions?: ReactNode;
  inputClassName?: string;
};

const fallbackSearchResults: SearchHitsResults = {
  authors: { hits: [] },
  packages: { hits: { lexical: [], semantic: [] } },
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
  const fetcher = useFetcher();
  const actionData =
    (fetcher.data as SearchHitsResults | undefined) || fallbackSearchResults;

  const debouncedFetcher = useRef(
    debounce(
      (data: FormData) => {
        fetcher.submit(data, {
          method: "POST",
          action: "/api/search?index",
        });
      },
      100,
      {
        edges: ["leading", "trailing"],
      },
    ),
  );

  const onChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);

    const data = new FormData();
    data.set("q", e.target.value);
    data.set("intent", "all");

    debouncedFetcher.current(data);
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
            "h-full flex-1 bg-transparent outline-none focus:placeholder:opacity-30",
            "transition-all",
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
                state={fetcher.state}
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
    state: "idle" | "loading" | "submitting";
    data: SearchHitsResults;
    isDataExpected?: boolean;
    onSelect: (item?: SearchHit | PackageSemanticSearchHit) => void;
  }>,
) {
  const { state, data, isDataExpected, onSelect, children } = props;
  const { authors, packages } = data;

  const hasAuthors = authors.hits.length > 0;
  const hasLexicalHits = packages.hits.lexical.length > 0;
  const hasSemanticHits = packages.hits.semantic.length > 0;
  const hasAnyHits = hasAuthors || hasLexicalHits || hasSemanticHits;

  useLockBodyScroll();

  return (
    <div className="fixed left-0 top-14 z-10 h-[calc(100%-56px)] w-full animate-fade overflow-y-auto bg-white/90 py-16 backdrop-blur-xl animate-duration-150 dark:bg-black/90">
      <div className="content-grid">
        <div className="full-width">
          <div className="flex flex-col gap-16">
            {isDataExpected ? (
              <>
                <section>
                  {hasAnyHits ? (
                    <div className="space-y-4">
                      <ul className="flex flex-wrap gap-2">
                        {hasSemanticHits
                          ? packages.hits.semantic.map((item) => (
                              <li key={item.packageName}>
                                <SemanticHit
                                  item={item}
                                  onClick={() => {
                                    onSelect(item);
                                    sendEvent("search-suggestion-selected", {
                                      props: {
                                        category: "package",
                                        suggestion: item.packageName,
                                      },
                                    });
                                  }}
                                />
                              </li>
                            ))
                          : null}
                      </ul>
                    </div>
                  ) : (
                    state === "idle" && (
                      <p className="text-gray-dim">No results found</p>
                    )
                  )}
                </section>

                <Separator />

                <section hidden>
                  <h3 className="pb-6 text-lg">Authors</h3>
                  {authors.hits.length > 0 ? (
                    <ul className="flex flex-wrap gap-2">
                      {authors.hits.map((item, i) => (
                        <li key={item.id}>
                          <Link
                            to={`/author/${item.name}`}
                            onClick={() => {
                              onSelect(item);
                              sendEvent("search-suggestion-selected", {
                                props: {
                                  category: "author",
                                  suggestion: item.name,
                                },
                              });
                            }}
                          >
                            <InfoPill
                              variant="jade"
                              label={<FlameOfFame score={i <= 3 ? 12 : 0} />}
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
              <SearchIdlePlaceholder onSelect={onSelect} />
            )}
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}
