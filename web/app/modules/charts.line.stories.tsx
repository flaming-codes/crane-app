import preview from "../../.storybook/preview";
import { LineGraph } from "./charts.line";
import { format, subDays } from "date-fns";

const today = new Date();

// Generate mock data for the last 30 days
const generateData = (days: number) => {
  return Array.from({ length: days }, (_, i) => {
    const date = subDays(today, days - 1 - i);
    return {
      date: format(date, "yyyy-MM-dd"),
      value: Math.floor(Math.random() * 500) + 50,
    };
  });
};

const meta = preview.meta({
  title: "Modules/Charts/LineGraph",
  component: LineGraph,
  parameters: {
    layout: "padded",
  },
  args: {
    data: generateData(30),
    height: 400,
    padding: 16,
  },
});

export const Default = meta.story();

export const LongDuration = meta.story({
  args: {
    data: generateData(90),
  },
});

export const SmallHeight = meta.story({
  args: {
    height: 200,
    data: generateData(14),
  },
});
