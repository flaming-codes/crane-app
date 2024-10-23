import { Link, useLocation } from "@remix-run/react";
import classNames from "classnames";
import { cva } from "cva";
import { PropsWithChildren } from "react";
import { useHydrated } from "remix-utils/use-hydrated";

type Props = PropsWithChildren<{
  className?: string;
}>;

const twBase = cva({
  base: [
    "full-width overflow-x-auto border-y text-xs sticky top-14 backdrop-blur-lg",
    "border-gray-6 dark:border-gray-12",
  ],
});

export function Anchors(props: Props) {
  const { children, className } = props;

  return (
    <nav className={twBase({ className })}>
      <div className="flex">{children}</div>
    </nav>
  );
}

Anchors.displayName = "Anchors";

export function AnchorLink(props: PropsWithChildren<{ fragment: string }>) {
  const { fragment, children } = props;

  // `<NavLink>` doesn't handle hash fragments, so we have to use
  // a custom detection instead.
  const location = useLocation();
  const currentFragment = location.hash.slice(1);
  const isSelected = currentFragment === fragment;

  // Avoid hydration issues due to the hash fragment not being
  // available on the client side.
  const isHydrated = useHydrated();

  return (
    <Link
      to={`#${fragment}`}
      className={classNames(
        "min-w-32 text-center py-3 shrink-0 border-b border-transparent hover:border-gray-normal transition-colors",
        { "border-gray-11 dark:border-gray-6": isHydrated && isSelected },
      )}
    >
      {children}
    </Link>
  );
}

AnchorLink.displayName = "AnchorLink";
