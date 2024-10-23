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
      <nav className="border-b border-gray-12 h-14 flex items-center px-8 sticky top-0 backdrop-blur-lg">
        Search
      </nav>
      <section>
        <div className="bg-gradient-to-tr from-iris-10 to-teal-11 min-h-40 gap-2 flex-col md:flex-row text-gray-1 px-8 py-4 flex items-center justify-between">
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
      </section>

      <nav className="flex overflow-x-auto divide-x divide-gray-12 border-y border-gray-12 text-xs sticky top-12 backdrop-blur-lg">
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
            className="min-w-24 lg:min-w-40 text-center py-3 shrink-0 px-2 md:px-4"
          >
            {item}
          </Link>
        ))}
      </nav>

      <section className="px-8 mt-16 py-4">
        <blockquote className="max-w-[80ch] text-xl font-light leading-normal text-gray-1">
          A statistical disclosure control tool to protect tables by suppression
          using the Gaussian elimination secondary suppression algorithm. A
          suggestion is to start by working with functions SuppressSmallCounts()
          and SuppressDominantCells(). These functions use primary suppression
          functions for the minimum frequency rule and the dominance rule,
          respectively. Novel functionality for suppression of disclosive cells
          is also included. General primary suppression functions can be
          supplied as input to the general working horse function,
          GaussSuppressionFromData(). Suppressed frequencies can be replaced by
          synthetic decimal numbers as described in Langsrud (2019)
          doi:10.1007/s11222-018-9848-9.
        </blockquote>
      </section>

      <div className="h-[100vh]"></div>
    </>
  );
}
