import { Header } from "../modules/header";
import { Tag } from "../modules/tag";
import { AnchorLink, Anchors } from "../modules/anchors";
import { PackageService } from "../data/package.service";
import { Link, useLoaderData, useLocation } from "react-router";
import { data, type LoaderFunction } from "react-router";
import { Prose } from "../modules/prose";
import { Separator } from "../modules/separator";
import { PageContent } from "../modules/page-content";
import { format, minutesToSeconds } from "date-fns";
import { ExternalLink } from "../modules/external-link";
import {
  RiArrowRightSLine,
  RiBug2Line,
  RiExternalLinkLine,
  RiFilePdf2Line,
  RiGithubLine,
} from "@remixicon/react";
import { InfoPill } from "../modules/info-pill";
import { CopyPillButton } from "../modules/copy-pill-button";
import { ExternalLinkPill } from "../modules/external-link-pill";
import { PageContentSection } from "../modules/page-content-section";
import { BinaryDownloadLink } from "../modules/binary-download-link";
import { ContactPill } from "../modules/contact-pill";
import { InfoCard } from "../modules/info-card";
import { lazy, ReactNode, Suspense, useMemo } from "react";
import { sendEvent } from "../modules/plausible";
import {
  composeBreadcrumbsJsonLd,
  composeFAQJsonLd,
  mergeMeta,
} from "../modules/meta";
import { BASE_URL } from "../modules/app";
import { uniq } from "es-toolkit";
import { PackageInsightService } from "../data/package-insight.service.server";
import { slog } from "../modules/observability.server";
import { DataProvidedByCRANLabel } from "../modules/provided-by-label";
import { CranDownloadsResponse } from "../data/package-insight.shape";
import { Heatmap } from "../modules/charts.heatmap";
import { ClientOnly } from "remix-utils/client-only";
import { LineGraph } from "../modules/charts.line";
import { getFunnyPeakDownloadComment } from "../modules/package.insights.server";
import { IS_DEV } from "../modules/app.server";
import { Tables } from "../data/supabase.types.generated";
import { PackageDependency, PackageRelationshipType } from "../data/types";

type Pkg = Tables<"cran_packages">;

type Author = Tables<"authors"> & { roles: string[] };

type LoaderData = {
  item: Pkg;
  relations: Partial<Record<PackageRelationshipType, PackageDependency[]>>;
  authors: Author[];
  maintainer: Author;
  dailyDownloads: CranDownloadsResponse;
  yearlyDailyDownloads: CranDownloadsResponse;
  lastRelease: string;
  totalMonthDownloads: number;
  yesterdayDownloads?: { day: string; downloads: number };
  peakYearlyDayDownloads?: { day: string; downloads: number };
  last31DaysDownloads: CranDownloadsResponse;
  monthlyDayDownloadsComment: string;
  totalYearDownloads: number;
  totalLast31DaysDownloads: number;
  totalYearlyDownloadsComment: string;
  indexOfTrendingItems: number;
  indexOfTopDownloads: number;
};

const PackageDependencySearch = lazy(() =>
  import("../modules/package-dependency-search").then((mod) => ({
    default: mod.PackageDependencySearch,
  })),
);

const sections = [
  "Synopsis",
  "Documentation",
  "Team",
  "Insights",
  "Binaries",
  "Dependencies",
] as const;

