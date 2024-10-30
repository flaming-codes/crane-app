import { Link, useLocation } from "@remix-run/react";
import clsx from "clsx";
import { cva } from "cva";
import { PropsWithChildren } from "react";
import { useHydrated } from "remix-utils/use-hydrated";

type Props = PropsWithChildren<{
  className?: string;
}>;

const twBase = cva({
  base: [
    // Tiny hack using `top-[57px]` instead of `top-14` to
    // make border of nav work correctly, otherwise it wouldn't
    // be visible.
    "full-width overflow-x-auto border-b text-xs sticky top-[57px] backdrop-blur-lg z-10",
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
      className={clsx(
        "min-w-32 shrink-0 border-b border-transparent py-3 text-center transition-colors hover:border-gray-normal",
        { "border-gray-11 dark:border-gray-6": isHydrated && isSelected },
      )}
    >
      {children}
    </Link>
  );
}

AnchorLink.displayName = "AnchorLink";

export function composeAnchorItems(
  anchors: string[],
): Array<{ name: string; slug: string }> {
  return anchors.map((anchor) => ({
    name: anchor,
    slug: encodeURIComponent(anchor.toLowerCase()),
  }));
}
