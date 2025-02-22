import { Link, useLocation } from "react-router";
import { clsx } from "clsx";
import { cva } from "cva";
import {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useHydrated } from "remix-utils/use-hydrated";
import { clamp } from "es-toolkit";

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
 * Hook that scroll-spies on anchor elements by:
 * 1. Defining a "reference line" that shifts from ~40% of the viewport height
 *    up to ~80% as the user scrolls from top to bottom.
 * 2. On each scroll (throttled via requestAnimationFrame),
 *    we measure the distance of each anchor's center to the reference line and pick the closest.
 */
function useActiveAnchor(anchorIds: string[], initialAnchor: string): string {
  const [activeAnchor, setActiveAnchor] = useState(initialAnchor);

  // We'll store actual DOM elements here so we don't need to query them repeatedly.
  const anchorElementsRef = useRef<HTMLElement[]>([]);

  // Build a list of anchor elements on mount or when anchorIds changes.
  useEffect(() => {
    anchorElementsRef.current = anchorIds
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];
  }, [anchorIds]);

  /**
   * This function calculates the reference line position, finds the closest anchor,
   * and updates `activeAnchor` if needed.
   */
  const updateActiveAnchor = useCallback(() => {
    if (!anchorElementsRef.current.length) return;

    const docHeight = document.documentElement.scrollHeight;
    const winHeight = window.innerHeight;
    const scrollY = window.scrollY;

    // How far along we are in scrolling from 0 (top) to 1 (very bottom).
    const scrollRatio = clamp(scrollY / (docHeight - winHeight), 0, 1);

    // Define linePercentage to move from ~40% -> ~80% of the viewport
    // as the user goes from top -> bottom.
    const linePercentage = 0.4 + 0.4 * scrollRatio; // [0.4..0.8]
    const lineY = linePercentage * winHeight;

    let closestId = "";
    let smallestDistance = Number.MAX_SAFE_INTEGER;

    // Iterate over each anchor element and check its center position.
    for (const el of anchorElementsRef.current) {
      const rect = el.getBoundingClientRect();
      const elementCenter = rect.top + rect.height / 2;
      const distance = Math.abs(elementCenter - lineY);

      if (distance < smallestDistance) {
        smallestDistance = distance;
        closestId = el.id;
      }
    }

    if (closestId && closestId !== activeAnchor) {
      setActiveAnchor(closestId);
    }
  }, [activeAnchor]);

  // Use a scroll listener that throttles via requestAnimationFrame.
  useEffect(() => {
    let ticking = false;

    function handleScroll() {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateActiveAnchor();
          ticking = false;
        });
        ticking = true;
      }
    }

    // Update immediately, in case the user is mid-page or there's a hash.
    updateActiveAnchor();

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [updateActiveAnchor]);

  return activeAnchor;
}

type AnchorsProps = Props & {
  anchorIds: string[];
};

export function Anchors({ children, className, anchorIds }: AnchorsProps) {
  const location = useLocation();

  // Prefer the URL hash if available, otherwise default to the first anchor.
  // (If none, default to an empty string.)
  const initialAnchor = location.hash.slice(1) || anchorIds[0] || "";

  // Use our custom scroll-spy hook to track active anchor.
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

  // If we’re hydrated, rely on the real-time active anchor from scroll.
  // Otherwise fall back to the URL hash.
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
