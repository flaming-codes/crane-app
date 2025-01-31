import { useLockBodyScroll } from "@uidotdev/usehooks";
import {
  ChangeEvent,
  PropsWithChildren,
  ReactNode,
  RefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { ClientOnly } from "remix-utils/client-only";
import { useKeyboardEvent, useKeyboardShortcut } from "./app";
import { Separator } from "./separator";
import { sendEvent } from "./plausible";
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
import { RiProgress8Fill } from "@remixicon/react";
import useSWR from "swr";
import * as motion from "motion/react-client";

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

const DEBOUNCE_DELAY_MS = 100;

const fetcher = (tuple: [url: string, data: FormData]) => {
  const [url, data] = tuple;
  return fetch(url, {
    method: "POST",
    body: data,
  }).then((res) => res.json());
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

  const [input, setInput] = useSyncedQueryHash();
  const [query, setQuery] = useState<FormData | null>(null);

  const { data: actionData, isValidating: isBusy } = useSWR<SearchHitsResults>(
    query ? ["/api/search?index", query] : null,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: DEBOUNCE_DELAY_MS,
      fallbackData: fallbackSearchResults,
      keepPreviousData: true,
    },
  );

  const onChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setInput(e.target.value);

      const data = new FormData();
      data.set("q", e.target.value);
      data.set("intent", "all");

      setQuery(data);
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
      inputRef.current?.setSelectionRange(0, inputRef.current.value.length);
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
      {isBusy ? (
        <div className="text-gray-ui animate-fade absolute top-5 right-1">
          <RiProgress8Fill size={18} className="animate-pulse" />
        </div>
      ) : null}

      {isFocused && searchContentRef.current && actionData ? (
        <ClientOnly>
          {() =>
            createPortal(
              <SearchResults
                state={isBusy ? "loading" : "idle"}
                data={actionData}
                isDataExpected={input.length > 0}
                isBusy={isBusy}
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
    isBusy?: boolean;
    onSelect: (item?: BaseSearchHit | PackageSemanticSearchHit) => void;
  }>,
) {
  const { state, data, isDataExpected, isBusy, onSelect, children } = props;
  const { combined } = data;
  const hasAnyHits = combined.length > 0;

  useLockBodyScroll();

  // Scroll to top when the search results are done loading.
  const containerRef = useRef<HTMLDivElement>(null);
  const previousState = useRef<"idle" | "loading" | "submitting">("idle");
  useEffect(() => {
    if (state === "idle" && previousState.current === "loading") {
      containerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    }
    return () => {
      previousState.current = state;
    };
  }, [state]);

  return (
    <div
      ref={containerRef}
      className="animate-fade animate-duration-150 fixed top-14 left-0 z-10 h-[calc(100%-56px)] w-full overflow-y-auto bg-[#fff]/90 py-16 backdrop-blur-xl dark:bg-[#000]/90"
    >
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
                          <motion.li
                            key={item.name}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5, ease: "easeInOut" }}
                          >
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
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  ) : isBusy ? null : (
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

  useEffect(() => {
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
