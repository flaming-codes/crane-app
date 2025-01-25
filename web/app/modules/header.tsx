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
      iris: "bg-linear-to-tr from-iris-6 dark:from-iris-10",
      ruby: "bg-linear-to-tr from-ruby-6 dark:from-ruby-10",
      jade: "bg-linear-to-bl from-jade-8 dark:from-jade-11",
      bronze: "bg-linear-to-tl from-bronze-8 dark:from-bronze-11",
      sand: "bg-linear-to-br from-sand-8 via-gold-6 dark:from-sand-11 dark:via-gold-12/60",
      amethyst:
        "bg-linear-to-tl from-plum-7 via-violet-6 dark:from-plum-11 dark:via-violet-12",
      opal: "bg-linear-to-tl from-iris-11 via-sky-4 dark:from-iris-10 dark:via-sky-12 ",
    },
  },
});

export function Header(props: Props) {
  const { headline, subline, ornament, gradient, className } = props;

  return (
    <div className={twBase({ gradient, className })}>
      <div className="flex flex-col items-center justify-center gap-4 md:flex-row md:justify-between md:gap-6">
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
