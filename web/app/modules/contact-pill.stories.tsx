import type { Meta, StoryObj } from "@storybook/react";
import { ContactPill } from "./contact-pill";
import { withRouter } from "storybook-addon-remix-react-router";

const meta: Meta<typeof ContactPill> = {
  title: "Modules/Pills/ContactPill",
  component: ContactPill,
  decorators: [withRouter],
  args: {
    name: "Hadley Wickham",
    isMaintainer: true,
    roles: ["aut", "cre"],
    link: "https://hadley.nz",
  },
  argTypes: {
    roles: {
      control: "check",
      options: ["aut", "cre", "ctb", "rev", "cph", "com", "ths", "trl"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof ContactPill>;

export const Default: Story = {};

export const Maintainer: Story = {
  args: {
    isMaintainer: true,
    roles: ["cre"],
  },
};

export const Contributor: Story = {
  args: {
    name: "Some Contributor",
    isMaintainer: false,
    roles: ["ctb"],
    link: "mailto:contributor@example.com",
  },
};

export const OrcID: Story = {
  args: {
    name: "Researcher Name",
    roles: ["aut"],
    link: "https://orcid.org/0000-0000-0000-0000",
  },
};
