import preview from "../../.storybook/preview";
import { NavMenu } from "./nav.menu";
import { withRouter } from "storybook-addon-remix-react-router";

const meta = preview.meta({
  title: "Modules/Navigation/NavMenu",
  component: NavMenu,
  decorators: [withRouter],
  parameters: {
    layout: "centered",
  },
});

export const Default = meta.story();
