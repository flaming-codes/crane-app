import classNames from "classnames";
import { PropsWithChildren } from "react";

type Props = PropsWithChildren<{
  outerClassName?: string;
  innerClassName?: string;
}>;

export function PageContent(props: Props) {
  const { children, outerClassName, innerClassName } = props;

  return (
    <div className={classNames("full-width pt-32", outerClassName)}>
      <div className={classNames("flex flex-col gap-16", innerClassName)}>
        {children}
      </div>
    </div>
  );
}

PageContent.displayName = "PageContent";
