import clsx from "clsx";
import { PropsWithChildren } from "react";

type Props = PropsWithChildren<{
  outerClassName?: string;
  innerClassName?: string;
}>;

export function PageContent(props: Props) {
  const { children, outerClassName, innerClassName } = props;

  return (
    <div className={clsx("full-width pt-16 pb-48", outerClassName)}>
      <div className={clsx("flex flex-col gap-16", innerClassName)}>
        {children}
      </div>
    </div>
  );
}

PageContent.displayName = "PageContent";
