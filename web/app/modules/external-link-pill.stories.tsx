import preview from "../../.storybook/preview";
import { ExternalLinkPill } from "./external-link-pill";
import { RiGithubLine, RiExternalLinkLine } from "@remixicon/react";

const meta = preview.meta({
  title: "Modules/Links/ExternalLinkPill",
  component: ExternalLinkPill,
  parameters: {
    layout: "centered",
  },
  args: {
    href: "https://example.com",
    children: "Visit Example",
  },
});

export const Default = meta.story();

export const WithIcon = meta.story({
  args: {
    icon: <RiExternalLinkLine size={18} />,
  },
});

export const GithubLink = meta.story({
  args: {
    icon: <RiGithubLine size={18} />,
    children: "GitHub Repository",
    href: "https://github.com",
  },
});
