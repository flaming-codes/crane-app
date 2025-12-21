import type { Meta, StoryObj } from "@storybook/react";
import { GradientBackground } from "./gradient-background";

const meta: Meta<typeof GradientBackground> = {
    title: "Modules/PageLayout/GradientBackground",
    component: GradientBackground,
    parameters: {
        layout: "fullscreen",
    },
    decorators: [
        (Story) => (
            <div className="min-h-screen">
                <Story />
                <div className="p-10 relative z-10">
                    <h1 className="text-4xl font-bold">Content Content Content</h1>
                    <p className="mt-4">Scroll to see gradient effect (if any)</p>
                </div>
            </div>
        ),
    ],
};

export default meta;
type Story = StoryObj<typeof GradientBackground>;

export const Iris: Story = {
    args: {
        gradient: "linear-gradient(to bottom, #748B99, #00000000)", // Example iris-ish gradient
    },
};

export const Sand: Story = {
    args: {
        gradient: "linear-gradient(to bottom, #dcb886, #00000000)",
    },
};