export const meta = mergeMeta(
  ({ data }) => {
    const { item } = data as LoaderData;
    const url = BASE_URL + `/package/${encodeURIComponent(item.name)}`;

    const title = `${item.name}: ${item.title} | CRAN/E`;

    return [
      { title },
      { name: "description", content: item.description },
      { property: "og:title", content: title },
      { property: "og:description", content: item.description },
      { property: "og:url", content: url },
      { property: "og:image", content: `${url}/og` },
    ];
  },
  ({ data }) => {
    const { item, maintainer, authors, lastRelease } = data as LoaderData;

    return [
      {
        "script:ld+json": composeBreadcrumbsJsonLd([
          {
            name: "Packages",
            href: "/packages",
          },
          {
            name: item.name,
            href: `/package/${item.name}`,
          },
        ]),
      },
      {
        "script:ld+json": composeFAQJsonLd([
          {
            q: `What does the R-package '${item.name}' do?`,
            a: `${item.title}. ${item.description}`,
          },
          {
            q: `Who maintains ${item.name}?`,
            a: maintainer?.name || "Unknown",
          },
          {
            q: `Who authored ${item.name}?`,
            a: authors?.map((a) => a.name).join(", ") || "Unknown",
          },
          {
            q: `What is the current version of ${item.name}?`,
            a: `The current version of the R-package '${item.version}' is ${item.version}`,
          },
          {
            q: `When was the last release of ${item.name}?`,
            a: `The last release of the R-package '${item.version}' was ${lastRelease}`,
          },
          {
            q: `Where can I search for the R-package '${item.name}'?`,
            a: `You can search for the R-package '${item.name}' on CRAN/E at ${BASE_URL}`,
          },
        ]),
      },
    ];
  },
);

export const loader: LoaderFunction = async ({ params }) => {
  const { packageName } = params;

  if (!packageName) {
    throw new Response(null, {
      status: 404,
      statusText: `No package ID provided`,
    });
  }

  const loaderData: Partial<LoaderData> = {
    item: undefined,
    relations: {},
    authors: [],
    maintainer: undefined,
    dailyDownloads: [],
    yearlyDailyDownloads: [],
    last31DaysDownloads: [],
    lastRelease: "",
    totalMonthDownloads: 0,
    yesterdayDownloads: undefined,
    peakYearlyDayDownloads: undefined,
    monthlyDayDownloadsComment: "",
    totalYearDownloads: 0,
    totalLast31DaysDownloads: 0,
    totalYearlyDownloadsComment: "",
    indexOfTrendingItems: -1,
    indexOfTopDownloads: -1,
  };

  try {
    // Use shared enrichment method
    const enrichedData =
      await PackageService.getEnrichedPackageByName(packageName);
    if (!enrichedData) {
      throw new Response(null, {
        status: 404,
        statusText: `Package '${packageName}' not found`,
      });
    }

    const {
      pkg,
      groupedRelations,
      authorsList,
      maintainer,
      dailyDownloads: _dailyDownloads,
      yearlyDailyDownloads: _yearlyDailyDownloads,
      trendingPackages: _trendingPackages,
      totalMonthDownloads,
      totalYearDownloads,
      lastRelease,
    } = enrichedData;

    // Fetch page-specific data (top downloads)
    const _topDownloads = await PackageInsightService.getTopDownloadedPackages(
      "last-day",
      50,
    );

    // Assign the core enriched data
    loaderData.item = pkg;
    loaderData.relations =
      groupedRelations as unknown as LoaderData["relations"];
    loaderData.authors = authorsList;
    loaderData.maintainer = maintainer;
    loaderData.dailyDownloads = _dailyDownloads;
    loaderData.yearlyDailyDownloads = _yearlyDailyDownloads;
    loaderData.totalMonthDownloads = totalMonthDownloads;
    loaderData.totalYearDownloads = totalYearDownloads;
    loaderData.lastRelease = lastRelease;

    // Page-specific calculations
    loaderData.yesterdayDownloads = _dailyDownloads.at(0)?.downloads?.at(-1);

    const maxYearlyDownloads = [
      ...(_yearlyDailyDownloads[0]?.downloads || []),
    ].sort((a, b) => b.downloads - a.downloads)[0] || { day: "", downloads: 0 };

    loaderData.peakYearlyDayDownloads =
      _yearlyDailyDownloads[0]?.downloads?.find(
        (d) => d.downloads === maxYearlyDownloads.downloads,
      );

    loaderData.totalYearlyDownloadsComment = getFunnyPeakDownloadComment(
      loaderData.totalYearDownloads,
    );

    loaderData.monthlyDayDownloadsComment = getFunnyPeakDownloadComment(
      loaderData.totalMonthDownloads ?? 0,
    );

    loaderData.indexOfTrendingItems = _trendingPackages.findIndex(
      (item) => item.package === packageName,
    );

    loaderData.indexOfTopDownloads = _topDownloads?.downloads.findIndex(
      (item) => item.package === packageName,
    );

    if (loaderData.yearlyDailyDownloads.at(0)) {
      const yearly = loaderData.yearlyDailyDownloads.at(0)!;
      loaderData.last31DaysDownloads = [
        {
          ...yearly,
          downloads: yearly.downloads.slice(-31),
        },
      ];
      loaderData.totalLast31DaysDownloads =
        loaderData.last31DaysDownloads[0].downloads.reduce(
          (acc, curr) => acc + curr.downloads,
          0,
        );
    }
  } catch (error) {
    slog.error(error);
    throw new Response(null, {
      status: 404,
      statusText: `Package '${packageName}' not found`,
    });
  }

  return data(loaderData, {
    headers: {
      "Cache-Control": IS_DEV
        ? "max-age=0, s-maxage=0"
        : `public, max-age=${minutesToSeconds(10)}`,
    },
  });
};

