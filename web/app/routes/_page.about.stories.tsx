import type { Meta, StoryObj } from "@storybook/react-vite";
import { withRouter } from "storybook-addon-remix-react-router";
import AboutPage from "./_page.about._index";

const meta: Meta<typeof AboutPage> = {
  title: "Routes/AboutPage",
  component: AboutPage,
  decorators: [withRouter],
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof AboutPage>;

export const Default: Story = {
  render: () => <AboutPage />,
};
