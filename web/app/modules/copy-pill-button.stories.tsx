import preview from "../../.storybook/preview";
import { CopyPillButton } from "./copy-pill-button";

const meta = preview.meta({
  title: "Modules/Buttons/CopyPillButton",
  component: CopyPillButton,
  parameters: {
    layout: "centered",
  },
  args: {
    textToCopy: "npm install foo",
    children: "npm install foo",
  },
});

export const Default = meta.story();

export const CustomText = meta.story({
  args: {
    children: "Copy this text",
    textToCopy: "Hidden text to copy",
  },
});
