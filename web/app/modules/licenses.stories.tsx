import preview from "../../.storybook/preview";
import { LicenseTable } from "./licenses";

const meta = preview.meta({
  title: "Modules/Tables/LicenseTable",
  component: LicenseTable,
  parameters: {
    layout: "padded",
  },
});

export const Default = meta.story();
