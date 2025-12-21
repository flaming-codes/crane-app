import type { Meta, StoryObj } from "@storybook/react";
import { Footer } from "./footer";
import { withRouter } from "storybook-addon-remix-react-router";

const meta: Meta<typeof Footer> = {
    title: "Modules/Footer",
    component: Footer,
    decorators: [withRouter],
    parameters: {
        layout: "fullscreen",
    },
};

export default meta;
type Story = StoryObj<typeof Footer>;

export const Default: Story = {
    args: {
        variant: "page",
    },
};

export const Start: Story = {
    args: {
        variant: "start",
    },
};
