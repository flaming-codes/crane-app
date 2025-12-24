import preview from "../../.storybook/preview";
import { StackedBarsChart } from "./charts.stacked-bars";

const meta = preview.meta({
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
});

export const Default = meta.story();

export const ManyItems = meta.story({
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
});

export const SingleItem = meta.story({
  args: {
    total: 100,
    data: [{ label: "Only Item", value: 80 }],
  },
});
