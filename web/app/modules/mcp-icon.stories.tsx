import type { Meta, StoryObj } from "@storybook/react-vite";
import { McpIcon } from "./mcp-icon";

const meta: Meta<typeof McpIcon> = {
  title: "Modules/Icons/McpIcon",
  component: McpIcon,
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof McpIcon>;

export const Default: Story = {
  args: {
    className: "w-16 h-16",
  },
};
