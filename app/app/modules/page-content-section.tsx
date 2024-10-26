import clsx from "clsx";
import { PropsWithChildren, ReactNode } from "react";

type Props = PropsWithChildren<{
  headline?: ReactNode;
  subline?: ReactNode;
  fragment?: string;
  className?: string;
}>;

export function PageContentSection(props: Props) {
  const { children, headline, subline, fragment, className } = props;

  return (
    <section className={clsx("flex flex-col gap-16", className)}>
      <div className="flex flex-col gap-3" id={fragment}>
        {headline ? (
          <h2 className="text-xl text-gray-normal font-semibold">{headline}</h2>
        ) : null}
        {subline ? <p className="text-gray-normal text-sm">{subline}</p> : null}
      </div>
      {children}
    </section>
  );
}
