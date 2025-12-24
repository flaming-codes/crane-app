import preview from "../../.storybook/preview";
import { PlausibleChoicePillButton } from "./plausible";

const meta = preview.meta({
  title: "Modules/Buttons/PlausibleChoicePillButton",
  component: PlausibleChoicePillButton,
  parameters: {
    layout: "centered",
  },
});

export const Default = meta.story({
  render: () => <PlausibleChoicePillButton />,
});
