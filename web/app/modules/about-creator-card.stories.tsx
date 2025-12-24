import type { Meta, StoryObj } from "@storybook/react-vite";
import { AboutCreatorCard } from "./about-creator-card";
import { RiLinkedinFill } from "@remixicon/react";

const meta: Meta<typeof AboutCreatorCard> = {
  title: "Modules/Cards/AboutCreatorCard",
  component: AboutCreatorCard,
  parameters: {
    layout: "padded",
  },
  args: {
    name: "Lukas Schönmann",
    portrait: "/images/we/lukas_v2.webp",
    tagline:
      "Specializes in Bioinformatics with a master's from the University of Life Sciences in Vienna, working at the intersection of R research and data analysis.",
    bio: [
      "Lukas brings expertise in Bioinformatics, combining his master's degree from the University of Life Sciences in Vienna with practical R development skills.",
      "He focuses on data analysis and research applications, bridging the gap between biological data and computational insights through R programming.",
    ],
    focusAreas: ["Bioinformatics", "R programming", "Data analysis"],
    links: [
      {
        href: "https://www.linkedin.com/in/lukas-schönmann-70781a215/",
        copy: "Connect with Lukas",
        icon: <RiLinkedinFill size={16} />,
      },
    ],
  },
};

export default meta;
type Story = StoryObj<typeof AboutCreatorCard>;

export const Lukas: Story = {};

export const Tom: Story = {
  args: {
    name: "Tom Schönmann",
    portrait: "/images/we/tom_v2.webp",
    tagline:
      "Works in informatics with a focus on TypeScript development, turning raw CRAN data into lightning-fast search experiences.",
    bio: [
      "Tom specializes in informatics and TypeScript development, architecting the infrastructure that indexes and hydrates tens of thousands of R packages.",
      "He focuses on technical implementation and performance optimization, ensuring the search functionality works seamlessly across the platform.",
    ],
    focusAreas: ["Informatics", "TypeScript", "Search architecture"],
    links: [
      {
        href: "https://www.linkedin.com/in/tom-schönmann-487b97164/",
        copy: "Connect with Tom",
        icon: <RiLinkedinFill size={16} />,
      },
    ],
  },
};
