import { Link } from "@remix-run/react";
import { RiHomeLine } from "@remixicon/react";
import { useLockBodyScroll } from "@uidotdev/usehooks";
import {
  ChangeEvent,
  PropsWithChildren,
  RefObject,
  useCallback,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { ClientOnly } from "remix-utils/client-only";
import { useKeyboardEvent } from "./app";
import { useDebounceFetcher } from "remix-utils/use-debounce-fetcher";

type Props = {
  searchContentRef: RefObject<HTMLDivElement>;
  inputRef: RefObject<HTMLInputElement>;
  isFocused: boolean;
  setIsFocused: (isFocused: boolean) => void;
};

export function NavSearch(props: Props) {
  const { searchContentRef, inputRef, isFocused, setIsFocused } = props;

  const [input, setInput] = useState("");
  const fetcher = useDebounceFetcher();

  const onChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);

    const data = new FormData();
    data.set("q", e.target.value);
    data.set("action", "all");
    fetcher.submit(data, {
      debounceTimeout: 300,
      method: "POST",
      action: "/search?index",
    });
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

  return (
    <>
      <div className="h-14 flex items-center">
        <input
          ref={inputRef}
          type="search"
          placeholder="Search"
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
      {isFocused && searchContentRef.current ? (
        <ClientOnly>
          {() =>
            createPortal(
              <SearchResults input={input} setInput={setInput}>
                <pre>
                  {" "}
                  {JSON.stringify(
                    {
                      state: fetcher.state,
                      data: fetcher.data,
                      json: fetcher.json,
                      action: fetcher.formAction || "-",
                    },
                    null,
                    2,
                  )}
                </pre>
              </SearchResults>,
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
    input: string;
    setInput: (input: string) => void;
  }>,
) {
  const { input, setInput, children } = props;

  useLockBodyScroll();

  return (
    <div className="fixed top-14 left-0 w-full backdrop-blur-xl bg-white/90 dark:bg-black/90 h-[calc(100%-56px)] z-10 overflow-y-auto">
      <div className="content-grid">
        <div className="full-width">{children}</div>
      </div>
    </div>
  );
}