export default function PackagePage() {
  const {
    item,
    relations,
    maintainer,
    authors,
    dailyDownloads,
    yearlyDailyDownloads,
    last31DaysDownloads,
    lastRelease,
    totalMonthDownloads,
    yesterdayDownloads,
    totalYearDownloads,
    totalYearlyDownloadsComment,
    totalLast31DaysDownloads,
    monthlyDayDownloadsComment,
    peakYearlyDayDownloads,
    indexOfTrendingItems,
    indexOfTopDownloads,
  } = useLoaderData<LoaderData>();

  const anchorIds = sections.map((item) => item.toLowerCase());

  return (
    <>
      <Header
        gradient="iris"
        headline={item.name}
        subline={item.title}
        ornament={<Tag>CRAN Package</Tag>}
      />

      <Anchors anchorIds={anchorIds}>
        {sections.map((item) => (
          <AnchorLink key={item} fragment={item.toLowerCase()}>
            {item}
          </AnchorLink>
        ))}
      </Anchors>

      <PageContent>
        <AboveTheFoldSection
          item={item}
          lastRelease={lastRelease}
          indexOfTrendingItems={indexOfTrendingItems}
          indexOfTopDownloads={indexOfTopDownloads}
        />

        <Separator />

        <DocumentationPageContentSection
          vignettes={item.vignettes}
          materials={item.materials}
          in_views={item.in_views}
        />

        <TeamPageContentSection maintainer={maintainer} authors={authors} />

        <Separator />

        <InsightsPageContentSection
          dailyDownloads={dailyDownloads}
          yearlyDailyDownloads={yearlyDailyDownloads}
          totalMonthDownloads={totalMonthDownloads}
          yesterdayDownloads={yesterdayDownloads}
          peakYearlyDayDownloads={peakYearlyDayDownloads}
          totalYearDownloads={totalYearDownloads}
          monthlyDayDownloadsComment={monthlyDayDownloadsComment}
          totalYearlyDownloadsComment={totalYearlyDownloadsComment}
          last31DaysDownloads={last31DaysDownloads}
          totalLast31DaysDownloads={totalLast31DaysDownloads}
        />

        <BinariesPageContentSection
          macos_binaries={item.macos_binaries}
          windows_binaries={item.windows_binaries}
          old_sources={item.old_sources}
        />

        <Separator />

        <DependenciesPageContentSection relations={relations} />
      </PageContent>
    </>
  );
}

