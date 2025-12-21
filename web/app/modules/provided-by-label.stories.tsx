import type { Meta, StoryObj } from "@storybook/react";
import { ProvidedByLabel, DataProvidedByCRANLabel } from "./provided-by-label";

const meta: Meta<typeof ProvidedByLabel> = {
    title: "Modules/ProvidedByLabel",
    component: ProvidedByLabel,
    args: {
        source: "Google Gemini",
        sourceUrl: "https://ai.google.dev",
    },
};

export default meta;
type Story = StoryObj<typeof ProvidedByLabel>;

export const Default: Story = {};

export const CRANLabel: StoryObj<typeof DataProvidedByCRANLabel> = {
    render: () => <DataProvidedByCRANLabel />,
};
