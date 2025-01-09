import { useFetcher } from "react-router";
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

                <div className="space-y-3" hidden={!hasAnyHits}>
                  <Separator />
                  <p hidden className="text-gray-dim text-end text-xs">
                    Results are retrieved via hybrid semantic and full text
                    search
                  </p>
                  <p className="text-gray-dim text-end text-xs">
                    Results are retrieved via full text search
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