function AboveTheFoldSection(
  props: Pick<
    LoaderData,
    "item" | "lastRelease" | "indexOfTopDownloads" | "indexOfTrendingItems"
  >,
) {
  const { item, lastRelease, indexOfTrendingItems, indexOfTopDownloads } =
    props;

  const rVersion = item.r_version || "unknown";

  const getTrendingLabel = () => {
    if (indexOfTrendingItems < 0) return null;
    if (indexOfTrendingItems < 10) return "Top 10 trending package";
    if (indexOfTrendingItems < 20) return "Top 20 trending package";
    if (indexOfTrendingItems < 50) return "Top 50 Trending package";
    return "Trending package";
  };

  const getTopDownloadsLabel = () => {
    if (indexOfTopDownloads < 0) return null;
    if (indexOfTopDownloads < 10) return "Top 10 downloaded package";
    if (indexOfTopDownloads < 20) return "Top 20 downloaded package";
    if (indexOfTopDownloads < 50) return "Top 50 downloaded package";
    return "Top downloaded package";
  };

  // Description contains links in Markdown-format,
  // we convert them to HTML.
  const enhancedDescription = item.description.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" rel="noopener noreferrer" target="_blank" class="rounded-full text-xs inline-block mx-1 px-2 py-1 border translate-y-[-2px]">$1</a>',
  );

  return (
    <PageContentSection fragment="synopsis">
      <div className="space-y-6">
        <Prose html={enhancedDescription} />
      </div>

      <div className="flex flex-col gap-6 overflow-x-hidden">
        <ul className="flex flex-wrap items-start gap-4">
          <li>
            <CopyPillButton
              textToCopy={`install.packages('${item.name}')`}
              onSuccess={() => {
                sendEvent("copy-to-clipboard", { props: { value: item.name } });
              }}
            >
              install.packages(&apos;{item.name}&apos;)
            </CopyPillButton>
          </li>
          {indexOfTrendingItems > -1 ? (
            <li>
              <Link
                to="/statistic/packages/trends"
                aria-label="Show trending packages"
              >
                <InfoPill className="from-gold-6 dark:from-gold-11 bg-linear-to-bl">
                  <span>{getTrendingLabel()}</span>
                  <RiArrowRightSLine size={16} />
                </InfoPill>
              </Link>
            </li>
          ) : null}
          {indexOfTopDownloads > -1 ? (
            <li>
              <Link
                to="/statistic/packages/downloads"
                aria-label="Show top downloaded packages"
              >
                <InfoPill className="from-gold-6 dark:from-gold-11 bg-linear-to-bl">
                  <span>{getTopDownloadsLabel()}</span>
                  <RiArrowRightSLine size={16} />
                </InfoPill>
              </Link>
            </li>
          ) : null}
          {item.link
            ? uniq((item.link as Record<string, string[]>).links).map(
                (href, i) => (
                  <li key={href + i}>
                    <ItemExternalGeneralLinkPill href={href} />
                  </li>
                ),
              )
            : null}
          {item.bug_reports ? (
            <li>
              <ExternalLinkPill
                href={item.bug_reports}
                icon={<RiBug2Line size={18} />}
              >
                File a bug report
              </ExternalLinkPill>
            </li>
          ) : null}
          {item.cran_checks ? (
            <li>
              <ExternalLinkPill
                href={(item.cran_checks as Record<string, string>).link}
                icon={<RiExternalLinkLine size={18} />}
              >
                {(item.cran_checks as Record<string, string>).label}
              </ExternalLinkPill>
            </li>
          ) : null}
          {item.reference_manual ? (
            <li>
              <ExternalLinkPill
                href={(item.reference_manual as Record<string, string>).link}
                icon={<RiFilePdf2Line size={18} />}
              >
                {(item.reference_manual as Record<string, string>).label}
              </ExternalLinkPill>
            </li>
          ) : null}
        </ul>
        <ul className="flex flex-wrap items-start gap-4">
          <li>
            <InfoPill label="Version">{item.version}</InfoPill>
          </li>
          <li>
            <InfoPill label="R version">{rVersion || "unknown"}</InfoPill>
          </li>
          {item.licenses
            ? (item.licenses as Record<string, string>[]).map((license) => (
                <li key={license.link}>
                  <ExternalLink href={license.link}>
                    <InfoPill label="License">
                      {license.name}
                      <RiExternalLinkLine size={12} className="text-gray-dim" />
                    </InfoPill>
                  </ExternalLink>
                </li>
              ))
            : null}
          <li>
            <InfoPill label="Needs compilation?">
              {item.needs_compilation ? "Yes" : "No"}
            </InfoPill>
          </li>
          {item.language ? (
            <li>
              <InfoPill label="Language">{item.language}</InfoPill>
            </li>
          ) : null}
          {item.os_type ? (
            <li>
              <InfoPill label="OS">{item.os_type}</InfoPill>
            </li>
          ) : null}
          {item.citation &&
          (item.citation as Record<string, string>[]) &&
          (item.citation as Record<string, string>[]).length > 0
            ? (item.citation as Record<string, string>[]).map(
                ({ link, label }) => (
                  <li key={link}>
                    <ExternalLinkPill href={link}>
                      {label || link}
                    </ExternalLinkPill>
                  </li>
                ),
              )
            : null}
          <li>
            <InfoPill
              label="Last release"
              className="animate-fade duration-200"
            >
              {lastRelease}
            </InfoPill>
          </li>
        </ul>
      </div>
    </PageContentSection>
  );
}

