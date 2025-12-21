import type { Meta, StoryObj } from "@storybook/react";
import { Footer } from "./footer";
import { withRouter } from "storybook-addon-remix-react-router";

const meta: Meta<typeof Footer> = {
  title: "Modules/PageLayout/Footer",
  component: Footer,
  decorators: [withRouter],
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["start", "page"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Footer>;

export const Default: Story = {
  args: {
    variant: "page",
  },
};

export const Start: Story = {
  args: {
    variant: "start",
  },
};
