import preview from "../../.storybook/preview";
import { InfoCard } from "./info-card";

const meta = preview.meta({
  title: "Modules/Cards/InfoCard",
  component: InfoCard,
  parameters: {
    layout: "padded",
  },
  args: {
    className: "w-64",
    children: (
      <>
        <h3 className="text-lg font-bold">Card Title</h3>
        <p className="text-gray-dim">Some description text for the card.</p>
      </>
    ),
    variant: "iris",
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["none", "iris", "ruby", "jade", "bronze", "sand", "amethyst"],
    },
    icon: {
      control: "select",
      options: ["external", "internal"],
    },
  },
});

export const Default = meta.story();

export const ExternalIcon = Default.extend({
  args: {
    icon: "external",
  },
});

export const InternalIcon = Default.extend({
  args: {
    icon: "internal",
  },
});

export const RubyVariant = Default.extend({
  args: {
    variant: "ruby",
  },
});

export const SandVariant = Default.extend({
  args: {
    variant: "sand",
    icon: "internal",
  },
});
