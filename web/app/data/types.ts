type TextLinkTuple = {
  text: string;
  link: string;
};

type NameLinkTuple = {
  name: string;
  link: string;
};

type LabelLinkTuple = {
  label: string;
  link: string;
};

export type Dependency = {
  name: string;
  link?: string;
  version?: string;
};

export type Pkg = {
  id: string;
  slug: string;
  url: string;
  name: string;
  title: string;
  description: string;
  version: string;
  date: string;
  // JS-ISO Date in number from 'date'.
  createdAt: number;
  maintainer?: {
    name: string;
    email?: string;
  };
  link?: {
    text: string;
    links: string[];
  };
  bugreports?: string;
  needscompilation?: "yes" | "no";
  cran_checks: LabelLinkTuple;
  language?: string;
  inviews?: NameLinkTuple[];
  systemreqs?: string;
  materials?: Array<NameLinkTuple & { type?: string }>;
  citation?: { label: string; link: string[] };
  contact?: { names: string[]; emails: string[] };
  copyright?: TextLinkTuple;
  priority?: string;
  additional_repositories?: { links: string[] } | NameLinkTuple[];
  author?: Array<{
    name: string;
    roles?: string[];
    link?: string;
    extra?: string;
  }>;
  license?: Array<NameLinkTuple & { extra?: string }>;
  os_type?: string;
  classification_acm?: Dependency[];
  classification_msc?: Dependency[];
  mailinglist?: string;
  reference_manual: LabelLinkTuple;
  vignettes?: NameLinkTuple[];
  package_source: LabelLinkTuple;
  windows_binaries?: Array<LabelLinkTuple & { meta?: string }>;
  macos_binaries?: Array<LabelLinkTuple & { meta: string }>;
  old_sources?: LabelLinkTuple;
  last_scraped: string;
  // JS-ISO Date in number from 'last_scraped'.
  lastScrapedAt: number;

  // Dependencies.
  depends?: Dependency[];
  imports: Dependency[];
  suggests: Dependency[];
  linkingto?: Dependency[];
  enhances?: Dependency[];
  reverse_depends?: Dependency[];
  reverse_imports?: Dependency[];
  reverse_suggests?: Dependency[];
  reverse_enhances?: Dependency[];
  reverse_linkingto?: Dependency[];
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

export type CranDownloadsResponse = Array<{
  downloads: number;
  start: string;
  end: string;
  package: string;
}>;

export type CranTopDownloadedPackagesRes = {
  start: string; // e.g. "2015-05-01T00:00:00.000Z";
  end: string; // e.g. "2015-05-01T00:00:00.000Z";
  downloads: Array<{ package: string; downloads: number }>;
};

/**
 * Trending packages are the ones that were downloaded at least 1000 times during last week,
 * and that substantially increased their download counts, compared to the average weekly downloads in the previous 24 weeks.
 * The percentage of increase is also shown in the output.
 */
export type CranTrendingPackagesRes = Array<{
  package: string;
  increase: number;
}>;

export type CranResponse =
  | CranDownloadsResponse
  | CranTopDownloadedPackagesRes
  | CranTrendingPackagesRes;

export type PackageDownloadTrend = {
  trend: string;
  label: string;
  value: string;
};
