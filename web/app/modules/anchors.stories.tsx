import type { Meta, StoryObj } from "@storybook/react";
import { Anchors, AnchorLink } from "./anchors";
import { withRouter } from "storybook-addon-remix-react-router";

const meta: Meta<typeof Anchors> = {
    title: "Modules/PageLayout/Anchors",
    component: Anchors,
    decorators: [withRouter],
    parameters: {
        layout: "fullscreen",
    },
    args: {
        anchorIds: ["section-1", "section-2", "section-3"],
    },
};

export default meta;
type Story = StoryObj<typeof Anchors>;

export const Default: Story = {
    render: (args) => (
        <div className="relative">
            <div className="h-[60px] bg-gray-100 flex items-center justify-center border-b">
                Top Bar (Placeholder)
            </div>
            {/* Sticky Anchors Nav */}
            <Anchors {...args}>
                {args.anchorIds.map((id) => (
                    <AnchorLink key={id} fragment={id}>
                        {id.replace("-", " ").toUpperCase()}
                    </AnchorLink>
                ))}
            </Anchors>

            {/* Content to scroll */}
            <div className="p-8 space-y-96">
                <div id="section-1" className="pt-20">
                    <h2 className="text-2xl font-bold">Section 1</h2>
                    <p>Scroll down...</p>
                </div>
                <div id="section-2" className="pt-20">
                    <h2 className="text-2xl font-bold">Section 2</h2>
                    <p>Keep scrolling...</p>
                </div>
                <div id="section-3" className="pt-20">
                    <h2 className="text-2xl font-bold">Section 3</h2>
                    <p>End of content.</p>
                </div>
                <div className="h-screen">Spacer</div>
            </div>
        </div>
    ),
};
