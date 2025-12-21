import type { Meta, StoryObj } from "@storybook/react";
import { Heatmap } from "./charts.heatmap";
import { format, subDays } from "date-fns";

const today = new Date();
const formattedToday = format(today, "yyyy-MM-dd");
const formattedStartDate = format(subDays(today, 60), "yyyy-MM-dd");

// Generate mock data
const generateDownloads = (days: number) => {
  return Array.from({ length: days }, (_, i) => {
    const date = subDays(today, days - 1 - i);
    return {
      day: format(date, "yyyy-MM-dd"),
      downloads: Math.floor(Math.random() * 1000) + 100, // Random downloads between 100 and 1100
    };
  });
};

const meta: Meta<typeof Heatmap> = {
  title: "Modules/Charts/Heatmap",
  component: Heatmap,
  parameters: {
    layout: "padded",
  },
  args: {
    start: formattedStartDate,
    end: formattedToday,
    downloads: generateDownloads(61), // 60 days back + today
  },
};

export default meta;
type Story = StoryObj<typeof Heatmap>;

export const Default: Story = {};

export const LowActivity: Story = {
  args: {
    downloads: generateDownloads(61).map((d) => ({
      ...d,
      downloads: Math.random() > 0.8 ? 50 : 0,
    })),
  },
};

export const HighActivity: Story = {
  args: {
    downloads: generateDownloads(61).map((d) => ({
      ...d,
      downloads: Math.floor(Math.random() * 5000) + 2000,
    })),
  },
};
