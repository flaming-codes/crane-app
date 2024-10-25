import clsx from "clsx";
import { PropsWithChildren, ReactNode } from "react";

type Props = PropsWithChildren<{
  headline?: ReactNode;
  fragment?: string;
  className?: string;
}>;

export function PageContentSection(props: Props) {
  const { children, headline, fragment, className } = props;

  return (
    <section className={clsx("flex flex-col gap-16", className)}>
      {headline ? (
        <h2 id={fragment} className="text-xl text-gray-normal font-semibold">
          {headline}
        </h2>
      ) : null}
      {children}
    </section>
  );
}
