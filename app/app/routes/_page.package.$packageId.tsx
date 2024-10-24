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
        <section>
          <Prose html={item.description} />
        </section>

        <Separator />

        <ul className="grid grid-cols-4 gap-x-4 gap-y-16">
          <DataPointListItem label="Version">{item.version}</DataPointListItem>
          <DataPointListItem label="Last Release">
            {formatRelative(item.date, new Date())}
          </DataPointListItem>
          {rVersion ? (
            <DataPointListItem label="R Version">{rVersion}</DataPointListItem>
          ) : null}
          <DataPointListItem label="Needs compilation?">
            {item.needscompilation ? "Yes" : "No"}
          </DataPointListItem>
          {item.license && item.license.length > 0
            ? item.license.map((license) => (
                <DataPointListItem key={license.name} label="License">
                  {license.name}
                </DataPointListItem>
              ))
            : null}
          <ExternalLink href={item.cran_checks.link}>
            <DataPointListItem label="CRAN Checks">
              {item.cran_checks.label}
            </DataPointListItem>
          </ExternalLink>
          {item.language ? (
            <DataPointListItem label="Language">
              {item.language}
            </DataPointListItem>
          ) : null}
        </ul>

        <Separator />
      </PageContent>
    </>
  );
}
