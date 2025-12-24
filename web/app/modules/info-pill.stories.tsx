import preview from "../../.storybook/preview";
import { InfoPill } from "./info-pill";

const meta = preview.meta({
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
});

export const Default = meta.story();

export const Sizes = meta.story({
  render: (args) => (
    <div className="flex flex-col gap-4">
      <InfoPill {...args} size="xs" />
      <InfoPill {...args} size="sm" />
      <InfoPill {...args} size="md" />
      <InfoPill {...args} size="lg" />
    </div>
  ),
});

export const Variants = meta.story({
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
});
