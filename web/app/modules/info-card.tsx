import { RiArrowRightSLine, RiExternalLinkLine } from "@remixicon/react";
import { cva, VariantProps } from "cva";
import { PropsWithChildren } from "react";

type Props = PropsWithChildren<
  Required<VariantProps<typeof twGradient>> & {
    icon?: "external" | "internal";
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
      jade: "from-jade-5 dark:from-jade-11",
      bronze: "from-bronze-6 dark:from-bronze-11",
      sand: "from-sand-8 via-gold-6 dark:from-sand-11 dark:via-gold-12",
    },
  },
});

const iconMap: Record<string, JSX.Element> = {
  external: (
    <RiExternalLinkLine
      className="group-hover/card:animate-wiggle-more group-hover/card:animate-infinite"
      size={16}
    />
  ),
  internal: (
    <RiArrowRightSLine
      className="group-hover/card:animate-wiggle-more group-hover/card:animate-infinite"
      size={16}
    />
  ),
};

export function InfoCard(props: Props) {
  const { className, variant, children, icon = null } = props;

  return (
    <div className={twBase({ className })}>
      <span className={twGradient({ variant })} />
      {children}
      {icon ? iconMap[icon] || null : null}
    </div>
  );
}