function ItemExternalGeneralLinkPill(props: { href: string }) {
  const { href } = props;

  const [icon, label] = useMemo(() => {
    const mapToProperties = (): [ReactNode, ReactNode] => {
      if (href.includes("github.com"))
        return [<RiGithubLine key="github" size={18} />, "GitHub"];
      return [<RiExternalLinkLine key="external" size={18} />, href];
    };
    return mapToProperties();
  }, [href]);

  return (
    <ExternalLinkPill href={href} icon={icon}>
      {label}
    </ExternalLinkPill>
  );
}

function BinariesPageContentSection(
  props: Pick<Pkg, "macos_binaries" | "windows_binaries" | "old_sources">,
) {
  const { macos_binaries, windows_binaries, old_sources } = props;

  return (
    <PageContentSection
      headline="Binaries"
      // subline="Download all available executables for this package"
      fragment="binaries"
    >
      <ul className="grid grid-cols-2 items-start gap-4 md:grid-cols-3 lg:grid-cols-4">
        {(macos_binaries as Record<"link" | "label", string>[])?.map(
          (item, i) => (
            <li key={item.link + i}>
              <BinaryDownloadLink
                variant="iris"
                href={item.link}
                os="macOS"
                headline={item.label.split(" ")?.[0]?.replace(":", "")}
                arch={
                  item.label
                    .split(" ")?.[1]
                    ?.replace(":", "")
                    .replace("(", "")
                    .replace(")", "") || "x86_64"
                }
              />
            </li>
          ),
        ) || null}
        {(windows_binaries as Record<"link" | "label", string>[])?.map(
          (item, i) => (
            <li key={item.link + i}>
              <BinaryDownloadLink
                variant="iris"
                href={item.link}
                os="Windows"
                headline={item.label.split(" ")?.[0]?.replace(":", "")}
                arch={
                  item.label
                    .split(" ")?.[1]
                    ?.replace(":", "")
                    .replace("(", "")
                    .replace(")", "") || "x86_64"
                }
              />
            </li>
          ),
        ) || null}
        {old_sources ? (
          <li key={(old_sources as Record<"link" | "label", string>).link}>
            <BinaryDownloadLink
              variant="iris"
              href={(old_sources as Record<"link" | "label", string>).link}
              os="Old Source"
              headline={(old_sources as Record<"link" | "label", string>).label}
            />
          </li>
        ) : null}
      </ul>
    </PageContentSection>
  );
}

function TeamPageContentSection(
  props: Pick<LoaderData, "maintainer" | "authors">,
) {
  const { maintainer, authors } = props;

  const otherAuthors = authors?.filter((a) => a.name !== maintainer?.name);
  const maintainerRoles = authors?.find(
    (a) => a.name === maintainer?.name,
  )?.roles;

  const hasOtherAuthors = otherAuthors && otherAuthors.length > 0;

  return (
    <PageContentSection
      headline="Team"
      // subline="See everyone of the team behind this package"
      fragment="team"
    >
      <ul className="grid grid-cols-1 items-start gap-8">
        {maintainer ? (
          <li>
            <ContactPill
              isMaintainer
              name={maintainer.name}
              roles={maintainerRoles || []}
              link={maintainer.email || ""}
            />
          </li>
        ) : null}
        {hasOtherAuthors
          ? otherAuthors?.map((author) => (
              <li key={author.name}>
                <ContactPill
                  name={author.name}
                  roles={author.roles || []}
                  link={
                    author.orc_link ||
                    author.linkedin_link ||
                    author.github_link ||
                    author.unknown_link ||
                    ""
                  }
                />
              </li>
            ))
          : null}
      </ul>
    </PageContentSection>
  );
}

