import preview from "../../.storybook/preview";
import { BinaryDownloadLink } from "./binary-download-link";

const meta = preview.meta({
  title: "Modules/Links/BinaryDownloadLink",
  component: BinaryDownloadLink,
  parameters: {
    layout: "centered",
  },
  args: {
    href: "https://example.com/download",
    headline: "package-1.0.0.tar.gz",
    os: "macOS",
    arch: "arm64",
    variant: "iris",
  },
  argTypes: {
    os: {
      control: "select",
      options: ["macOS", "Windows", "Linux", "Old Source"],
    },
    variant: {
      control: "select",
      options: ["iris", "ruby"],
    },
  },
});

export const MacOS = meta.story();

export const Windows = MacOS.extend({
  args: {
    os: "Windows",
    arch: "x86_64",
  },
});

export const RubyVariant = MacOS.extend({
  args: {
    variant: "ruby",
  },
});

export const OldSource = MacOS.extend({
  args: {
    os: "Old Source",
    arch: "src",
    headline: "old_package_src",
  },
});
