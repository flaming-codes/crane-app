import { Link } from "@remix-run/react";
import { cva } from "cva";
import { PropsWithChildren } from "react";

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

export function AnchorLink(props: PropsWithChildren<{ fragment: string }>) {
  const { fragment, children } = props;

  return (
    <Link
      to={`#${fragment}`}
      className="min-w-24 text-center py-3 shrink-0 flex-1 border-b border-transparent hover:border-gray-normal transition-colors"
    >
      {children}
    </Link>
  );
}
