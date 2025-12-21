import type { Meta, StoryObj } from "@storybook/react";
import { LicenseTable } from "./licenses";

const meta: Meta<typeof LicenseTable> = {
  title: "Modules/Tables/LicenseTable",
  component: LicenseTable,
  parameters: {
    layout: "padded",
  },
};

export default meta;
type Story = StoryObj<typeof LicenseTable>;

export const Default: Story = {};
