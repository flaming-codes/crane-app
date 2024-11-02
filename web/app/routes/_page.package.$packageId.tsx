import { Header } from "../modules/header";
import { Tag } from "../modules/tag";
import { AnchorLink, Anchors } from "../modules/anchors";
import { PackageService } from "../data/package.service";
import { useLoaderData } from "@remix-run/react";
import { json, LoaderFunctionArgs, useLocation } from "react-router";
import { Pkg } from "../data/types";
import { Prose } from "../modules/prose";
import { Separator } from "../modules/separator";
import { PageContent } from "../modules/page-content";
import { format, formatRelative, minutesToSeconds, subDays } from "date-fns";
import { ExternalLink } from "../modules/external-link";
import {
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
import { StackedBarsChart } from "../modules/charts.stacked-bars";

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
    const { item } = data as { item: Pkg };
    const url = BASE_URL + `/package/${encodeURIComponent(item.name)}`;

    return [
      { title: `${item.name} | CRAN/E` },
      { name: "description", content: item.title },
      { property: "og:title", content: `${item.name} | CRAN/E` },
      { property: "og:description", content: item.title },
      { property: "og:url", content: url },
      { property: "og:image", content: `${url}/og` },
    ];
  },
  ({ data }) => {
    const { item } = data as { item: Pkg };

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
            a: item.title,
          },
          {
            q: `Who maintains ${item.name}?`,
            a: item.maintainer?.name || "Unknown",
          },
          {
            q: `Who authored ${item.name}?`,
            a: item.author?.map((a) => a.name).join(", ") || "Unknown",
          },
          {
            q: `What is the current version of ${item.name}?`,
            a: `The current version of the R-package '${item.version}' is ${item.version}`,
          },
          {
            q: `When was the last release of ${item.name}?`,
            a: `The last release of the R-package '${item.version}' was ${formatRelative(
              item.date,
              new Date(),
            )}`,
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

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const { packageId } = params;

  if (!packageId) {
    throw new Response(null, {
      status: 404,
      statusText: `No package ID provided`,
    });
  }

  const now = new Date();

  let item: Pkg | undefined = undefined;
  let dailyDownloads: CranDownloadsResponse | undefined = undefined;
  let yearlyDailyDownloads: CranDownloadsResponse | undefined = undefined;

  try {
    const [_item, _dailyDownloads, _yearlyDailyDownloads] = await Promise.all([
      PackageService.getPackage(packageId),
      PackageInsightService.getDailyDownloadsForPackage(
        packageId,
        "last-month",
      ),
      PackageInsightService.getDailyDownloadsForPackage(
        packageId,
        `${format(subDays(now, 365), "yyyy-MM-dd")}:${format(now, "yyyy-MM-dd")}`,
      ),
    ]);
    if (!_item) {
      throw new Response(null, {
        status: 404,
        statusText: `Package '${packageId}' not found`,
      });
    }
    item = _item;
    dailyDownloads = _dailyDownloads;
    yearlyDailyDownloads = _yearlyDailyDownloads;
  } catch (error) {
    slog.error(error);
    throw new Response(null, {
      status: 404,
      statusText: `Package '${packageId}' not found`,
    });
  }

  return json(
    {
      item,
      dailyDownloads,
      yearlyDailyDownloads,
      lastRelease: formatRelative(item.date, new Date()),
    },
    {
      headers: {
        "Cache-Control": `public, max-age=${minutesToSeconds(10)}`,
      },
    },
  );
};

