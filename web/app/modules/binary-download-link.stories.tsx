import type { Meta, StoryObj } from "@storybook/react";
import { BinaryDownloadLink } from "./binary-download-link";

const meta: Meta<typeof BinaryDownloadLink> = {
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
};

export default meta;
type Story = StoryObj<typeof BinaryDownloadLink>;

export const MacOS: Story = {
  args: {
    os: "macOS",
    arch: "arm64",
  },
};

export const Windows: Story = {
  args: {
    os: "Windows",
    arch: "x86_64",
  },
};

export const RubyVariant: Story = {
  args: {
    variant: "ruby",
  },
};

export const OldSource: Story = {
  args: {
    os: "Old Source",
    arch: "src",
    headline: "old_package_src",
  },
};
