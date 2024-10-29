import { Header } from "../modules/header";
import { Tag } from "../modules/tag";
import { AnchorLink, Anchors } from "../modules/anchors";
import { PackageService } from "../data/package.service";
import { useLoaderData } from "@remix-run/react";
import { json, LoaderFunctionArgs, useLocation } from "react-router";
import { PackageDownloadTrend, Pkg } from "../data/types";
import { Prose } from "../modules/prose";
import { Separator } from "../modules/separator";
import { PageContent } from "../modules/page-content";
import { formatRelative, minutesToSeconds } from "date-fns";
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
import { PackageInsightService } from "../data/package-insight-service.server";
import { slog } from "../modules/observability.server";
import clsx from "clsx";

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

    return [
      { title: `${item.name} | CRAN/E` },
      { name: "description", content: item.title },
      { property: "og:image", content: `${BASE_URL}/package/${item.name}/og` },
    ];
  },
  ({ data }) => {
    const { item } = data as { item: Pkg };
    const url = BASE_URL + `/${item.name}`;

    return [
      { property: "og:title", content: `${item.name} | CRAN/E` },
      { property: "og:description", content: item.title },
      { property: "og:url", content: url },
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

  let item: Pkg | undefined = undefined;
  let downloads: PackageDownloadTrend[] = [];

  try {
    const [_item, _downloads] = await Promise.all([
      PackageService.getPackage(packageId),
      PackageInsightService.getDownloadsWithTrends(packageId),
    ]);
    if (!_item) {
      throw new Response(null, {
        status: 404,
        statusText: `Package '${packageId}' not found`,
      });
    }
    item = _item;
    downloads = _downloads;
  } catch (error) {
    slog.error(error);
    throw new Response(null, {
      status: 404,
      statusText: `Package '${packageId}' not found`,
    });
  }

  return json(
    { item, downloads, lastRelease: formatRelative(item.date, new Date()) },
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
  const downloads = data.downloads as PackageDownloadTrend[];
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

        <InsightsPageContentSection downloads={downloads} />

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
          <li>
            <ExternalLinkPill
              href={item.cran_checks.link}
              icon={<RiExternalLinkLine size={18} />}
            >
              {item.cran_checks.label}
            </ExternalLinkPill>
          </li>
          <li>
            <ExternalLinkPill
              href={item.reference_manual.link}
              icon={<RiFilePdf2Line size={18} />}
            >
              {item.reference_manual.label}
            </ExternalLinkPill>
          </li>
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
              className="animate-fade animate-duration-200"
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
  downloads: PackageDownloadTrend[];
}) {
  const { downloads } = props;

  const hasDownloads = downloads && downloads.length > 0;

  return (
    <PageContentSection
      headline="Insights"
      // subline="Get the latest insights on this package"
      fragment="insights"
    >
      <h3 className="text-lg">Downloads for...</h3>

      {hasDownloads ? (
        <ul
          className={clsx(
            "relative mb-3 flex items-end justify-center gap-4 sm:mx-8 md:mx-16",
            "after:absolute after:inset-x-0 after:bottom-0 after:z-0 after:h-1 after:rounded-full after:content-['']",
            "after:bg-gradient-to-l after:from-sand-6 after:from-90% after:dark:from-sand-10",
            // "after:bg-sand-4 after:dark:bg-sand-10",
          )}
        >
          {downloads.map((item) => (
            <li
              key={item.label}
              className={clsx(
                "relative flex flex-1 flex-col items-center gap-1 pb-6 text-center",
                "after:absolute after:bottom-0 after:left-1/2 after:h-4 after:w-1 after:-translate-x-1/2 after:rounded-t-full after:bg-sand-6 after:content-[''] after:dark:bg-sand-10",
              )}
            >
              <span className="text-gray-dim text-xs">{item.label}</span>
              <span className="font-semibold">{item.value}</span>
              <span
                className={clsx(
                  "absolute bottom-0 translate-y-full pt-3 font-mono text-sm font-semibold",
                  {
                    "text-green-10 dark:text-green-8":
                      item.trend.startsWith("+"),
                    "text-red-10 dark:text-red-8": item.trend.startsWith("-"),
                    "text-gray-dim":
                      !item.trend.startsWith("+") &&
                      !item.trend.startsWith("-"),
                  },
                )}
              >
                {item.trend}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-dim">No downloads available</p>
      )}

      <p className="text-gray-dim mt-16 text-right text-xs">
        Data provided by{" "}
        <ExternalLink
          href="https://github.com/r-hub/cranlogs.app"
          className="inline-flex items-center gap-1 underline underline-offset-4"
        >
          cranlogs
          <RiExternalLinkLine size={10} className="text-gray-dim" />
        </ExternalLink>
      </p>
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
