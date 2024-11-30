import { cva } from "cva";
import { PropsWithChildren } from "react";

type Props = PropsWithChildren<{
  className?: string;
  html?: string;
}>;

const twBase = cva({
  base: [
    "text-xl font-light leading-normal",
    // "[&>a]:underline [&>a]:underline-offset-4",
  ],
});

export function Prose(props: Props) {
  const { children, html, className } = props;

  return (
    <p
      className={twBase({ className })}
      dangerouslySetInnerHTML={html ? { __html: html } : undefined}
    >
      {children}
    </p>
  );
}

Prose.displayName = "Prose";
