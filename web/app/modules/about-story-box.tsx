export interface AboutStoryBoxProps {
  title: string;
  headline: string;
  children: React.ReactNode;
}

/** A styled box for displaying the "Our Story" section on the About page. */
export function AboutStoryBox({
  title,
  headline,
  children,
}: AboutStoryBoxProps) {
  return (
    <div className="border-gray-6/30 from-sand-3/50 via-amber-2/40 text-gray-normal dark:border-gray-1/20 dark:from-sand-9/40 dark:via-amber-9/20 dark:to-gray-12/40 dark:text-gray-2 space-y-4 rounded-2xl border bg-linear-to-br to-white/60 p-8 text-base leading-relaxed shadow-[0_25px_90px_-60px_rgba(15,23,42,0.75)]">
      <p className="text-gray-dim text-xs font-semibold tracking-[0.35em] uppercase">
        {title}
      </p>
      <p className="text-gray-normal mt-1 text-2xl font-semibold">{headline}</p>
      {children}
    </div>
  );
}
