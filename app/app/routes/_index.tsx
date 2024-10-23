import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: "CRAN/E" },
    { name: "description", content: "Welcome to CRAN/E" },
  ];
};

export const loader: LoaderFunction = async () => {
  return { props: {} };
};

export default function Index() {
  return (
    <>
      <nav className="border-b border-gray-12 h-14 flex items-center sticky top-0 backdrop-blur-lg full-width">
        <span>Search</span>
      </nav>

      <div className="full-width bg-gradient-to-tr from-iris-10  text-gray-1 py-4 min-h-48">
        <div className="flex flex-col md:flex-row gap-2 items-center justify-between">
          <div className=" flex flex-col justify-center gap-1">
            <h1 className="text-4xl font-light">GaussSuppression</h1>
            <p className="text-xl">
              Tabular Data Suppression using Gaussian Elimination
            </p>
          </div>
          <span className="text-[0.5rem] font-semibold mb-1 uppercase border border-gray-3 rounded-full px-2 py-1 shrink-0 max-w-min whitespace-nowrap">
            CRAN PACKAGE
          </span>
        </div>
      </div>

      <nav className=" full-width overflow-x-auto divide-x divide-gray-12 border-y border-gray-12 text-xs sticky top-14 backdrop-blur-lg">
        <div className="flex gap-1">
          {[
            "Synopsis",
            "Statistics",
            "Team",
            "Documentation",
            "Downloads",
            "Dependencies",
          ].map((item) => (
            <Link
              key={item}
              to={`#${item.toLowerCase()}`}
              className="min-w-24 text-center py-3 shrink-0 flex-1 border-b border-transparent hover:border-gray-8 transition-colors"
            >
              {item}
            </Link>
          ))}
        </div>
      </nav>

      <div className="full-width pt-16">
        <div className="flex flex-col gap-16">
          <section className="border-b border-gray-11 pb-8">
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
