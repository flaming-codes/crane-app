import type { Meta, StoryObj } from "@storybook/react-vite";
import { AboutStoryBox } from "./about-story-box";

const meta: Meta<typeof AboutStoryBox> = {
  title: "Modules/Cards/AboutStoryBox",
  component: AboutStoryBox,
  parameters: {
    layout: "padded",
  },
  args: {
    title: "Our story",
    headline: "Two developers from Austria passionate about coding.",
    children: (
      <>
        <p>
          Our names are Lukas and Tom and we&apos;re two developers from
          Austria. Our passion for coding (the one in R, the other in
          TypeScript) led us to the discovery of the original CRAN-site.
        </p>
        <p>
          Seeing the desperate visual state the site was in, we decided to give
          it a facelift. We&apos;re not affiliated with CRAN or RStudio in any
          way. CRAN/E is the culmination of our efforts to make the site more
          modern and user-friendly and we hope you enjoy it as much as we do!
        </p>
        <p>
          Our main focus was ease of use and accessibility, especially for
          lightning fast searches.
        </p>
      </>
    ),
  },
};

export default meta;
type Story = StoryObj<typeof AboutStoryBox>;

export const Default: Story = {};
