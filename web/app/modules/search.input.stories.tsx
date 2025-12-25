import preview from "../../.storybook/preview";
import { SearchInput } from "./search.input";
import { fn } from "@storybook/test";
import { RiMenuLine } from "@remixicon/react";

const meta = preview.meta({
  title: "Modules/Search/SearchInput",
  component: SearchInput,
  args: {
    input: "",
    isFocused: false,
    setIsFocused: fn(),
    onChange: fn(),
    inputRef: { current: null },
  },
});

export const Default = meta.story();

export const Focused = meta.story({
  args: {
    isFocused: true,
  },
});

export const WithInput = meta.story({
  args: {
    isFocused: true,
    input: "ggplot2",
  },
});

export const WithActions = meta.story({
  args: {
    actions: (
      <button className="text-gray-dim hover:text-gray-normal p-2">
        <RiMenuLine size={18} />
      </button>
    ),
  },
});
