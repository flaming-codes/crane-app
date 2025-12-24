import type { Meta, StoryObj } from "@storybook/react-vite";
import { Tag } from "./tag";

const meta: Meta<typeof Tag> = {
  title: "Modules/UI/Tag",
  component: Tag,
  args: {
    children: "v1.0.0",
    size: "xs",
    borderGradients: "iris",
  },
  argTypes: {
    size: {
      control: "select",
      options: ["xs", "sm"],
    },
    borderGradients: {
      control: "select",
      options: ["iris", "jade"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Tag>;

export const Default: Story = {};

export const Sizes: Story = {
  render: (args) => (
    <div className="flex items-center gap-2">
      <Tag {...args} size="xs">
        XS Tag
      </Tag>
      <Tag {...args} size="sm">
        SM Tag
      </Tag>
    </div>
  ),
};

export const Gradients: Story = {
  render: (args) => (
    <div className="flex gap-2">
      <Tag {...args} borderGradients="iris">
        Iris
      </Tag>
      <Tag {...args} borderGradients="jade">
        Jade
      </Tag>
    </div>
  ),
};
