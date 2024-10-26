import { Link } from "@remix-run/react";
import { NavSearch } from "../modules/nav-search";
import { PropsWithChildren, useRef, useState } from "react";
import clsx from "clsx";
import { RiHomeLine } from "@remixicon/react";

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
          "border-b border-gray-8 dark:border-gray-12 sticky inset-x-0 top-0 backdrop-blur-lg z-10 full-width",
          { "bg-white/90 dark:bg-black/90": isFocused },
          {
            "bg-black/10 dark:bg-black/25 border-transparent dark:border-transparent":
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
                className="h-full flex items-center pl-4 group"
                title="Landing page"
              >
                <RiHomeLine
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
