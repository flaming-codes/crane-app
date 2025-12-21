import type { Meta, StoryObj } from "@storybook/react";
import { Tag } from "./tag";

const meta: Meta<typeof Tag> = {
    title: "Modules/Tag",
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
        <div className="flex gap-2 items-center">
            <Tag {...args} size="xs" children="XS Tag" />
            <Tag {...args} size="sm" children="SM Tag" />
        </div>
    ),
};

export const Gradients: Story = {
    render: (args) => (
        <div className="flex gap-2">
            <Tag {...args} borderGradients="iris" children="Iris" />
            <Tag {...args} borderGradients="jade" children="Jade" />
        </div>
    ),
};
