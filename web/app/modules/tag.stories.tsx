import preview from "../../.storybook/preview";
import { Tag } from "./tag";

const meta = preview.meta({
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
});

export const Default = meta.story();

export const Sizes = meta.story({
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
});

export const Gradients = meta.story({
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
});
