import preview from "../../.storybook/preview";
import { PageContentSection } from "./page-content-section";

const meta = preview.meta({
  title: "Modules/PageLayout/PageContentSection",
  component: PageContentSection,
  parameters: {
    layout: "padded",
  },
  args: {
    headline: "Section Headline",
    subline: "This is a subline description for the section.",
    children: (
      <div className="rounded-lg bg-gray-100 p-4 dark:bg-gray-800">
        Section Content Placeholder
      </div>
    ),
  },
  argTypes: {
    variant: {
      control: "select",
      options: [undefined, "prose"],
    },
  },
});

export const Default = meta.story();

export const ProseVariant = meta.story({
  args: {
    variant: "prose",
    children: (
      <p>
        This content is styled as prose. It&apos;s meant for larger bodies of
        text that require comfortable reading width and line height.
      </p>
    ),
  },
});

export const WithoutSubline = meta.story({
  args: {
    subline: undefined,
  },
});
