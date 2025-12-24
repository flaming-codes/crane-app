import preview from "../../.storybook/preview";
import { withRouter } from "storybook-addon-remix-react-router";
import AboutPage from "./_page.about._index";

const meta = preview.meta({
  title: "Routes/AboutPage",
  component: AboutPage,
  decorators: [withRouter],
  parameters: {
    layout: "fullscreen",
  },
});

export const Default = meta.story({
  render: () => <AboutPage />,
});
