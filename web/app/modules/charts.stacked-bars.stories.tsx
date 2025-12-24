import type { Meta, StoryObj } from "@storybook/react-vite";
import { StackedBarsChart } from "./charts.stacked-bars";

const meta: Meta<typeof StackedBarsChart> = {
  title: "Modules/Charts/StackedBarsChart",
  component: StackedBarsChart,
  parameters: {
    layout: "padded",
  },
  args: {
    total: 100,
    data: [
      { label: "Category A", value: 30 },
      { label: "Category B", value: 50 },
      { label: "Category C", value: 20 },
    ],
  },
};

export default meta;
type Story = StoryObj<typeof StackedBarsChart>;

export const Default: Story = {};

export const ManyItems: Story = {
  args: {
    total: 500,
    data: [
      { label: "Item 1", value: 50 },
      { label: "Item 2", value: 100 },
      { label: "Item 3", value: 75 },
      { label: "Item 4", value: 25 },
      { label: "Item 5", value: 150 },
      { label: "Item 6", value: 100 },
    ],
  },
};

export const SingleItem: Story = {
  args: {
    total: 100,
    data: [{ label: "Only Item", value: 80 }],
  },
};
