import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { Header } from "../modules/header";
import { Tag } from "../modules/tag";
import { AnchorLink, Anchors } from "../modules/anchors";

export const meta: MetaFunction = () => {
  return [
    { title: "CRAN/E" },
    { name: "description", content: "<Package> to CRAN/E" },
  ];
};

export const loader: LoaderFunction = async () => {
  return { props: {} };
};

export default function PackagePage() {
  return (
    <>
      <Header
        gradient="iris"
        headline="packageRank"
        subline="Computation and Visualization of Package Download Counts and Percentiles"
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
          <AnchorLink key={item} fragment={`#${item.toLowerCase()}`}>
            {item}
          </AnchorLink>
        ))}
      </Anchors>

      <div className="full-width pt-32">
        <div className="flex flex-col gap-16">
          <section>
            <blockquote className="text-xl font-light leading-normal">
              A statistical disclosure control tool to protect tables by
              suppression using the Gaussian elimination secondary suppression
              algorithm. A suggestion is to start by working with functions
              SuppressSmallCounts() and SuppressDominantCells(). These functions
              use primary suppression functions for the minimum frequency rule
              and the dominance rule, respectively. Novel functionality for
              suppression of disclosive cells is also included. General primary
              suppression functions can be supplied as input to the general
              working horse function, GaussSuppressionFromData(). Suppressed
              frequencies can be replaced by synthetic decimal numbers as
              described in Langsrud (2019) doi:10.1007/s11222-018-9848-9.
            </blockquote>
          </section>

          <hr className="opacity-20" />

          <section>
            <blockquote className="text-xl font-light leading-normal ">
              A statistical disclosure control tool to protect tables by
              suppression using the Gaussian elimination secondary suppression
              algorithm. A suggestion is to start by working with functions
              SuppressSmallCounts() and SuppressDominantCells(). These functions
              use primary suppression functions for the minimum frequency rule
              and the dominance rule, respectively. Novel functionality for
              suppression of disclosive cells is also included. General primary
              suppression functions can be supplied as input to the general
              working horse function, GaussSuppressionFromData(). Suppressed
              frequencies can be replaced by synthetic decimal numbers as
              described in Langsrud (2019) doi:10.1007/s11222-018-9848-9.
            </blockquote>
          </section>
        </div>
      </div>
    </>
  );
}
