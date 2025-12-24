import preview from "../../.storybook/preview";
import { ContactPill } from "./contact-pill";
import { withRouter } from "storybook-addon-remix-react-router";

const meta = preview.meta({
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
});

export const Default = meta.story();

export const Maintainer = meta.story({
  args: {
    isMaintainer: true,
    roles: ["cre"],
  },
});

export const Contributor = meta.story({
  args: {
    name: "Some Contributor",
    isMaintainer: false,
    roles: ["ctb"],
    link: "mailto:contributor@example.com",
  },
});

export const OrcID = meta.story({
  args: {
    name: "Researcher Name",
    roles: ["aut"],
    link: "https://orcid.org/0000-0000-0000-0000",
  },
});
