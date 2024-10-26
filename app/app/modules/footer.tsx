import { Link, useLocation } from "@remix-run/react";
import { ExternalLink } from "./external-link";
import { cva, VariantProps } from "cva";
import { ReactNode } from "react";

const twBase = cva({
  base: "text-sm flex flex-wrap items-center gap-6 text-gray-dim py-6 font-light",
  variants: {
    variant: {
      start: "",
      page: "px-8  border-t border-gray-dim justify-center",
    },
  },
});

type Props = VariantProps<typeof twBase> & {
  className?: string;
  start?: ReactNode;
  end?: ReactNode;
};

export function Footer(props: Props) {
  const { start, end, variant, className } = props;

  return (
    <footer>
      <ul className={twBase({ variant, className })}>
        {start}
        <li>
          <Link to="/about" className="hover:underline underline-offset-4">
            About
          </Link>
        </li>
        <li>
          <Link to="/privacy" className="hover:underline underline-offset-4">
            Privacy
          </Link>
        </li>
        <li>
          <ExternalLink
            href="https://github.com/flaming-codes/crane-app"
            className="hover:underline underline-offset-4"
          >
            Github
          </ExternalLink>
        </li>
        {end}
      </ul>
    </footer>
  );
}
