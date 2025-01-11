import { useFetcher } from "react-router";
import { useLockBodyScroll } from "@uidotdev/usehooks";
import {
  ChangeEvent,
  PropsWithChildren,
  ReactNode,
  RefObject,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { ClientOnly } from "remix-utils/client-only";
import { useKeyboardEvent, useKeyboardShortcut } from "./app";
import { Separator } from "./separator";
import { sendEvent } from "./plausible";
import { debounce } from "es-toolkit";
import { SearchIdlePlaceholder } from "./search.idle-placeholder";
import {
  PackageSemanticSearchHit,
  BaseSearchHit,
  SearchHitsResults,
  PackageHit,
  AuthorHit,
} from "./search.hit";
import { SearchInput } from "./search.input";
import { ProvidedByLabel } from "./provided-by-label";

type Props = {
  searchContentRef: RefObject<HTMLDivElement>;
  inputRef: RefObject<HTMLInputElement>;
  isFocused: boolean;
  setIsFocused: (isFocused: boolean) => void;
  actions?: ReactNode;
  inputClassName?: string;
};

const fallbackSearchResults: SearchHitsResults = {
  combined: [],
  authors: { hits: [] },
  packages: { hits: { lexical: [], semantic: [], isSemanticPreferred: false } },
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
        edges: ["trailing"],
      },
    ),
  );

  const [input, setInput] = useSyncedQueryHash();

  const onChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setInput(e.target.value);

      const data = new FormData();
      data.set("q", e.target.value);
      data.set("intent", "all");

      debouncedFetcher.current(data);
    },
    [setInput],
  );

  const onSelect = useCallback(() => {
    setInput("");
    setIsFocused(false);
    inputRef.current?.blur();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isFocused || !inputRef.current || !inputRef.current.value) {
      return;
    }

    // Select the text in the input field
    inputRef.current.setSelectionRange(0, inputRef.current.value.length);
    // Trigger a change event to populate the search results
    onChange({ target: inputRef.current } as ChangeEvent<HTMLInputElement>);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFocused]);

  useKeyboardEvent(
    "Escape",
    useCallback(() => {
      if (!isFocused) {
        return;
      }
      //setSearchParams({ q: "" });
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
      <SearchInput
        input={input}
        inputRef={inputRef}
        isFocused={isFocused}
        setIsFocused={setIsFocused}
        actions={actions}
        inputClassName={inputClassName}
        onChange={onChange}
      />
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
    onSelect: (item?: BaseSearchHit | PackageSemanticSearchHit) => void;
  }>,
) {
  const { data, isDataExpected, onSelect, children } = props;
  const { combined } = data;
  const hasAnyHits = combined.length > 0;

  useLockBodyScroll();

  return (
    <div className="fixed left-0 top-14 z-10 h-[calc(100%-56px)] w-full animate-fade overflow-y-auto bg-white/90 py-16 backdrop-blur-xl animate-duration-150 dark:bg-black/90">
      <div className="content-grid">
        <div className="full-width">
          <div className="flex flex-col gap-32">
            {isDataExpected ? (
              <>
                <section>
                  {hasAnyHits ? (
                    <div className="space-y-4">
                      <ul className="flex flex-col gap-6">
                        {combined.map((item) => (
                          <li key={item.name}>
                            {"synopsis" in item ? (
                              <PackageHit
                                item={item}
                                onClick={() => {
                                  onSelect(item);
                                  sendEvent("search-suggestion-selected", {
                                    props: {
                                      category: "package",
                                      suggestion: item.name,
                                    },
                                  });
                                }}
                              />
                            ) : (
                              <AuthorHit
                                item={item}
                                onClick={() => {
                                  onSelect(item);
                                  sendEvent("search-suggestion-selected", {
                                    props: {
                                      category: "author",
                                      suggestion: item.name,
                                    },
                                  });
                                }}
                              />
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <p className="text-gray-dim">No results found</p>
                  )}
                </section>

                <div className="space-y-2" hidden={!hasAnyHits}>
                  <Separator />
                  <p className="text-gray-dim pt-2 text-end text-xs">
                    Results retrieved via hybrid semantic and full text search
                  </p>
                  <ProvidedByLabel
                    headline="Embeddings generated by"
                    source="Google Gemini text-embedding-004"
                    sourceUrl="https://ai.google.dev/gemini-api/docs/models/gemini#text-embedding"
                  />
                </div>
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

/**
 * Custom hook that synchronizes a query parameter (`q`) with the URL hash.
 * Avoid the re-rendering & reloading of `loaders` by React Router, this
 * would be the case if we use `useSearchParams` directly.
 *
 * @returns A tuple containing:
 * - `q`: The current value of the query parameter `q`.
 * - `combinedSetter`: A function to update the query parameter `q` and synchronize it with the URL hash.
 *
 * @example
 * const [q, setQ] = useSyncedQueryHash();
 *
 * // To update the query parameter `q`:
 * setQ("newQueryValue");
 */
function useSyncedQueryHash() {
  const [q, setQ] = useState("");

  useLayoutEffect(() => {
    const getValue = () => {
      const hashes = new URLSearchParams(window.location.hash.replace("#", ""));
      return hashes.get("q") || "";
    };
    setQ(getValue());
  }, []);

  const combinedSetter = (next: string) => {
    setQ(next);
    const existingHashes = new URLSearchParams(
      window.location.hash.replace("#", ""),
    );
    existingHashes.delete("q");
    if (next) {
      existingHashes.set("q", next);
    }
    window.location.hash = existingHashes.toString();
  };

  return [q, combinedSetter] as const;
}
