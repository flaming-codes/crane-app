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
  needscompilation?: 'yes' | 'no';
  cran_checks: LabelLinkTuple;
  language?: string;
  inviews?: NameLinkTuple[];
  systemreqs?: string;
  materials?: Array<NameLinkTuple & { type?: string }>;
  citation?: { label: string; link: string[] };
  contact?: { names: string[]; emails: string[] };
  copyright?: TextLinkTuple;
  priority?: string;
  additional_repositories?: NameLinkTuple[];
  author?: Array<{ name: string; roles?: string[]; link?: string }>;
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
