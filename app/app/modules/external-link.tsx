import { PropsWithChildren } from "react";

type Props = PropsWithChildren<{
  href: string;
}>;

export function ExternalLink(props: Props) {
  const { href, children } = props;

  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}
