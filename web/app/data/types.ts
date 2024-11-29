export type PackageRelationshipType =
  | "depends"
  | "imports"
  | "suggests"
  | "linking_to"
  | "enhances"
  | "reverse_depends"
  | "reverse_imports"
  | "reverse_suggests"
  | "reverse_enhances"
  | "reverse_linking_to";

export type PackageDependency = {
  relationship_type: PackageRelationshipType;
  version: string | null;
  related_package: { id: number; name: string };
};

export type SitemapItem = [name: string, lastModAt: string];
