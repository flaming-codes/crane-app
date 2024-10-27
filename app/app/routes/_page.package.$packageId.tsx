import type { LoaderFunction } from "@remix-run/node";
import { Header } from "../modules/header";
import { Tag } from "../modules/tag";
import { AnchorLink, Anchors } from "../modules/anchors";
import { PackageService } from "../data/package.service";
import { useLoaderData } from "@remix-run/react";
import { json, useLocation } from "react-router";
import { Pkg } from "../data/types";
import { Prose } from "../modules/prose";
import { Separator } from "../modules/separator";
import { PageContent } from "../modules/page-content";
import { formatRelative } from "date-fns";
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
import { BinaryDownloadListItem } from "../modules/binary-download-link";
import { ContactPill } from "../modules/contact-pill";
import { InfoCard } from "../modules/info-card";
import { lazy, Suspense } from "react";
import { ClientOnly } from "remix-utils/client-only";
import { sendEvent } from "../modules/plausible";
import {
  composeBreadcrumbsJsonLd,
  composeFAQJsonLd,
  mergeMeta,
} from "../modules/meta";
import { BASE_URL } from "../modules/app";
import { uniq } from "es-toolkit";

const PackageDependencySearch = lazy(() =>
  import("../modules/package-dependency-search").then((mod) => ({
    default: mod.PackageDependencySearch,
  })),
);

const sections = [
  "Synopsis",
  "Documentation",
  "Team",
  "Binaries",
  "Dependencies",
] as const;

export const meta = mergeMeta(
  ({ data }) => {
    const { item } = data as { item: Pkg };
    const url = BASE_URL + `/${item.name}`;

    return [
      { title: `${item.name} | CRAN/E` },
      { name: "description", content: item.title },
      { property: "og:title", content: `${item.name} | CRAN/E` },
      { property: "og:description", content: item.title },
      { property: "og:url", content: url },
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

export const loader: LoaderFunction = async ({ params }) => {
  const { packageId } = params;

  if (!packageId) {
    throw new Response(null, {
      status: 404,
      statusText: `No package ID provided`,
    });
  }

  let item: Pkg | undefined = undefined;

  try {
    item = await PackageService.getPackage(packageId);
    if (!item) {
      throw new Error(`Package '${packageId}' not found`);
    }
  } catch (error) {
    console.error(error);
    throw new Response(null, {
      status: 404,
      statusText: `Package '${packageId}' not found`,
    });
  }

  return json({ item });
};

export default function PackagePage() {
  const data = useLoaderData<typeof loader>();
  const item = data.item as Pkg;

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
        <AboveTheFoldSection item={item} />

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

function AboveTheFoldSection(props: { item: Pkg }) {
  const { item } = props;
  const rVersion = item.depends?.find((d) => d.name === "R")?.version;

  return (
    <PageContentSection>
      <div className="space-y-6">
        <Prose html={item.description} />
        <p hidden className="text-gray-dim">
          Current version is <span>{item.version}</span> since{" "}
          <span>{formatRelative(item.date, new Date())}</span> and requires R{" "}
          <span>{rVersion || "unknown"}</span> to run.
          {item.license && item.license.length > 0 ? (
            <>
              {" "}
              Licensed under{" "}
              <span>{item.license.map((l) => l.name).join(", ")}</span>.
            </>
          ) : null}{" "}
          {item.name}{" "}
          {item.needscompilation === "no" ? "doesn&apos;t need" : "needs"} to be
          compiled.
        </p>
      </div>

      <div className="flex flex-col gap-6 overflow-x-hidden">
        <ul className="flex flex-wrap items-start gap-2">
          <li>
            <CopyPillButton
              textToCopy={`install.packages('${item.name}')`}
              onSuccess={() => {
                sendEvent("copy-to-clipboard", { props: { value: item.name } });
              }}
            >
              install.packages('{item.name}')
            </CopyPillButton>
          </li>
          {item.link
            ? uniq(item.link.links).map((url) => (
                <li key={url}>
                  <ExternalLinkPill
                    href={url}
                    icon={<RiGithubLine size={18} />}
                  >
                    {item.link?.text.includes("github.com")
                      ? "GitHub"
                      : item.link?.text}
                  </ExternalLinkPill>
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
        <ul className="flex flex-wrap items-start gap-2">
          <li>
            <InfoPill label="Version">{item.version}</InfoPill>
          </li>
          <ClientOnly>
            {() => (
              <li>
                <InfoPill label="Last release">
                  {formatRelative(item.date, new Date())}
                </InfoPill>
              </li>
            )}
          </ClientOnly>
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
        </ul>
      </div>
    </PageContentSection>
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
        {macos_binaries?.map((item) => (
          <BinaryDownloadListItem
            key={item.link}
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
        )) || null}
        {windows_binaries?.map((item) => (
          <BinaryDownloadListItem
            key={item.link}
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
        )) || null}
        {old_sources ? (
          <BinaryDownloadListItem
            key={old_sources.link}
            variant="iris"
            href={old_sources.link}
            os="Old Source"
            headline={old_sources.label}
          />
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
