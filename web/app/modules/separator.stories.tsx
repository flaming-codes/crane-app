import type { Meta, StoryObj } from "@storybook/react-vite";
import { Separator } from "./separator";

const meta: Meta<typeof Separator> = {
  title: "Modules/UI/Separator",
  component: Separator,
  decorators: [
    (Story) => (
      <div className="mx-auto w-full max-w-md py-10">
        <p>Content above</p>
        <div className="my-4">
          <Story />
        </div>
        <p>Content below</p>
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Separator>;

export const Default: Story = {};
