import { RiDownloadLine } from "@remixicon/react";
import { cva, VariantProps } from "cva";
import { ReactNode } from "react";

type Props = Required<VariantProps<typeof twGradient>> & {
  href: string;
  headline: ReactNode;
  os: ReactNode;
  arch?: ReactNode;
  className?: string;
};

const twBase = cva({
  base: "py-3 px-4 rounded-lg overflow-hidden group/binary border border-gray-dim flex items-center isolate gap-6 transition-colors relative",
});

const twGradient = cva({
  base: "inset-0 absolute bg-gradient-to-tr -z-10 opacity-0 group-hover/binary:opacity-100 transition-opacity duration-700",
  variants: {
    variant: {
      iris: "from-iris-4 dark:from-iris-11",
      ruby: "from-ruby-4 dark:from-ruby-11",
    },
  },
});

export function BinaryDownloadListItem(props: Props) {
  const { href, headline, os, arch, className, variant } = props;

  return (
    <a download href={href} className={twBase({ className })}>
      <RiDownloadLine
        size={18}
        className="opacity-50 group-hover/binary:opacity-100 group-hover/binary:animate-wiggle-more group-hover/binary:animate-infinite transition-opacity"
      />
      <div className="flex flex-col gap-1">
        <span className={twGradient({ variant })} />
        <span className="font-mono leading-none">{headline}</span>
        <span className="text-gray-dim">
          {os} <span className="text-gray-normal opacity-30">/</span> {arch}
        </span>
      </div>
    </a>
  );
}
