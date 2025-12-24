import preview from "../../.storybook/preview";
import { GradientBackground } from "./gradient-background";

const meta = preview.meta({
  title: "Modules/PageLayout/GradientBackground",
  component: GradientBackground,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <div className="min-h-screen">
        <Story />
        <div className="relative z-10 p-10">
          <h1 className="text-4xl font-bold">Content Content Content</h1>
          <p className="mt-4">Scroll to see gradient effect (if any)</p>
        </div>
      </div>
    ),
  ],
});

export const Iris = meta.story({
  args: {
    gradient: "linear-gradient(to bottom, #748B99, #00000000)", // Example iris-ish gradient
  },
});

export const Sand = meta.story({
  args: {
    gradient: "linear-gradient(to bottom, #dcb886, #00000000)",
  },
});
