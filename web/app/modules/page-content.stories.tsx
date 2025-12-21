import type { Meta, StoryObj } from "@storybook/react";
import { PageContent } from "./page-content";
import { PageContentSection } from "./page-content-section";

const meta: Meta<typeof PageContent> = {
    title: "Modules/PageLayout/PageContent",
    component: PageContent,
    parameters: {
        layout: "fullscreen",
    },
};

export default meta;
type Story = StoryObj<typeof PageContent>;

export const Default: Story = {
    render: (args) => (
        <div className="bg-white dark:bg-black min-h-screen">
            <PageContent {...args}>
                <PageContentSection headline="Section 1" fragment="section-1">
                    <p className="text-gray-normal">
                        This is the content of section 1. It wraps a PageContentSection.
                    </p>
                </PageContentSection>
                <PageContentSection
                    headline="Section 2"
                    subline="With a subline"
                    fragment="section-2"
                >
                    <p className="text-gray-normal">
                        Content of section 2. The PageContent component handles the width
                        and padding.
                    </p>
                </PageContentSection>
            </PageContent>
        </div>
    ),
};
