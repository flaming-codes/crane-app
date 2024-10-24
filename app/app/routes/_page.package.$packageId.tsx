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
      </PageContent>
    </>
  );
}
