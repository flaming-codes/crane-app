import { cva, VariantProps } from "cva";
import { PropsWithChildren, ReactNode } from "react";

type Props = PropsWithChildren<
  VariantProps<typeof twBase> & {
    label?: ReactNode;
    className?: string;
  }
>;

const twBase = cva({
  base: "rounded-full border border-gray-dim inline-flex gap-2 items-center shrink-0 group/pill",
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

export function InfoPill(props: Props) {
  const { size, label, children, className } = props;

  return (
    <div className={twBase({ className, size })}>
      {label ? (
        <span className="text-sm text-gray-dim whitespace-nowrap">{label}</span>
      ) : null}
      {children}
    </div>
  );
}
