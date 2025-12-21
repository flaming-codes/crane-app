import type { Meta, StoryObj } from "@storybook/react";
import { ExternalLinkPill } from "./external-link-pill";
import { RiGithubLine, RiExternalLinkLine } from "@remixicon/react";

const meta: Meta<typeof ExternalLinkPill> = {
    title: "Modules/Links/ExternalLinkPill",
    component: ExternalLinkPill,
    parameters: {
        layout: "centered",
    },
    args: {
        href: "https://example.com",
        children: "Visit Example",
    },
};

export default meta;
type Story = StoryObj<typeof ExternalLinkPill>;

export const Default: Story = {};

export const WithIcon: Story = {
    args: {
        icon: <RiExternalLinkLine size={18} />,
    },
};

export const GithubLink: Story = {
    args: {
        icon: <RiGithubLine size={18} />,
        children: "GitHub Repository",
        href: "https://github.com",
    },
};