function InsightsPageContentSection(
  props: Pick<
    LoaderData,
    | "dailyDownloads"
    | "yearlyDailyDownloads"
    | "totalMonthDownloads"
    | "yesterdayDownloads"
    | "peakYearlyDayDownloads"
    | "totalYearDownloads"
    | "monthlyDayDownloadsComment"
    | "totalYearlyDownloadsComment"
    | "totalYearDownloads"
    | "last31DaysDownloads"
    | "totalLast31DaysDownloads"
  >,
) {
  const {
    dailyDownloads,
    yearlyDailyDownloads,
    totalMonthDownloads,
    yesterdayDownloads,
    peakYearlyDayDownloads,
    totalYearDownloads,
    monthlyDayDownloadsComment,
    totalYearlyDownloadsComment,
    last31DaysDownloads,
  } = props;

  const nrFormatter = new Intl.NumberFormat("en-US");

  const hasDailyDownloads =
    dailyDownloads &&
    dailyDownloads.length > 0 &&
    Boolean(dailyDownloads[0].downloads);

  const hasYearlyDownloads =
    yearlyDailyDownloads &&
    yearlyDailyDownloads.length > 0 &&
    Boolean(yearlyDailyDownloads[0].downloads);

  if (!hasDailyDownloads && !hasYearlyDownloads) {
    return null;
  }

  return (
    <>
      <PageContentSection headline="Insights" fragment="insights">
        {hasDailyDownloads ? (
          <>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Last 30 days</h3>
              <ClientOnly
                fallback={
                  <div className="bg-gray-ui h-64 animate-pulse rounded-md" />
                }
              >
                {() => (
                  <p>
                    This package has been downloaded{" "}
                    <strong>{nrFormatter.format(totalMonthDownloads)}</strong>{" "}
                    {totalMonthDownloads === 1 ? "time" : "times"} in the last
                    30 days. {monthlyDayDownloadsComment} The following heatmap
                    shows the distribution of downloads per day.
                    {yesterdayDownloads ? (
                      <>
                        {" "}
                        Yesterday, it was downloaded{" "}
                        <strong>
                          {nrFormatter.format(yesterdayDownloads.downloads)}
                        </strong>{" "}
                        times.
                      </>
                    ) : null}
                  </p>
                )}
              </ClientOnly>
            </div>
            <ClientOnly
              fallback={
                <div className="grid grid-cols-7 gap-2">
                  {Array.from({ length: 30 }, (_, i) => (
                    <div
                      key={i}
                      className="bg-gray-ui aspect-square animate-pulse rounded-md"
                    />
                  ))}
                </div>
              }
            >
              {() => (
                <Heatmap
                  downloads={dailyDownloads[0].downloads}
                  start={dailyDownloads[0].start}
                  end={dailyDownloads[0].end}
                />
              )}
            </ClientOnly>

            <div className="space-y-4">
              <p>
                The following line graph shows the downloads per day. You can
                hover over the graph to see the exact number of downloads per
                day.
              </p>
            </div>
            <ClientOnly
              fallback={
                <div className="bg-gray-ui h-200 animate-pulse rounded-md" />
              }
            >
              {() => (
                <LineGraph
                  height={200}
                  data={last31DaysDownloads[0].downloads.map((d) => ({
                    date: d.day,
                    value: d.downloads,
                  }))}
                />
              )}
            </ClientOnly>
          </>
        ) : null}

        {hasYearlyDownloads ? (
          <>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Last 365 days</h3>
              <ClientOnly
                fallback={
                  <div className="bg-gray-ui h-64 animate-pulse rounded-md" />
                }
              >
                {() => (
                  <p>
                    This package has been downloaded{" "}
                    <strong>{nrFormatter.format(totalYearDownloads)}</strong>{" "}
                    {totalYearDownloads === 1 ? "time" : "times"} in the last
                    365 days. {totalYearlyDownloadsComment}{" "}
                    {peakYearlyDayDownloads ? (
                      <>
                        The day with the most downloads was{" "}
                        <strong>
                          {format(
                            new Date(peakYearlyDayDownloads.day),
                            "MMM dd, yyyy",
                          )}
                        </strong>{" "}
                        with{" "}
                        <strong>
                          {nrFormatter.format(peakYearlyDayDownloads.downloads)}
                        </strong>{" "}
                        downloads.
                      </>
                    ) : null}
                  </p>
                )}
              </ClientOnly>
              <p>
                The following line graph shows the downloads per day. You can
                hover over the graph to see the exact number of downloads per
                day.
              </p>
            </div>
            <ClientOnly
              fallback={
                <div className="bg-gray-ui h-200 animate-pulse rounded-md" />
              }
            >
              {() => (
                <LineGraph
                  height={200}
                  data={yearlyDailyDownloads[0].downloads.map((d) => ({
                    date: d.day,
                    value: d.downloads,
                  }))}
                />
              )}
            </ClientOnly>
          </>
        ) : null}

        <DataProvidedByCRANLabel />
      </PageContentSection>
      <Separator />
    </>
  );
}

