import { RiFireFill } from "@remixicon/react";

export function FlameOfFame(props: { score: number; threshold?: number }) {
  const { score, threshold = 11 } = props;

  if (score < threshold) {
    return null;
  }

  return (
    <RiFireFill
      size={16}
      className="animate-pulse text-ruby-9 animate-duration-1000"
    />
  );
}
