import type { Meta, StoryObj } from "@storybook/react-vite";
import { CopyPillButton } from "./copy-pill-button";

const meta: Meta<typeof CopyPillButton> = {
  title: "Modules/Buttons/CopyPillButton",
  component: CopyPillButton,
  parameters: {
    layout: "centered",
  },
  args: {
    textToCopy: "npm install foo",
    children: "npm install foo",
  },
};

export default meta;
type Story = StoryObj<typeof CopyPillButton>;

export const Default: Story = {};

export const CustomText: Story = {
  args: {
    children: "Copy this text",
    textToCopy: "Hidden text to copy",
  },
};
