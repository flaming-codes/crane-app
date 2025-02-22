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
    // Using `top-[57px]` ensures the sticky nav’s border is visible.
    "full-width overflow-x-auto border-b text-xs sticky top-[57px] backdrop-blur-lg z-10",
    "border-gray-6 dark:border-gray-12",
  ],
});

// Context to provide our current (active) anchor’s ID.
const ActiveAnchorContext = createContext<string>("");

/**
 * Hook that scroll-spies on anchorIds by:
 * 1. Determining a “reference line” that shifts from ~30% viewport height to ~70% viewport height
 *    depending on how far down the user is.
 * 2. On each scroll, we find which anchor’s vertical center is closest to that reference line.
 */
function useActiveAnchor(anchorIds: string[], initialAnchor: string) {
  const [activeAnchor, setActiveAnchor] = useState(initialAnchor);

  useEffect(() => {
    function handleScroll() {
      const docHeight = document.documentElement.scrollHeight;
      const winHeight = window.innerHeight;
      const scrollY = window.scrollY;

      // The ratio of how far the user has scrolled, from 0 (top) to 1 (bottom).
      // We clamp just in case (though not strictly necessary).
      const scrollRatio = Math.max(
        0,
        Math.min(1, scrollY / (docHeight - winHeight)),
      );

      /**
       * We define linePercentage to move from 30% -> 70% of the screen
       * as the user goes from top to bottom.
       */
      const linePercentage = 0.4 + 0.4 * scrollRatio; // [0.4 .. 0.8]

      // The Y-position (in viewport coordinates) of our reference line.
      const lineY = linePercentage * winHeight;

      let closestId = "";
      let smallestDistance = Number.MAX_SAFE_INTEGER;

      for (const id of anchorIds) {
        const el = document.getElementById(id);
        if (!el) continue;

        const rect = el.getBoundingClientRect();
        // Approximate center of the element
        const elementCenter = rect.top + rect.height / 2;

        const distance = Math.abs(elementCenter - lineY);
        if (distance < smallestDistance) {
          smallestDistance = distance;
          closestId = id;
        }
      }

      if (closestId && closestId !== activeAnchor) {
        setActiveAnchor(closestId);
      }
    }

    // Highlight the correct anchor immediately on mount, in case user is mid-page or there's a hash.
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [anchorIds, activeAnchor]);

  return activeAnchor;
}

type AnchorsProps = Props & {
  anchorIds: string[];
};

export function Anchors({ children, className, anchorIds }: AnchorsProps) {
  const location = useLocation();

  // Prefer the URL hash if available, otherwise default to the first anchor.
  // (If none, we’ll have an empty string.)
  const initialAnchor = location.hash.slice(1) || anchorIds[0] || "";

  // Use our custom scroll-spy hook.
  const activeAnchor = useActiveAnchor(anchorIds, initialAnchor);

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
  const activeAnchor = useContext(ActiveAnchorContext);

  const location = useLocation();
  const currentFragment = location.hash.slice(1);
  const isHydrated = useHydrated();

  // If we’re hydrated, we rely on the real-time active anchor from scroll.
  // If not, fall back to checking the initial location hash.
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
