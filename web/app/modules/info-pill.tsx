import { cva, VariantProps } from "cva";
import { PropsWithChildren, ReactNode } from "react";

type Props = PropsWithChildren<
  VariantProps<typeof twBase> &
    VariantProps<typeof twGradient> & {
      label?: ReactNode;
      className?: string;
      gradientClassname?: string;
    }
>;

const twBase = cva({
  base: "relative rounded-full border border-gray-dim inline-flex gap-2 items-center shrink-0 group/pill overflow-hidden transition-colors",
  variants: {
    size: {
      xs: "text-xs px-2 py-1",
      sm: "text-sm px-2 py-1",
      md: "text-md px-4 py-1",
      lg: "text-lg px-4 py-2",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

const twGradient = cva({
  base: "inset-0 absolute bg-linear-to-tr -z-10 opacity-0 group-hover/pill:opacity-100 transition-opacity duration-700",
  variants: {
    variant: {
      iris: "from-iris-4 dark:from-iris-11",
      ruby: "from-ruby-4 dark:from-ruby-11",
      jade: "from-jade-5 dark:from-jade-11",
      slate: "from-gray-5 dark:from-gray-11",
      sand: "from-sand-5 via-gold-5 dark:from-sand-11 dark:via-gold-12",
      amethyst: "from-plum-7 via-iris-6 dark:from-plum-11 dark:via-iris-12",
      opal: "from-iris-11 via-sky-4 dark:from-iris-10 dark:via-sky-12",
    },
  },
});

export function InfoPill(props: Props) {
  const { size, label, children, variant, className, gradientClassname } =
    props;

  return (
    <div className={twBase({ className, size })}>
      {label ? (
        <span className="text-gray-dim text-sm whitespace-nowrap">{label}</span>
      ) : null}
      {children}
      <span className={twGradient({ variant, class: gradientClassname })} />
    </div>
  );
}
