import type { Meta, StoryObj } from "@storybook/react";
import { NavMenu } from "./nav.menu";
import { withRouter } from "storybook-addon-remix-react-router";

const meta: Meta<typeof NavMenu> = {
  title: "Modules/Navigation/NavMenu",
  component: NavMenu,
  decorators: [withRouter],
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof NavMenu>;

export const Default: Story = {};
