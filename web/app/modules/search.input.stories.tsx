import type { Meta, StoryObj } from "@storybook/react";
import { SearchInput } from "./search.input";
import { fn } from "@storybook/test";
import { RiMenuLine } from "@remixicon/react";

const meta: Meta<typeof SearchInput> = {
    title: "Modules/Search/SearchInput",
    component: SearchInput,
    args: {
        input: "",
        isFocused: false,
        setIsFocused: fn(),
        onChange: fn(),
        inputRef: { current: null },
    },
};

export default meta;
type Story = StoryObj<typeof SearchInput>;

export const Default: Story = {};

export const Focused: Story = {
    args: {
        isFocused: true,
    },
};

export const WithInput: Story = {
    args: {
        isFocused: true,
        input: "ggplot2",
    },
};

export const WithActions: Story = {
    args: {
        actions: (
            <button className="p-2 text-gray-dim hover:text-gray-normal">
                <RiMenuLine size={18} />
            </button>
        ),
    },
};
