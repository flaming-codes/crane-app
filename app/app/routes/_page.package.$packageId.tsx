import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { Header } from "../modules/header";
import { Tag } from "../modules/tag";
import { AnchorLink, Anchors } from "../modules/anchors";
import { PackageService } from "../data/package.service";
import { useLoaderData } from "@remix-run/react";
import { json } from "react-router";
import { Pkg } from "../data/types";
import { Prose } from "../modules/prose";
import { Separator } from "../modules/separator";
import { PageContent } from "../modules/page-content";
import { formatRelative } from "date-fns";
import { ExternalLink } from "../modules/external-link";
import {
  RiBug2Line,
  RiDownloadLine,
  RiExternalLinkLine,
  RiFilePdf2Line,
  RiGithubLine,
} from "@remixicon/react";
import clsx from "clsx";
import { InfoPillListItem } from "../modules/info-pill-list-item";
import { CopyPillButton } from "../modules/copy-pill-button";
import { ExternalLinkPill } from "../modules/external-link-pill";
import { PageContentSection } from "../modules/page-content-section";
import { BinaryDownloadListItem } from "../modules/binary-download-link";

export const meta: MetaFunction = () => {
  return [
    { title: "CRAN/E" },
    { name: "description", content: "<Package> to CRAN/E" },
  ];
};

export const loader: LoaderFunction = async ({ params }) => {
  const { packageId } = params;

  if (!packageId) {
    throw new Response(null, {
      status: 404,
      statusText: `Package '${packageId}' not found`,
    });
  }

  const item = await PackageService.getPackage(packageId);
  if (!item) {
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

  const rVersion = item.depends?.find((d) => d.name === "R")?.version;

  return (
    <>
      <Header
        gradient="iris"
        headline={item.name}
        subline={item.title}
        ornament={<Tag>CRAN Package</Tag>}
      />

      <Anchors>
        {[
          "Synopsis",
          "Downloads",
          "Team",
          "Documentation",
          "Binaries",
          "Dependencies",
        ].map((item) => (
          <AnchorLink key={item} fragment={item.toLowerCase()}>
            {item}
          </AnchorLink>
        ))}
      </Anchors>

      <PageContent>
        <PageContentSection>
          <div className="space-y-6">
            <Prose html={item.description} />
            <p hidden className="text-gray-dim ">
              Current version is <span>{item.version}</span> since{" "}
              <span>{formatRelative(item.date, new Date())}</span> and requires
              R <span>{rVersion || "unknown"}</span> to run.
              {item.license && item.license.length > 0 ? (
                <>
                  {" "}
                  Licensed under{" "}
                  <span>{item.license.map((l) => l.name).join(", ")}</span>.
                </>
              ) : null}{" "}
              {item.name}{" "}
              {item.needscompilation === "no" ? "doesn't need" : "needs"} to be
              compiled.
            </p>
          </div>

          <div className="flex flex-col gap-6">
            <ul className="flex flex-wrap gap-2">
              <li>
                <CopyPillButton>install.packages('{item.name}')</CopyPillButton>
              </li>
              {item.link
                ? item.link.links.map((url) => (
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
                  href={item.cran_checks.label}
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
            <ul className="flex flex-wrap gap-2 items-start">
              <InfoPillListItem label="Version">
                {item.version}
              </InfoPillListItem>
              <InfoPillListItem label="Last release">
                {formatRelative(item.date, new Date())}
              </InfoPillListItem>
              <InfoPillListItem label="R version">
                {rVersion || "unknown"}
              </InfoPillListItem>
              {item.license && item.license.length > 0
                ? item.license.map((license) => (
                    <ExternalLink key={license.link} href={license.link}>
                      <InfoPillListItem label="License">
                        {license.name}
                        <RiExternalLinkLine
                          size={12}
                          className="text-gray-dim"
                        />
                      </InfoPillListItem>
                    </ExternalLink>
                  ))
                : null}
              <InfoPillListItem label="Needs compilation?">
                {item.needscompilation === "no" ? "No" : "Yes"}
              </InfoPillListItem>
              <InfoPillListItem label="Language">
                {item.language}
              </InfoPillListItem>
            </ul>
          </div>
        </PageContentSection>

        <Separator />

        <PageContentSection headline="Binaries" fragment="binaries">
          <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {item.macos_binaries?.map((item) => (
              <BinaryDownloadListItem
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
            {item.windows_binaries?.map((item) => (
              <BinaryDownloadListItem
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
            {item.old_sources ? (
              <BinaryDownloadListItem
                variant="iris"
                href={item.old_sources.link}
                os="Old Source"
                headline={item.old_sources.label}
              />
            ) : null}
          </ul>
        </PageContentSection>
      </PageContent>
    </>
  );
}
