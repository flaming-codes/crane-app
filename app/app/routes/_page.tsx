import { Outlet } from "@remix-run/react";
import { NavSearch } from "../modules/nav-search";
import { useRef, useState } from "react";
import clsx from "clsx";

export default function PackageLayoutPage() {
  const searchContentPortalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [isFocused, setIsFocused] = useState(false);

  return (
    <>
      <nav
        className={clsx(
          "border-b border-gray-8 dark:border-gray-12 sticky top-0 backdrop-blur-lg left-0 z-10",
        )}
      >
        <NavSearch
          searchContentRef={searchContentPortalRef}
          inputRef={inputRef}
          isFocused={isFocused}
          setIsFocused={setIsFocused}
        />
      </nav>

      <Outlet />

      <div id="search-content-portal" ref={searchContentPortalRef} />
    </>
  );
}
