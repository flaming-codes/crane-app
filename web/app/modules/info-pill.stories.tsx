import type { Meta, StoryObj } from "@storybook/react";
import { InfoPill } from "./info-pill";

const meta: Meta<typeof InfoPill> = {
  title: "Modules/Pills/InfoPill",
  component: InfoPill,
  args: {
    label: "Version",
    children: "1.0.0",
    variant: "iris",
    size: "md",
  },
  argTypes: {
    size: {
      control: "select",
      options: ["xs", "sm", "md", "lg"],
    },
    variant: {
      control: "select",
      options: ["iris", "ruby", "jade", "slate", "sand", "amethyst", "opal"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof InfoPill>;

export const Default: Story = {};

export const Sizes: Story = {
  render: (args) => (
    <div className="flex flex-col gap-4">
      <InfoPill {...args} size="xs" />
      <InfoPill {...args} size="sm" />
      <InfoPill {...args} size="md" />
      <InfoPill {...args} size="lg" />
    </div>
  ),
};

export const Variants: Story = {
  render: (args) => (
    <div className="flex flex-wrap gap-4">
      <InfoPill {...args} variant="iris" />
      <InfoPill {...args} variant="ruby" />
      <InfoPill {...args} variant="jade" />
      <InfoPill {...args} variant="slate" />
      <InfoPill {...args} variant="sand" />
      <InfoPill {...args} variant="amethyst" />
      <InfoPill {...args} variant="opal" />
    </div>
  ),
};
