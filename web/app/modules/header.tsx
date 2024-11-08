import { cva, VariantProps } from "cva";
import { ReactNode } from "react";

type Props = Required<VariantProps<typeof twBase>> & {
  headline: ReactNode;
  subline?: ReactNode;
  ornament?: ReactNode;
  className?: string;
};

const twBase = cva({
  base: "full-width min-h-48 py-4 text-gray-normal relative",
  variants: {
    gradient: {
      iris: "bg-gradient-to-tr from-iris-6 dark:from-iris-10",
      gold: "bg-gradient-to-tr from-gold-6 dark:from-gold-10",
      ruby: "bg-gradient-to-tr from-ruby-6 dark:from-ruby-10",
      jade: "bg-gradient-to-bl from-jade-8 dark:from-jade-11",
      bronze: "bg-gradient-to-tl from-bronze-8 dark:from-bronze-11",
      sand: "bg-gradient-to-br from-sand-8 via-gold-6 dark:from-sand-11 dark:via-gold-12/60",
      amethyst:
        "bg-gradient-to-tl from-plum-7 via-violet-6 dark:from-plum-11 dark:via-violet-12",
    },
  },
});

export function Header(props: Props) {
  const { headline, subline, ornament, gradient, className } = props;

  return (
    <div className={twBase({ gradient, className })}>
      <div className="flex flex-col items-center justify-center gap-4 md:gap-6 md:flex-row md:justify-between">
        <div className="flex flex-col items-center justify-center gap-1 text-center md:items-start md:text-start">
          <h1 className="text-4xl font-light">{headline}</h1>
          {subline ? <p className="text-gray-dim text-xl">{subline}</p> : null}
        </div>
        {ornament}
      </div>
    </div>
  );
}

Header.displayName = "Header";
