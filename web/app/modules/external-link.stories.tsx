import type { Meta, StoryObj } from "@storybook/react";
import { ExternalLink } from "./external-link";

const meta: Meta<typeof ExternalLink> = {
    title: "Modules/ExternalLink",
    component: ExternalLink,
    parameters: {
        layout: "centered",
    },
    args: {
        href: "https://example.com",
        children: "Visit Example.com",
        className: "text-blue-600 hover:underline",
    },
};

export default meta;
type Story = StoryObj<typeof ExternalLink>;

export const Default: Story = {};
