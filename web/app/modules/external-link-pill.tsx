import { PropsWithChildren, ReactNode } from "react";
import { ExternalLink } from "./external-link";
import clsx from "clsx";

type Props = PropsWithChildren<{
  href: string;
  children: ReactNode;
  className?: string;
  icon?: ReactNode;
}>;

export function ExternalLinkPill(props: Props) {
  const { href, children, className, icon } = props;

  return (
    <ExternalLink
      href={href}
      className={clsx(
        "bg-gray-ui border-gray-dim flex items-center gap-2 rounded-full px-4 py-2 text-sm",
        className,
      )}
    >
      {icon}
      {icon ? " " : null}
      {children}
    </ExternalLink>
  );
}
