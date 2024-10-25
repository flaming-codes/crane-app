import { RiDownloadLine, RiExternalLinkLine } from "@remixicon/react";
import { cva, VariantProps } from "cva";
import { PropsWithChildren, ReactNode } from "react";

type Props = PropsWithChildren<
  Required<VariantProps<typeof twGradient>> & {
    icon?: "external";
    className?: string;
  }
>;

const twBase = cva({
  base: "min-h-40 flex flex-col justify-between p-4 border-gray-dim overflow-hidden border rounded-xl isolate relative group/card",
});

const twGradient = cva({
  base: "inset-0 absolute bg-gradient-to-tr -z-10 opacity-0 group-hover/card:opacity-100 transition-opacity duration-700",
  variants: {
    variant: {
      iris: "from-iris-4 dark:from-iris-11",
      ruby: "from-ruby-4 dark:from-ruby-11",
    },
  },
});

export function InfoCard(props: Props) {
  const { className, variant, children, icon } = props;

  return (
    <div className={twBase({ className })}>
      <span className={twGradient({ variant })} />
      {children}
      {icon === "external" ? (
        <RiExternalLinkLine
          className="group-hover/card:animate-wiggle-more group-hover/card:animate-infinite"
          size={16}
        />
      ) : null}
    </div>
  );
}
