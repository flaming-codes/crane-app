import type { Meta, StoryObj } from "@storybook/react";
import { Prose } from "./prose";

const meta: Meta<typeof Prose> = {
  title: "Modules/Typography/Prose",
  component: Prose,
  parameters: {
    layout: "padded",
  },
  args: {
    html: "<p>This is a paragraph with <strong>bold text</strong> and <em>italic text</em>. It may also contain <a href='#'>links</a>.</p>",
  },
};

export default meta;
type Story = StoryObj<typeof Prose>;

export const Default: Story = {};

export const LongText: Story = {
  args: {
    html: `
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
      <ul>
        <li>Item 1</li>
        <li>Item 2</li>
        <li>Item 3</li>
      </ul>
      <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
    `,
  },
};
