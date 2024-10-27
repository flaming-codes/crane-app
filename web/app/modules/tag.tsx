import { cva } from "cva";
import { PropsWithChildren } from "react";

type Props = PropsWithChildren<{
  className?: string;
}>;

const twBase = cva({
  base: [
    "text-[0.5rem] font-semibold uppercase border rounded-full px-2 py-1 shrink-0 max-w-min whitespace-nowrap",
    "md:mb-1",
    "border-gray-12 dark:border-gray-3",
  ],
});

export function Tag(props: Props) {
  const { children, className } = props;

  return <span className={twBase({ className })}>{children}</span>;
}

Tag.displayName = "Tag";
