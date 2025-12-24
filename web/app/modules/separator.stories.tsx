import preview from "../../.storybook/preview";
import { Separator } from "./separator";

const meta = preview.meta({
  title: "Modules/UI/Separator",
  component: Separator,
  decorators: [
    (Story) => (
      <div className="mx-auto w-full max-w-md py-10">
        <p>Content above</p>
        <div className="my-4">
          <Story />
        </div>
        <p>Content below</p>
      </div>
    ),
  ],
});

export const Default = meta.story();
