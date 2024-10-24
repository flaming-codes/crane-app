import { http, HttpResponse } from "msw";
import { ENV } from "../data/env";

export const handlers = [
  http.get(
    `${ENV.VITE_SELECT_PKG_URL.replace("{{id}}", "GaussSuppression")}`,
    () => {
      return HttpResponse.json({
        url: "https://cran.r-project.org/web/packages/GaussSuppression/index.html",
        name: "GaussSuppression",
        slug: "GaussSuppression",
        title: "Tabular Data Suppression using Gaussian Elimination",
        description:
          "A statistical disclosure control tool to protect tables by suppression using the Gaussian elimination secondary suppression algorithm. A suggestion is to start by working with functions SuppressSmallCounts() and SuppressDominantCells(). These functions use primary suppression functions for the minimum frequency rule and the dominance rule, respectively. Novel functionality for suppression of disclosive cells is also included. General primary suppression functions can be supplied as input to the general working horse function, GaussSuppressionFromData(). Suppressed frequencies can be replaced by synthetic decimal numbers as described in Langsrud (2019) <doi:10.1007/s11222-018-9848-9>.",
        version: "0.8.5",
        date: "2024-05-22",
        maintainer: { name: "Øyvind Langsrud", email: "oyl@ssb.no" },
        bugreports:
          "https://github.com/statisticsnorway/ssb-gausssuppression/issues",
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
      });
    },
  ),
  http.get(ENV.VITE_SELECT_PKG_URL.replace("{{id}}", "xadmix"), () => {
    return HttpResponse.json({
      url: "https://cran.r-project.org/web/packages/xadmix/index.html",
      name: "xadmix",
      slug: "xadmix",
      title: "Subsetting and Plotting Optimized for Admixture Data",
      description:
        "A few functions which provide a quick way of subsetting genomic admixture data and generating customizable stacked barplots.",
      version: "1.0.0",
      date: "2022-07-08",
      maintainer: {
        name: "Lukas Schönmann",
        email: "lukas.schoenmann@outlook.com",
      },
      bugreports: "https://github.com/SpaceCowboy-71/xadmix/issues",
      needscompilation: "no",
      cran_checks: {
        label: "xadmix results",
        link: "https://cran.r-project.org/web/checks/check_results_xadmix.html",
      },
      link: {
        text: "https://github.com/SpaceCowboy-71/xadmix",
        links: ["https://github.com/SpaceCowboy-71/xadmix"],
      },
      language: "en-US",
      depends: [{ name: "R", link: "", version: "≥ 2.10" }],
      imports: [
        {
          name: "dplyr",
          link: "https://cran.r-project.org/web/packages/dplyr/index.html",
        },
        {
          name: "forcats",
          link: "https://cran.r-project.org/web/packages/forcats/index.html",
        },
        {
          name: "ggplot2",
          link: "https://cran.r-project.org/web/packages/ggplot2/index.html",
        },
        {
          name: "magrittr",
          link: "https://cran.r-project.org/web/packages/magrittr/index.html",
        },
        { name: "methods", link: "" },
        {
          name: "rlang",
          link: "https://cran.r-project.org/web/packages/rlang/index.html",
        },
        {
          name: "stringr",
          link: "https://cran.r-project.org/web/packages/stringr/index.html",
        },
        {
          name: "tidyr",
          link: "https://cran.r-project.org/web/packages/tidyr/index.html",
        },
        {
          name: "viridis",
          link: "https://cran.r-project.org/web/packages/viridis/index.html",
        },
      ],
      suggests: [
        {
          name: "knitr",
          link: "https://cran.r-project.org/web/packages/knitr/index.html",
        },
        {
          name: "rmarkdown",
          link: "https://cran.r-project.org/web/packages/rmarkdown/index.html",
        },
      ],
      materials: [
        {
          name: "NEWS",
          link: "https://cran.r-project.org/web/packages/xadmix/news/news.html",
        },
      ],
      author: [
        {
          name: "Lukas Schönmann",
          roles: ["aut", "cre"],
          link: "https://orcid.org/0000-0002-3161-4270",
        },
      ],
      license: [
        {
          name: "GPL (≥ 3)",
          link: "https://cran.r-project.org/web/licenses/GPL-3",
        },
      ],
      reference_manual: {
        label: "xadmix.pdf",
        link: "https://cran.r-project.org/web/packages/xadmix/xadmix.pdf",
      },
      vignettes: [
        {
          name: "Manual - 'xadmix'",
          link: "https://cran.r-project.org/web/packages/xadmix/vignettes/xadmix-manual.html",
        },
      ],
      package_source: {
        label: "xadmix_1.0.0.tar.gz",
        link: "https://cran.r-project.org//src/contrib/xadmix_1.0.0.tar.gz",
      },
      windows_binaries: [
        {
          label: "r-devel:",
          link: "https://cran.r-project.org//bin/windows/contrib/4.3/xadmix_1.0.0.zip",
        },
        {
          label: "r-release:",
          link: "https://cran.r-project.org//bin/windows/contrib/4.2/xadmix_1.0.0.zip",
        },
        {
          label: "r-oldrel:",
          link: "https://cran.r-project.org//bin/windows/contrib/4.1/xadmix_1.0.0.zip",
        },
      ],
      macos_binaries: [
        {
          label: "r-release (arm64):",
          link: "https://cran.r-project.org//bin/macosx/big-sur-arm64/contrib/4.2/xadmix_1.0.0.tgz",
        },
        {
          label: "r-oldrel (arm64):",
          link: "https://cran.r-project.org//bin/macosx/big-sur-arm64/contrib/4.1/xadmix_1.0.0.tgz",
        },
        {
          label: "r-release (x86_64):",
          link: "https://cran.r-project.org//bin/macosx/contrib/4.2/xadmix_1.0.0.tgz",
        },
        {
          label: "r-oldrel (x86_64):",
          link: "https://cran.r-project.org//bin/macosx/contrib/4.1/xadmix_1.0.0.tgz",
        },
      ],
      last_scraped: "2022-08-28 23:48:42",
    });
  }),
];
