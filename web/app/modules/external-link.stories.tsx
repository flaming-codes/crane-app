import preview from "../../.storybook/preview";
import { ExternalLink } from "./external-link";

const meta = preview.meta({
  title: "Modules/Links/ExternalLink",
  component: ExternalLink,
  parameters: {
    layout: "centered",
  },
  args: {
    href: "https://example.com",
    children: "Visit Example.com",
    className: "text-blue-600 hover:underline",
  },
});

export const Default = meta.story();
