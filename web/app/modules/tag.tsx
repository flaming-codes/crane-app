import { cva, VariantProps } from "cva";
import { PropsWithChildren } from "react";

const twBase = cva({
  base: [
    "font-semibold uppercase border rounded-full shrink-0 max-w-min whitespace-nowrap",
    "md:mb-1",
    "border-gray-12 dark:border-gray-3",
  ],
  variants: {
    size: {
      xs: "text-[0.5rem] px-2 py-1",
      sm: "text-[0.625rem] px-2 py-1",
    },
    borderGradients: {
      iris: "text-iris-10 dark:text-iris-8 border-iris-6 dark:border-iris-10 border-l-0 border-t-0",
      jade: "text-jade-10 dark:text-jade-9 border-jade-6 dark:border-jade-10 border-l-0 border-t-0",
    },
  },
  defaultVariants: {
    size: "xs",
  },
});

type Props = PropsWithChildren<
  VariantProps<typeof twBase> & {
    className?: string;
  }
>;

export function Tag(props: Props) {
  const { children, className, borderGradients, size } = props;

  return (
    <span className={twBase({ className, borderGradients, size })}>
      {children}
    </span>
  );
}

Tag.displayName = "Tag";
