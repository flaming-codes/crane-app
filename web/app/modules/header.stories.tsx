import preview from "../../.storybook/preview";
import { Header } from "./header";
import { SyneLogo as Logo } from "./svg";

const meta = preview.meta({
  title: "Modules/PageLayout/Header",
  component: Header,
  parameters: {
    layout: "fullscreen",
  },
  args: {
    headline: "The R packages & authors search engine, enhanced",
    subline: "Search for R packages, authors, and more.",
    gradient: "iris",
  },
  argTypes: {
    gradient: {
      control: "select",
      options: ["iris", "ruby", "jade", "bronze", "sand", "amethyst", "opal"],
    },
  },
});

export const Default = meta.story();

export const WithOrnament = Default.extend({
  args: {
    ornament: <Logo className="h-32 w-32 text-white/10" />,
  },
});

export const RubyGradient = Default.extend({
  args: {
    gradient: "ruby",
  },
});

export const JadeGradient = Default.extend({
  args: {
    gradient: "jade",
  },
});

export const SandGradient = Default.extend({
  args: {
    gradient: "sand",
  },
});
