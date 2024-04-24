import { cva } from "cva";

export const pane = cva({
  base: "overflow-y-auto p-4 relative",
  variants: {
    kind: {
      primary: "min-h-full bg-mauve-4 dark:bg-mauve-2",
      secondary: [
        "bg-mauve-1",
        "fixed inset-x-0 bottom-0 max-h-[80vh]",
        "md:relative md:inset-auto md:max-h-none md:min-h-full",
      ],
    },
  },
});

export const paneHeader = cva({
  variants: {
    offset: {
      none: "mt-40",
      default: "mt-[calc(230px-44px)]",
    },
  },
  defaultVariants: {
    offset: "none",
  },
});
