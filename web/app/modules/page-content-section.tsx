import { cva, VariantProps } from "cva";
import { PropsWithChildren, ReactNode } from "react";

type Props = PropsWithChildren<
  VariantProps<typeof twBase> & {
    headline?: ReactNode;
    subline?: ReactNode;
    fragment?: string;
    className?: string;
  }
>;

const twBase = cva({
  base: "flex flex-col gap-16",
  variants: {
    variant: {
      prose: "text-lg leading-loose text-gray-12 dark:text-gray-4",
    },
  },
});

export function PageContentSection(props: Props) {
  const { children, headline, subline, fragment, variant, className } = props;

  return (
    <section className={twBase({ variant, className })}>
      <div className="flex flex-col gap-3" id={fragment}>
        {headline ? (
          <h2 className="text-gray-normal text-xl font-semibold">{headline}</h2>
        ) : null}
        {subline ? <p className="text-gray-normal text-sm">{subline}</p> : null}
      </div>
      {children}
    </section>
  );
}
