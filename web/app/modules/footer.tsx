import { Link } from "@remix-run/react";
import { ExternalLink } from "./external-link";
import { cva, VariantProps } from "cva";
import { ReactNode } from "react";
import clsx from "clsx";
import { RiGithubLine } from "@remixicon/react";

const BASE_ITEMS: Array<{ label: string; href: string }> = [
  { label: "About", href: "/about" },
  { label: "Privacy", href: "/privacy" },
  { label: "Statistics", href: "/statistic" },
  { label: "Newsroom", href: "/press/news" },
];

const twBase = cva({
  base: "text-sm flex flex-wrap items-center gap-6 text-gray-dim py-6 font-light",
  variants: {
    variant: {
      start: "",
      page: "px-8  border-t border-gray-dim justify-center",
    },
  },
});

type Props = VariantProps<typeof twBase> & {
  className?: string;
  start?: ReactNode;
  end?: ReactNode;
  version?: string;
};

export function Footer(props: Props) {
  const { start, end, variant, className, version } = props;

  return (
    <footer
      className={clsx({
        "flex items-center justify-between": variant === "start",
      })}
    >
      <ul className={twBase({ variant, className })}>
        {start}

        {BASE_ITEMS.map(({ label, href }) => (
          <li key={label}>
            <Link to={href} className="underline-offset-4 hover:underline">
              {label}
            </Link>
          </li>
        ))}
        <li>
          <ExternalLink
            href="https://github.com/flaming-codes/crane-app"
            className="underline-offset-4 hover:brightness-75"
          >
            <RiGithubLine size={16} />
            <span className="sr-only">Github</span>
          </ExternalLink>
        </li>
        {version && (
          <li className="text-gray-dim font-mono text-xs opacity-70 hover:brightness-75">
            <ExternalLink href="https://github.com/flaming-codes/crane-app">
              v{version}
            </ExternalLink>
          </li>
        )}
        {end}
      </ul>
    </footer>
  );
}
