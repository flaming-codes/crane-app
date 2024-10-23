import { cva } from "cva";

type Props = {
  className?: string;
};

const twBase = cva({
  base: "opacity-20",
});

export function Separator(props: Props) {
  const { className } = props;

  return <hr className={twBase({ className })} />;
}

Separator.displayName = "Separator";
