import { RiFileCopyLine } from "@remixicon/react";
import { useCopyToClipboard } from "@uidotdev/usehooks";
import clsx from "clsx";
import { PropsWithChildren } from "react";

type Props = PropsWithChildren<{
  className?: string;
  textToCopy: string;
}>;

export function CopyPillButton(props: Props) {
  const { children, className, textToCopy } = props;

  const [copiedValue, copy] = useCopyToClipboard();

  return (
    <button
      className={clsx(
        "group flex items-center gap-4 px-4 py-2 text-sm rounded-full border-gray-dim bg-gradient-to-tr hover:brightness-110 transition-all",
        "from-iris-6 dark:from-iris-11",
        className,
      )}
      onClick={() => copy(textToCopy)}
    >
      <RiFileCopyLine
        size={18}
        className="group-hover:animate-wiggle-more group-hover:animate-infinite"
      />{" "}
      <code className="text-sm">{children}</code>
    </button>
  );
}
