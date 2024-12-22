import { clsx } from "clsx";
import { PropsWithChildren, ReactNode } from "react";

type Props = PropsWithChildren<{
  label: ReactNode;
  className?: string;
}>;

export function DataPointListItem(props: Props) {
  const { label, children, className } = props;

  return (
    <li className={clsx("flex flex-col", className)}>
      <span className="text-lg font-light tracking-wider">{children}</span>
      <span className="font-semibold opacity-60">{label}</span>
    </li>
  );
}
