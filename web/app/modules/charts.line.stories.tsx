import type { Meta, StoryObj } from "@storybook/react";
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

const meta: Meta<typeof LineGraph> = {
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
};

export default meta;
type Story = StoryObj<typeof LineGraph>;

export const Default: Story = {};

export const LongDuration: Story = {
    args: {
        data: generateData(90),
    },
};

export const SmallHeight: Story = {
    args: {
        height: 200,
        data: generateData(14),
    },
};
