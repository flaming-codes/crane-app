import { NavSearch } from "./search.nav";
import { PropsWithChildren, useRef, useState } from "react";
import { clsx } from "clsx";
import { NavMenu } from "./nav.menu";

type Props = PropsWithChildren<{
  className?: string;
  hasMenu?: boolean;
  hasSubtleBackground?: boolean;
  inputClassName?: string;
}>;

export default function NavigationPage(props: Props) {
  const { className, children, hasMenu, hasSubtleBackground, inputClassName } =
    props;

  const searchContentPortalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [isFocused, setIsFocused] = useState(false);

  const navClasses = clsx(
    "full-width border-gray-8 dark:border-gray-12",
    "sticky inset-x-0 top-0 z-10 border-b backdrop-blur-lg",
    { "bg-[#fff]/90 dark:bg-[#000]/90": isFocused },
    {
      "border-transparent bg-[#000]/10 dark:border-transparent dark:bg-[#000]/25":
        !isFocused && hasSubtleBackground,
    },
    className,
  );

  return (
    <>
      <nav className={navClasses}>
        <NavSearch
          searchContentRef={searchContentPortalRef}
          inputRef={inputRef}
          isFocused={isFocused}
          setIsFocused={setIsFocused}
          inputClassName={inputClassName}
          actions={hasMenu ? <NavMenu /> : null}
        />
      </nav>

      {children}

      <div id="search-content-portal" ref={searchContentPortalRef} />
    </>
  );
}
