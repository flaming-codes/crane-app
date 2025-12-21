import type { Meta, StoryObj } from "@storybook/react";
import { InfoCard } from "./info-card";

const meta: Meta<typeof InfoCard> = {
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
};

export default meta;
type Story = StoryObj<typeof InfoCard>;

export const Default: Story = {};

export const ExternalIcon: Story = {
  args: {
    icon: "external",
  },
};

export const InternalIcon: Story = {
  args: {
    icon: "internal",
  },
};

export const RubyVariant: Story = {
  args: {
    variant: "ruby",
  },
};

export const SandVariant: Story = {
  args: {
    variant: "sand",
    icon: "internal",
  },
};
