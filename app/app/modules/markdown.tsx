import { cva } from "cva";
import { PropsWithChildren } from "react";

type Props = PropsWithChildren<{
  className?: string;
}>;

const twBase = cva({
  base: "text-xl font-light leading-normal",
});

export function Markdown(props: Props) {
  const { children, className } = props;

  return <p className={twBase({ className })}>{children}</p>;
}

Markdown.displayName = "Markdown";