export default function PackagePage() {
  const data = useLoaderData<typeof loader>();
  const item = data.item as Pkg;
  const dailyDownloads = data.dailyDownloads as CranDownloadsResponse;
  const yearlyDailyDownloads =
    data.yearlyDailyDownloads as CranDownloadsResponse;
  const lastRelease = data.lastRelease as string;

  return (
    <>
      <Header
        gradient="iris"
        headline={item.name}
        subline={item.title}
        ornament={<Tag>CRAN Package</Tag>}
      />

      <Anchors>
        {sections.map((item) => (
          <AnchorLink key={item} fragment={item.toLowerCase()}>
            {item}
          </AnchorLink>
        ))}
      </Anchors>

      <PageContent>
        <AboveTheFoldSection item={item} lastRelease={lastRelease} />

        <Separator />

        <DocumentationPageContentSection
          vignettes={item.vignettes}
          materials={item.materials}
          inviews={item.inviews}
        />

        <TeamPageContentSection
          maintainer={item.maintainer}
          author={item.author}
        />

        <Separator />

        <InsightsPageContentSection
          dailyDownloads={dailyDownloads}
          yearlyDailyDownloads={yearlyDailyDownloads}
        />

        <Separator />

        <BinariesPageContentSection
          macos_binaries={item.macos_binaries}
          windows_binaries={item.windows_binaries}
          old_sources={item.old_sources}
        />

        <Separator />

        <DependenciesPageContentSection
          depends={item.depends}
          imports={item.imports}
          enhances={item.enhances}
          suggests={item.suggests}
          linkingto={item.linkingto}
          reverse_depends={item.reverse_depends}
          reverse_imports={item.reverse_imports}
          reverse_suggests={item.reverse_suggests}
          reverse_enhances={item.reverse_enhances}
          reverse_linkingto={item.reverse_linkingto}
        />
      </PageContent>
    </>
  );
}

