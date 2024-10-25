import { RiGithubLine } from "@remixicon/react";
import { PropsWithChildren, ReactNode } from "react";
import { ExternalLink } from "./external-link";

type Props = PropsWithChildren<{
  href: string;
  children: ReactNode;
  className?: string;
  icon?: JSX.Element;
}>;

export function ExternalLinkPill(props: Props) {
  const { href, children, className, icon } = props;

  return (
    <ExternalLink
      href={href}
      className="flex items-center gap-2 px-4 py-2 text-sm rounded-full border-gray-dim bg-gray-ui"
    >
      {icon}
      {icon ? " " : null}
      {children}
    </ExternalLink>
  );
}
