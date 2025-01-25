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
          "full-width border-gray-8 dark:border-gray-12 sticky inset-x-0 top-0 z-10 border-b backdrop-blur-lg",
          { "bg-[#fff]/90 dark:bg-[#000]/90": isFocused },
          {
            "border-transparent bg-[#000]/10 dark:border-transparent dark:bg-[#000]/25":
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
