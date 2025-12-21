import type { Meta, StoryObj } from "@storybook/react";
import { Header } from "./header";
import { SyneLogo as Logo } from "./svg";

const meta: Meta<typeof Header> = {
    title: "Modules/PageLayout/Header",
    component: Header,
    parameters: {
        layout: "fullscreen",
    },
    args: {
        headline: "The R packages & authors search engine, enhanced",
        subline: "Search for R packages, authors, and more.",
        gradient: "iris",
    },
    argTypes: {
        gradient: {
            control: "select",
            options: [
                "iris",
                "ruby",
                "jade",
                "bronze",
                "sand",
                "amethyst",
                "opal",
            ],
        },
    },
};

export default meta;
type Story = StoryObj<typeof Header>;

export const Default: Story = {};

export const WithOrnament: Story = {
    args: {
        ornament: <Logo className="h-32 w-32 text-white/10" />,
    },
};

export const RubyGradient: Story = {
    args: {
        gradient: "ruby",
    },
};

export const JadeGradient: Story = {
    args: {
        gradient: "jade",
    },
};

export const SandGradient: Story = {
    args: {
        gradient: "sand",
    },
};