function AboveTheFoldSection(props: { item: Pkg; lastRelease: string }) {
  const { item, lastRelease } = props;
  const rVersion = item.depends?.find((d) => d.name === "R")?.version;

  return (
    <PageContentSection>
      <div className="space-y-6">
        <Prose html={item.description} />
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
          {item.link
            ? uniq(item.link.links).map((href, i) => (
                <li key={href + i}>
                  <ItemExternalGeneralLinkPill href={href} />
                </li>
              ))
            : null}
          {item.bugreports ? (
            <li>
              <ExternalLinkPill
                href={item.bugreports}
                icon={<RiBug2Line size={18} />}
              >
                File a bug report
              </ExternalLinkPill>
            </li>
          ) : null}
          {item.cran_checks ? (
            <li>
              <ExternalLinkPill
                href={item.cran_checks.link}
                icon={<RiExternalLinkLine size={18} />}
              >
                {item.cran_checks.label}
              </ExternalLinkPill>
            </li>
          ) : null}
          {item.reference_manual ? (
            <li>
              <ExternalLinkPill
                href={item.reference_manual.link}
                icon={<RiFilePdf2Line size={18} />}
              >
                {item.reference_manual.label}
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
          {item.license && item.license.length > 0
            ? item.license.map((license) => (
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
              {item.needscompilation === "no" ? "No" : "Yes"}
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
          item.citation.link &&
          Array.isArray(item.citation.link) &&
          item.citation.link.length > 0
            ? item.citation.link.map((href) => (
                <li key={href}>
                  <ExternalLinkPill href={href}>
                    {item.citation?.label || href}
                  </ExternalLinkPill>
                </li>
              ))
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
        {macos_binaries?.map((item, i) => (
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
        )) || null}
        {windows_binaries?.map((item, i) => (
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
        )) || null}
        {old_sources ? (
          <li key={old_sources.link}>
            <BinaryDownloadLink
              variant="iris"
              href={old_sources.link}
              os="Old Source"
              headline={old_sources.label}
            />
          </li>
        ) : null}
      </ul>
    </PageContentSection>
  );
}

function TeamPageContentSection(props: Pick<Pkg, "maintainer" | "author">) {
  const { maintainer, author } = props;

  const otherAuthors = author?.filter((a) => a.name !== maintainer?.name);
  const maintainerRoles = author?.find(
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
              link={maintainer.email}
            />
          </li>
        ) : null}
        {hasOtherAuthors
          ? otherAuthors?.map((author) => (
              <li key={author.name}>
                <ContactPill
                  name={author.name}
                  roles={author.roles || []}
                  link={author.link}
                />
              </li>
            ))
          : null}
      </ul>
    </PageContentSection>
  );
}

function InsightsPageContentSection(props: {
  dailyDownloads: CranDownloadsResponse;
  yearlyDailyDownloads: CranDownloadsResponse;
}) {
  const { dailyDownloads, yearlyDailyDownloads } = props;
  const totalMonth = dailyDownloads[0].downloads.reduce(
    (acc, curr) => acc + curr.downloads,
    0,
  );
  const yesterday = dailyDownloads[0]?.downloads.at(-1);

  const maxYearly = [...(yearlyDailyDownloads[0]?.downloads || [])].sort(
    (a, b) => b.downloads - a.downloads,
  )[0] || { day: "", downloads: 0 };
  const peakYearlyDay = yearlyDailyDownloads[0].downloads.find(
    (d) => d.downloads === maxYearly.downloads,
  );

  const groupedByMonth = yearlyDailyDownloads[0].downloads.reduce(
    (acc, curr) => {
      const month = format(new Date(curr.day), "MMM");
      if (!acc[month]) {
        acc[month] = 0;
      }
      acc[month] += curr.downloads;
      return acc;
    },
    {} as Record<string, number>,
  );
  const totalYear = Object.values(groupedByMonth).reduce(
    (acc, curr) => acc + curr,
    0,
  );

  const nrFormatter = new Intl.NumberFormat("en-US");

  return (
    <PageContentSection headline="Insights" fragment="insights">
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
              <strong>{nrFormatter.format(totalMonth)}</strong> times in the
              last 30 days. The following heatmap shows the distribution of
              downloads per day.
              {yesterday ? (
                <>
                  {" "}
                  Yesterday, it was downloaded{" "}
                  <strong>
                    {nrFormatter.format(yesterday.downloads)}
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
        <h3 className="text-lg font-semibold">Last 365 days</h3>
        <ClientOnly
          fallback={
            <div className="bg-gray-ui h-64 animate-pulse rounded-md" />
          }
        >
          {() => (
            <p>
              This package has been downloaded{" "}
              <strong>
                {nrFormatter.format(
                  yearlyDailyDownloads[0].downloads.reduce(
                    (acc, curr) => acc + curr.downloads,
                    0,
                  ),
                )}
              </strong>{" "}
              times in the last 365 days. The following line graph shows the
              downloads per day. You can hover over the graph to see the exact
              number of downloads per day.
            </p>
          )}
        </ClientOnly>
        {peakYearlyDay ? (
          <p>
            The day with the most downloads was{" "}
            <strong>
              {format(new Date(peakYearlyDay.day), "MMM dd, yyyy")}
            </strong>{" "}
            with <strong>{nrFormatter.format(peakYearlyDay.downloads)}</strong>{" "}
            downloads.
          </p>
        ) : null}
      </div>
      <ClientOnly
        fallback={<div className="h-200 bg-gray-ui animate-pulse rounded-md" />}
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
      <ClientOnly
        fallback={<div className="h-200 bg-gray-ui animate-pulse rounded-md" />}
      >
        {() => (
          <StackedBarsChart
            total={totalYear}
            data={Object.entries(groupedByMonth).map(([month, count]) => ({
              label: month,
              value: count,
            }))}
          />
        )}
      </ClientOnly>

      <DataProvidedByCRANLabel />
    </PageContentSection>
  );
}

function DocumentationPageContentSection(
  props: Pick<Pkg, "vignettes" | "materials" | "inviews">,
) {
  const { vignettes, materials, inviews } = props;

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

function DependenciesPageContentSection(
  props: Pick<
    Pkg,
    | "depends"
    | "imports"
    | "enhances"
    | "suggests"
    | "linkingto"
    | "reverse_depends"
    | "reverse_imports"
    | "reverse_suggests"
    | "reverse_enhances"
    | "reverse_linkingto"
  >,
) {
  const {
    depends,
    imports,
    enhances,
    suggests,
    linkingto,
    reverse_depends,
    reverse_imports,
    reverse_suggests,
    reverse_enhances,
    reverse_linkingto,
  } = props;

  const location = useLocation();

  const hasAny =
    depends?.length ||
    imports?.length ||
    enhances?.length ||
    suggests?.length ||
    linkingto?.length ||
    reverse_depends?.length ||
    reverse_imports?.length ||
    reverse_suggests?.length ||
    reverse_enhances?.length ||
    reverse_linkingto?.length;

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
        <PackageDependencySearch key={location.pathname} {...props} />
      </Suspense>
    </PageContentSection>
  );
}
