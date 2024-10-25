import clsx from "clsx";
import { PropsWithChildren, ReactNode } from "react";

type Props = PropsWithChildren<{
  label: ReactNode;
  className?: string;
}>;

export function InfoPillListItem(props: Props) {
  const { label, children, className } = props;

  return (
    <li
      className={clsx(
        "rounded-full border border-gray-dim px-4 py-1 inline-flex gap-2 items-center shrink-0",
        className,
      )}
    >
      <span className="text-sm text-gray-dim whitespace-nowrap">{label}</span>
      {children}
    </li>
  );
}
