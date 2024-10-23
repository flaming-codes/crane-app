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

const mock = {
  url: "https://cran.r-project.org/web/packages/GaussSuppression/index.html",
  name: "GaussSuppression",
  slug: "GaussSuppression",
  title: "Tabular Data Suppression using Gaussian Elimination",
  description:
    "A statistical disclosure control tool to protect tables by suppression using the Gaussian elimination secondary suppression algorithm. A suggestion is to start by working with functions SuppressSmallCounts() and SuppressDominantCells(). These functions use primary suppression functions for the minimum frequency rule and the dominance rule, respectively. Novel functionality for suppression of disclosive cells is also included. General primary suppression functions can be supplied as input to the general working horse function, GaussSuppressionFromData(). Suppressed frequencies can be replaced by synthetic decimal numbers as described in Langsrud (2019) <doi:10.1007/s11222-018-9848-9>.",
  version: "0.8.5",
  date: "2024-05-22",
  maintainer: { name: "Øyvind Langsrud", email: "oyl@ssb.no" },
  bugreports: "https://github.com/statisticsnorway/ssb-gausssuppression/issues",
  needscompilation: "no",
  cran_checks: {
    label: "GaussSuppression results",
    link: "https://cran.r-project.org/web/checks/check_results_GaussSuppression.html",
  },
  link: {
    text: "https://github.com/statisticsnorway/ssb-gausssuppression",
    links: ["https://github.com/statisticsnorway/ssb-gausssuppression"],
  },
  depends: [
    {
      name: "Matrix",
      link: "https://cran.r-project.org/web/packages/Matrix/index.html",
    },
  ],
  imports: [
    {
      name: "SSBtools",
      link: "https://cran.r-project.org/web/packages/SSBtools/index.html",
      version: "≥ 1.5.2",
    },
    {
      name: "RegSDC",
      link: "https://cran.r-project.org/web/packages/RegSDC/index.html",
      version: "≥ 0.7.0",
    },
    { name: "stats", link: "" },
    { name: "methods", link: "" },
    { name: "utils", link: "" },
  ],
  suggests: [
    {
      name: "formattable",
      link: "https://cran.r-project.org/web/packages/formattable/index.html",
    },
    {
      name: "kableExtra",
      link: "https://cran.r-project.org/web/packages/kableExtra/index.html",
    },
    {
      name: "knitr",
      link: "https://cran.r-project.org/web/packages/knitr/index.html",
    },
    {
      name: "rmarkdown",
      link: "https://cran.r-project.org/web/packages/rmarkdown/index.html",
    },
    {
      name: "testthat",
      link: "https://cran.r-project.org/web/packages/testthat/index.html",
      version: "≥3.0.0",
    },
    {
      name: "lpSolve",
      link: "https://cran.r-project.org/web/packages/lpSolve/index.html",
    },
    {
      name: "Rsymphony",
      link: "https://cran.r-project.org/web/packages/Rsymphony/index.html",
    },
    {
      name: "Rglpk",
      link: "https://cran.r-project.org/web/packages/Rglpk/index.html",
    },
    {
      name: "slam",
      link: "https://cran.r-project.org/web/packages/slam/index.html",
    },
    {
      name: "highs",
      link: "https://cran.r-project.org/web/packages/highs/index.html",
    },
  ],
  inviews: [
    {
      name: "OfficialStatistics",
      link: "https://cran.r-project.org/web/views/OfficialStatistics.html",
    },
  ],
  materials: [
    {
      name: "NEWS",
      link: "https://cran.r-project.org/web/packages/GaussSuppression/news/news.html",
    },
  ],
  author: [
    { name: "Øyvind Langsrud", roles: ["aut", "cre"] },
    { name: "Daniel Lupp", roles: ["aut"] },
    { name: "Hege Bøvelstad", roles: ["ctb"] },
    { name: "Vidar Norstein Klungre", roles: ["rev"] },
    { name: "Statistics Norway", roles: ["cph"] },
  ],
  license: [
    { name: "MIT", link: "https://cran.r-project.org/web/licenses/MIT" },
    {
      name: "file LICENSE",
      link: "https://cran.r-project.org/web/packages/GaussSuppression/LICENSE",
    },
  ],
  reference_manual: {
    label: "GaussSuppression.pdf",
    link: "https://cran.r-project.org/web/packages/GaussSuppression/GaussSuppression.pdf",
  },
  vignettes: [
    {
      name: "Magnitude table suppression",
      link: "https://cran.r-project.org/web/packages/GaussSuppression/vignettes/Magnitude_table_suppression.html",
    },
    {
      name: "Small count frequency table suppression",
      link: "https://cran.r-project.org/web/packages/GaussSuppression/vignettes/Small_count_frequency_table_suppression.html",
    },
    {
      name: "Defining tables for GaussSuppression",
      link: "https://cran.r-project.org/web/packages/GaussSuppression/vignettes/define_tables.html",
    },
  ],
  package_source: {
    label: "GaussSuppression_0.8.5.tar.gz",
    link: "https://cran.r-project.org//src/contrib/GaussSuppression_0.8.5.tar.gz",
  },
  windows_binaries: [
    {
      label: "r-devel:",
      link: "https://cran.r-project.org//bin/windows/contrib/4.5/GaussSuppression_0.8.3.zip",
    },
    {
      label: "r-release:",
      link: "https://cran.r-project.org//bin/windows/contrib/4.4/GaussSuppression_0.8.3.zip",
    },
    {
      label: "r-oldrel:",
      link: "https://cran.r-project.org//bin/windows/contrib/4.3/GaussSuppression_0.8.3.zip",
    },
  ],
  macos_binaries: [
    {
      label: "r-release (arm64):",
      link: "https://cran.r-project.org//bin/macosx/big-sur-arm64/contrib/4.4/GaussSuppression_0.8.3.tgz",
    },
    {
      label: "r-oldrel (arm64):",
      link: "https://cran.r-project.org//bin/macosx/big-sur-arm64/contrib/4.3/GaussSuppression_0.8.3.tgz",
    },
    {
      label: "r-release (x86_64):",
      link: "https://cran.r-project.org//bin/macosx/big-sur-x86_64/contrib/4.4/GaussSuppression_0.8.3.tgz",
    },
    {
      label: "r-oldrel (x86_64):",
      link: "https://cran.r-project.org//bin/macosx/big-sur-x86_64/contrib/4.3/GaussSuppression_0.8.3.tgz",
    },
  ],
  old_sources: {
    label: "GaussSuppression archive",
    link: "https://CRAN.R-project.org/src/contrib/Archive/GaussSuppression",
  },
  last_scraped: "2024-05-22 09:03:24",
};

export const loader: LoaderFunction = async ({ params }) => {
  const { packageId } = params;
  return json({ item: mock });

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
