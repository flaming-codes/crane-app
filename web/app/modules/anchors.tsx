import { Link, useLocation } from "react-router";
import { clsx } from "clsx";
import { cva } from "cva";
import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { useHydrated } from "remix-utils/use-hydrated";

type Props = PropsWithChildren<{
  className?: string;
}>;

const twBase = cva({
  base: [
    // Tiny hack using `top-[57px]` instead of `top-14` to make border of nav work correctly.
    "full-width overflow-x-auto border-b text-xs sticky top-[57px] backdrop-blur-lg z-10",
    "border-gray-6 dark:border-gray-12",
  ],
});

// Context to hold the active anchor id
const ActiveAnchorContext = createContext<string>("");

// Custom hook that uses IntersectionObserver to determine the active section
function useActiveAnchor(anchorIds: string[]): string {
  const [activeAnchor, setActiveAnchor] = useState("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Filter entries that are intersecting
        const visibleEntries = entries.filter((entry) => entry.isIntersecting);
        if (visibleEntries.length > 0) {
          // Sort by distance from the top of the viewport
          const sorted = visibleEntries.sort(
            (a, b) => a.boundingClientRect.top - b.boundingClientRect.top,
          );
          setActiveAnchor(sorted[0].target.id);
        }
      },
      {
        // Adjust threshold/rootMargin as needed for your design
        threshold: 0.5,
      },
    );

    // Observe each section element by its id
    anchorIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) {
        observer.observe(el);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [anchorIds]);

  return activeAnchor;
}

type AnchorsProps = Props & {
  anchorIds: string[];
};

export function Anchors({ children, className, anchorIds }: AnchorsProps) {
  // Get the currently active anchor based on scroll position
  const activeAnchor = useActiveAnchor(anchorIds);

  return (
    <ActiveAnchorContext.Provider value={activeAnchor}>
      <nav className={twBase({ className })}>
        <div className="flex">{children}</div>
      </nav>
    </ActiveAnchorContext.Provider>
  );
}

Anchors.displayName = "Anchors";

export function AnchorLink(props: PropsWithChildren<{ fragment: string }>) {
  const { fragment, children } = props;
  // Get the active anchor from our context
  const activeAnchor = useContext(ActiveAnchorContext);
  const location = useLocation();
  const currentFragment = location.hash.slice(1);
  const isHydrated = useHydrated();

  // Determine whether to highlight the link.
  // When hydrated, prefer the active anchor from scroll;
  // otherwise fallback to the URL hash.
  const isSelected = isHydrated
    ? activeAnchor
      ? activeAnchor === fragment
      : currentFragment === fragment
    : false;

  return (
    <Link
      to={`#${fragment}`}
      className={clsx(
        "hover:border-gray-normal min-w-32 shrink-0 border-b border-transparent py-3 text-center transition-colors",
        { "border-gray-11 dark:border-gray-6": isSelected },
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
    slug: encodeURIComponent(anchor.toLowerCase().replaceAll(" ", "-")),
  }));
}
