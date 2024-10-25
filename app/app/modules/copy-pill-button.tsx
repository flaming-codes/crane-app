import { RiFileCopyLine } from "@remixicon/react";
import clsx from "clsx";
import { PropsWithChildren } from "react";

type Props = PropsWithChildren<{
  className?: string;
}>;

export function CopyPillButton(props: Props) {
  const { children, className } = props;

  return (
    <button
      className={clsx(
        "flex items-center gap-2 px-4 py-2 text-sm rounded-full border-gray-dim bg-gradient-to-tr hover:brightness-110 transition-all",
        "from-iris-4 to-iris-6 dark:from-iris-11 dark:to-iris-12",
        className,
      )}
    >
      <RiFileCopyLine size={18} /> <code>{children}</code>
    </button>
  );
}
