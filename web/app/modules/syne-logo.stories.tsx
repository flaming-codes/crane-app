import type { Meta, StoryObj } from "@storybook/react-vite";
import { SyneLogo } from "./svg";

const meta: Meta<typeof SyneLogo> = {
  title: "Modules/Icons/SyneLogo",
  component: SyneLogo,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    className: { control: "text" },
    style: { control: "object" },
  },
};

export default meta;
type Story = StoryObj<typeof SyneLogo>;

export const Default: Story = {
  args: {
    className: "h-32",
  },
};

export const CustomColor: Story = {
  args: {
    className: "h-32 text-blue-500",
  },
};

export const Large: Story = {
  args: {
    className: "h-64",
  },
};

export const WithCustomStyle: Story = {
  args: {
    style: { color: "var(--iris-9)" },
    className: "h-32",
  },
};
