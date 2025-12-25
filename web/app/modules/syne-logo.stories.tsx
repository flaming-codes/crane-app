import preview from "../../.storybook/preview";
import { SyneLogo } from "./svg";

const meta = preview.meta({
  title: "Modules/Icons/SyneLogo",
  component: SyneLogo,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    className: { control: "text" },
    style: { control: "object" },
  },
});

export const Default = meta.story({
  args: {
    className: "h-32",
  },
});

export const CustomColor = meta.story({
  args: {
    className: "h-32 text-blue-500",
  },
});

export const Large = meta.story({
  args: {
    className: "h-64",
  },
});

export const WithCustomStyle = meta.story({
  args: {
    style: { color: "var(--iris-9)" },
    className: "h-32",
  },
});
