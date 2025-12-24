import preview from "../../.storybook/preview";
import { PackageDependencySearch } from "./package-dependency-search";
import { PackageDependency } from "../data/types";

// Helper to create mock dependencies
const createDeps = (count: number, prefix: string): PackageDependency[] => {
  return Array.from({ length: count }, (_, i) => ({
    relationship_type: "imports", // Value doesn't strictly matter for the mock generation in component as it's passed via key in record
    version: null,
    related_package: {
      id: i,
      name: `${prefix}.pkg.${i + 1}`,
    },
  }));
};

const meta = preview.meta({
  title: "Modules/Search/PackageDependencySearch",
  component: PackageDependencySearch,
  parameters: {
    layout: "padded",
  },
  args: {
    relations: {
      depends: createDeps(3, "depends"),
      imports: createDeps(5, "imports"),
      suggests: createDeps(2, "suggests"),
    },
  },
});

export const Default = meta.story();

export const ManyDependencies = meta.story({
  args: {
    relations: {
      depends: createDeps(10, "depends"),
      imports: createDeps(20, "imports"),
      suggests: createDeps(15, "suggests"),
      linking_to: createDeps(5, "linking"),
      enhances: createDeps(2, "enhances"),
      reverse_depends: createDeps(5, "rev_depends"),
    },
  },
});

export const OnlyReverseDependencies = meta.story({
  args: {
    relations: {
      reverse_imports: createDeps(12, "rev_imports"),
      reverse_suggests: createDeps(8, "rev_suggests"),
    },
  },
});

export const Empty = meta.story({
  args: {
    relations: {},
  },
});
