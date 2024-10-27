import { RiFileCopyLine } from "@remixicon/react";
import { useCopyToClipboard } from "@uidotdev/usehooks";
import clsx from "clsx";
import { PropsWithChildren, useRef } from "react";
import { toast } from "sonner";

type Props = PropsWithChildren<{
  className?: string;
  textToCopy: string;
  onSuccess?: () => void;
}>;

export function CopyPillButton(props: Props) {
  const { children, className, textToCopy, onSuccess } = props;

  const [_, copy] = useCopyToClipboard();

  const timeLockUntilNextCopyAllowed = useRef(0);
  const onCopy = async () => {
    if (Date.now() >= timeLockUntilNextCopyAllowed.current) {
      timeLockUntilNextCopyAllowed.current = Date.now() + 5_000;
      try {
        await copy(textToCopy);
        toast.success("Copied to clipboard");
        onSuccess?.();
      } catch (error) {
        toast.error("Failed to copy to clipboard");
      }
    }
  };

  return (
    <button
      className={clsx(
        "group border-gray-dim flex cursor-copy items-center gap-4 rounded-full bg-gradient-to-tr px-4 py-2 text-sm transition-all hover:brightness-110",
        "from-iris-6 dark:from-iris-11",
        className,
      )}
      onClick={onCopy}
    >
      <RiFileCopyLine
        size={18}
        className="group-hover:animate-wiggle-more group-hover:animate-infinite"
      />{" "}
      <code className="text-sm">{children}</code>
    </button>
  );
}
