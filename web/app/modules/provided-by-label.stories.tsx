import preview from "../../.storybook/preview";
import { ProvidedByLabel, DataProvidedByCRANLabel } from "./provided-by-label";

const meta = preview.meta({
  title: "Modules/UI/ProvidedByLabel",
  component: ProvidedByLabel,
  args: {
    source: "Google Gemini",
    sourceUrl: "https://ai.google.dev",
  },
});

export const Default = meta.story();

export const CRANLabel = meta.story({
  render: () => <DataProvidedByCRANLabel />,
});
