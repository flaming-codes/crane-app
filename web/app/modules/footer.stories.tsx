import preview from "../../.storybook/preview";
import { Footer } from "./footer";
import { withRouter } from "storybook-addon-remix-react-router";

const meta = preview.meta({
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
});

export const Default = meta.story({
  args: {
    variant: "page",
  },
});

export const Start = meta.story({
  args: {
    variant: "start",
  },
});
