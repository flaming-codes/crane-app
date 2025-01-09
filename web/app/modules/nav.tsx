import { Link } from "react-router";
import { NavSearch } from "./search.nav";
import { PropsWithChildren, useRef, useState } from "react";
import { clsx } from "clsx";
import { RiHomeFill } from "@remixicon/react";

type Props = PropsWithChildren<{
  className?: string;
  hasHomeLink?: boolean;
  hasSubtleBackground?: boolean;
  inputClassName?: string;
}>;

export default function NavigationPage(props: Props) {
  const {
    className,
    children,
    hasHomeLink,
    hasSubtleBackground,
    inputClassName,
  } = props;

  const searchContentPortalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [isFocused, setIsFocused] = useState(false);

  return (
    <>
      <nav
        className={clsx(
          "full-width sticky inset-x-0 top-0 z-10 border-b border-gray-8 backdrop-blur-lg dark:border-gray-12",
          { "bg-white/90 dark:bg-black/90": isFocused },
          {
            "border-transparent bg-black/10 dark:border-transparent dark:bg-black/25":
              !isFocused && hasSubtleBackground,
          },
          className,
        )}
      >
        <NavSearch
          searchContentRef={searchContentPortalRef}
          inputRef={inputRef}
          isFocused={isFocused}
          setIsFocused={setIsFocused}
          inputClassName={inputClassName}
          actions={
            hasHomeLink ? (
              <Link
                to="/"
                className="group flex h-full items-center pl-4"
                title="Landing page"
              >
                <RiHomeFill
                  size={18}
                  className="text-gray-dim group-hover:animate-wiggle-more group-hover:animate-infinite"
                />
                <span className="sr-only">Home</span>
              </Link>
            ) : null
          }
        />
      </nav>

      {children}

      <div id="search-content-portal" ref={searchContentPortalRef} />
    </>
  );
}
