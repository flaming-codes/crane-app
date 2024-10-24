import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { Header } from "../modules/header";
import { Tag } from "../modules/tag";
import { AnchorLink, Anchors } from "../modules/anchors";
import { PackageService } from "../data/package.service";
import { useLoaderData } from "@remix-run/react";
import { json } from "react-router";
import { Pkg } from "../data/types";
import { Prose } from "../modules/prose";
import { Separator } from "../modules/seperator";
import { PageContent } from "../modules/page-content";
import { formatRelative } from "date-fns";
import { DataPointListItem } from "../modules/data-point-list-item";
import { ExternalLink } from "../modules/external-link";
import {
  RiArrowRightSLine,
  RiBug2Line,
  RiExternalLinkLine,
  RiGithubLine,
} from "@remixicon/react";

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
          "Statistics",
          "Team",
          "Documentation",
          "Downloads",
          "Dependencies",
        ].map((item) => (
          <AnchorLink key={item} fragment={item.toLowerCase()}>
            {item}
          </AnchorLink>
        ))}
      </Anchors>

      <PageContent>
        <section className="space-y-6">
          <Prose html={item.description} />
          <p hidden className="text-gray-dim ">
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
            {item.name} {item.needscompilation ? "needs" : "does not need"} to
            be compiled.
          </p>
        </section>

        <div className="flex flex-col gap-6">
          <ul className="flex flex-wrap gap-2">
            {item.link
              ? item.link.links.map((url) => (
                  <li key={url}>
                    <ExternalLink
                      href={url}
                      className="flex items-center gap-2 px-4 py-2 text-sm rounded-full border-gray-dim bg-gray-ui"
                    >
                      <RiGithubLine size={18} />{" "}
                      {item.link?.text.includes("github.com")
                        ? "GitHub"
                        : item.link?.text}
                    </ExternalLink>
                  </li>
                ))
              : null}
            {item.bugreports ? (
              <li>
                <ExternalLink
                  href={item.bugreports}
                  className="flex items-center gap-2 px-4 py-2 text-sm rounded-full border-gray-dim bg-gray-ui"
                >
                  <RiBug2Line size={18} /> File a bug report
                </ExternalLink>
              </li>
            ) : null}
            <li>
              <ExternalLink
                href={item.cran_checks.link}
                className="flex items-center gap-2 px-4 py-2 text-sm rounded-full border-gray-dim bg-gray-ui"
              >
                <RiExternalLinkLine size={18} /> {item.cran_checks.label}
              </ExternalLink>
            </li>
          </ul>
          <ul className="flex flex-wrap gap-2">
            <li className="rounded-full border border-gray-dim px-4 py-2 inline-flex gap-2 items-center">
              <span className="text-sm text-gray-dim">Version</span>
              <span>{item.version}</span>
            </li>
            <li className="rounded-full border border-gray-dim px-4 py-2 inline-flex gap-2 items-center">
              <span className="text-sm text-gray-dim">Last release</span>
              <span>{formatRelative(item.date, new Date())}</span>
            </li>
            <li className="rounded-full border border-gray-dim px-4 py-2 inline-flex gap-2 items-center">
              <span className="text-sm text-gray-dim">R version</span>
              <span>{rVersion || "unknown"}</span>
            </li>
            {item.license && item.license.length > 0
              ? item.license.map((license) => (
                  <ExternalLink key={license.link} href={license.link}>
                    <li className="rounded-full border border-gray-dim px-4 py-2 inline-flex gap-2 items-center">
                      <span className="text-sm text-gray-dim">License</span>
                      <span>{license.name}</span>
                      <RiExternalLinkLine size={12} className="text-gray-dim" />
                    </li>
                  </ExternalLink>
                ))
              : null}
            <li className="rounded-full border border-gray-dim px-4 py-2 inline-flex gap-2 items-center">
              <span className="text-sm text-gray-dim">Needs compilation?</span>
              <span>{item.needscompilation ? "Yes" : "No"}</span>
            </li>
            <li className="rounded-full border border-gray-dim px-4 py-2 inline-flex gap-2 items-center">
              <span className="text-sm text-gray-dim">Language</span>
              <span>{item.language}</span>
            </li>
          </ul>
        </div>

        {false && (
          <ul className="grid grid-cols-2 sm:grid-cols-3 -my-8 lg:grid-cols-4 text-center place-content-start gap-x-4 gap-y-8">
            <DataPointListItem label="Version">
              {item.version}
            </DataPointListItem>
            <DataPointListItem label="Last Release">
              {formatRelative(item.date, new Date())}
            </DataPointListItem>
            {rVersion ? (
              <DataPointListItem label="R Version">
                {rVersion}
              </DataPointListItem>
            ) : null}
            <DataPointListItem label="Compilation?">
              {item.needscompilation ? "Yes" : "No"}
            </DataPointListItem>
            {item.license && item.license.length > 0
              ? item.license.map((license) => (
                  <DataPointListItem key={license.name} label="License">
                    {license.name}
                  </DataPointListItem>
                ))
              : null}
            {item.language ? (
              <DataPointListItem label="Language">
                {item.language}
              </DataPointListItem>
            ) : null}
          </ul>
        )}

        <Separator />
      </PageContent>
    </>
  );
}
