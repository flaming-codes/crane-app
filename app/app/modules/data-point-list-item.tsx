import classNames from "classnames";
import { PropsWithChildren, ReactNode } from "react";

type Props = PropsWithChildren<{
  label: ReactNode;
  className?: string;
}>;

export function DataPointListItem(props: Props) {
  const { label, children, className } = props;

  return (
    <li className={classNames("flex flex-col", className)}>
      <span className="font-mono text-lg">{children}</span>
      <span className="font-semibold opacity-60">{label}</span>
    </li>
  );
}
