import { cva } from "cva";

export const pane = cva({
  base: "min-h-full overflow-y-auto p-4",
  variants: {
    kind: {
      primary: "bg-mauve-4 dark:bg-mauve-2",
      secondary: "hidden md:block",
    },
  },
});

export const paneHeaderSpacing = cva({
  base: "mt-20",
});
