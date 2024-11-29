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

export type OverviewPkg = {
  name: string;
  title: string;
  slug: string;
  author_names: string[];
};

export type SitemapPackage = [slug: string, lastMod: string];

export type AllAuthorsMap = Record<string, string[]>;

export type PackageAuthor = Record<string, string[]>;

export type SearchableAuthor = {
  name: string;
  slug: string;
  totalPackages?: number;
};

/**
 * Wrapper type for any object that has an expiration date.
 * If possible, use a stub index + expiresAt of 0 for init and then update the index
 * once it has expired.
 */
export type ExpiringSearchIndex<T> = {
  index: T;
  expiresAt: number;
};
