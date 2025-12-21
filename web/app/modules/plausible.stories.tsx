import type { Meta, StoryObj } from "@storybook/react";
import { PlausibleChoicePillButton } from "./plausible";

const meta: Meta<typeof PlausibleChoicePillButton> = {
    title: "Modules/PlausibleChoicePillButton",
    component: PlausibleChoicePillButton,
    parameters: {
        layout: "centered",
    },
};

export default meta;
type Story = StoryObj<typeof PlausibleChoicePillButton>;

export const Default: Story = {
    render: () => <PlausibleChoicePillButton />,
};
