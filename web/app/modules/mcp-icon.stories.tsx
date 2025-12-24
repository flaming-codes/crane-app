import preview from "../../.storybook/preview";
import { McpIcon } from "./mcp-icon";

const meta = preview.meta({
  title: "Modules/Icons/McpIcon",
  component: McpIcon,
  parameters: {
    layout: "centered",
  },
});

export const Default = meta.story({
  args: {
    className: "w-16 h-16",
  },
});
