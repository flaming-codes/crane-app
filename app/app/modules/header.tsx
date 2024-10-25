import { cva, VariantProps } from "cva";
import { ReactNode } from "react";

type Props = Required<VariantProps<typeof twBase>> & {
  headline: ReactNode;
  subline?: ReactNode;
  ornament?: ReactNode;
  className?: string;
};

const twBase = cva({
  base: "full-width min-h-48 py-4 text-gray-normal",
  variants: {
    gradient: {
      iris: "bg-gradient-to-tr from-iris-6 dark:from-iris-10",
      gold: "bg-gradient-to-tr from-gold-6 dark:from-gold-10",
      ruby: "bg-gradient-to-tr from-ruby-6 dark:from-ruby-10",
      slate: "bg-gradient-to-bl from-jade-8 dark:from-jade-11",
    },
  },
});

export function Header(props: Props) {
  const { headline, subline, ornament, gradient, className } = props;

  return (
    <div className={twBase({ gradient, className })}>
      <div className="flex flex-col md:flex-row gap-6 items-center justify-center md:justify-between">
        <div className=" flex flex-col justify-center items-center text-center gap-1 md:items-start md:text-start">
          <h1 className="text-4xl font-light">{headline}</h1>
          {subline ? <p className="text-xl text-gray-dim">{subline}</p> : null}
        </div>
        {ornament}
      </div>
    </div>
  );
}

Header.displayName = "Header";
