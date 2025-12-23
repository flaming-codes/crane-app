import type { Preview, Decorator } from "@storybook/react-vite";
import { useEffect } from "react";
import "../app/tailwind.css";

/**
 * Custom decorator to handle prefers-color-scheme for Tailwind CSS.
 * This app uses `@custom-variant dark (@media (prefers-color-scheme: dark))`
 * so we need to set the color-scheme CSS property to trigger the media query.
 */
const withColorScheme: Decorator = (Story, context) => {
  const backgroundValue = context.globals.backgrounds?.value;
  const isDark = backgroundValue === "#000000";

  useEffect(() => {
    const root = document.documentElement;
    // Set color-scheme which affects prefers-color-scheme media query
    root.style.colorScheme = isDark ? "dark" : "light";
    // Also set background color for visibility
    root.style.backgroundColor = isDark ? "#000" : "#fff";
  }, [isDark]);

  return <Story />;
};

const preview: Preview = {
  tags: ["autodocs"],
  decorators: [withColorScheme],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: "todo",
    },
    backgrounds: {
      default: "light",
      values: [
        {
          name: "light",
          value: "#ffffff",
        },
        {
          name: "dark",
          value: "#000000",
        },
      ],
    },
  },
};

export default preview;