function DocumentationPageContentSection(
  props: Pick<Pkg, "in_views" | "vignettes" | "materials">,
) {
  const vignettes = props.vignettes as Record<string, string>[];
  const materials = props.materials as Record<string, string>[];
  const inviews = props.in_views as Record<string, string>[];

  const hasVignettes = vignettes && vignettes.length > 0;
  const hasMaterials = materials && materials.length > 0;
  const hasInviews = inviews && inviews.length > 0;

  const hasAny = hasVignettes || hasMaterials || hasInviews;

  if (!hasAny) {
    return null;
  }

  return (
    <>
      <PageContentSection
        headline="Documentation"
        // subline="This section contains all available documentation for this package, which includes vignettes, materials, and in views"
        fragment="documentation"
      >
        {hasAny ? (
          <ul className="grid grid-cols-2 items-start gap-4 sm:grid-cols-3 md:grid-cols-4">
            {vignettes?.map((item) => (
              <li key={item.name}>
                <ExternalLink href={item.link}>
                  <InfoCard variant="iris" icon="external">
                    <span className="flex flex-col gap-1">
                      <span className="text-gray-dim text-xs">Vignette</span>
                      <span>{item.name}</span>
                    </span>
                  </InfoCard>
                </ExternalLink>
              </li>
            ))}
            {materials?.map((item) => (
              <li key={item.name}>
                <ExternalLink href={item.link}>
                  <InfoCard variant="iris" icon="external">
                    <span className="flex flex-col gap-1">
                      <span className="text-gray-dim text-xs">Material</span>
                      <span>{item.name}</span>
                    </span>
                  </InfoCard>
                </ExternalLink>
              </li>
            ))}
            {inviews?.map((item) => (
              <li key={item.name}>
                <ExternalLink href={item.link}>
                  <InfoCard variant="iris" icon="external">
                    <span className="flex flex-col gap-1">
                      <span className="text-gray-dim text-xs">In Views</span>
                      <span>{item.name}</span>
                    </span>
                  </InfoCard>
                </ExternalLink>
              </li>
            ))}
          </ul>
        ) : null}
      </PageContentSection>
      <Separator />
    </>
  );
}

function DependenciesPageContentSection(props: Pick<LoaderData, "relations">) {
  const { relations } = props;

  const location = useLocation();

  const hasAny = Object.values(relations).some((v) => v?.length > 0);

  if (!hasAny) {
    return null;
  }

  return (
    <PageContentSection
      headline="Dependencies"
      fragment="dependencies"
      className="min-h-96"
    >
      <Suspense>
        <PackageDependencySearch
          key={location.pathname}
          relations={relations}
        />
      </Suspense>
    </PageContentSection>
  );
}
