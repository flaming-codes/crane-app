import type { Meta, StoryObj } from "@storybook/react";
import { PageContentSection } from "./page-content-section";

const meta: Meta<typeof PageContentSection> = {
    title: "Modules/PageLayout/PageContentSection",
    component: PageContentSection,
    parameters: {
        layout: "padded",
    },
    args: {
        headline: "Section Headline",
        subline: "This is a subline description for the section.",
        children: <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">Section Content Placeholder</div>,
    },
    argTypes: {
        variant: {
            control: "select",
            options: [undefined, "prose"],
        },
    },
};

export default meta;
type Story = StoryObj<typeof PageContentSection>;

export const Default: Story = {};

export const ProseVariant: Story = {
    args: {
        variant: "prose",
        children: (
            <p>
                This content is styled as prose. It's meant for larger bodies of text that require comfortable reading width and line height.
            </p>
        ),
    },
};

export const WithoutSubline: Story = {
    args: {
        subline: undefined,
    },
};
