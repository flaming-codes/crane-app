import { PropsWithChildren } from "react";

type Props = PropsWithChildren<{
  href: string;
  className?: string;
}>;

export function ExternalLink(props: Props) {
  const { href, className, children } = props;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      {children}
    </a>
  );
}
