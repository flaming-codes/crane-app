import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { json, Link, useLoaderData } from "@remix-run/react";
import { SineLogo } from "../modules/svg";
import NavigationPage from "../modules/nav";
import { randomInt } from "es-toolkit";
import clsx from "clsx";
import { ExternalLink } from "../modules/external-link";

export const handle = {
  hasFooter: false,
};

export const meta: MetaFunction = () => {
  return [
    { title: "CRAN/E" },
    { name: "description", content: "Welcome to CRAN/E" },
  ];
};

export const loader = async () => {
  const meshIndex = randomInt(0, 16);
  return json({ meshIndex });
};

export default function Index() {
  const { meshIndex } = useLoaderData<typeof loader>();

  return (
    <>
      <GradientBackground meshIndex={meshIndex} />

      <NavigationPage
        hasSubtleBackground
        inputClassName="placeholder:text-gray-6 dark:placeholder:text-gray-dim"
      >
        <div className="h-[90svh] flex flex-col justify-center gap-6">
          <div>
            <SineLogo className="w-[max(100px,60%)] text-gray-normal" />
            <h1 className="sr-only">
              CRAN/E - The R Packages Search Engine, Enhanced
            </h1>
          </div>
          <p className="text-lg md:text-xl xl:text-2xl font-light text-gray-dim">
            Search for R packages and authors hosted on CRAN
          </p>
          <div className="mt-16 text-gray-dim space-y-2">
            <p>
              Click on the <strong>top search bar</strong> to start searching
            </p>
            <p>
              Or press{" "}
              <kbd className="font-mono font-bold">
                {navigator?.platform?.toLowerCase().includes("mac")
                  ? "⌘"
                  : "Ctrl"}
              </kbd>{" "}
              + <kbd className="font-mono font-bold">K</kbd> to open search from
              anywhere
            </p>
          </div>
        </div>

        <div className="absolute bottom-0 inset-x-0 content-grid">
          <div className="full-width">
            <ul className="flex items-center gap-6 text-sm text-gray-dim py-6 font-light">
              <li>
                <Link
                  to="/privacy"
                  className="hover:underline underline-offset-4"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="hover:underline underline-offset-4"
                >
                  Privacy
                </Link>
              </li>
              <li>
                <ExternalLink
                  href="https://github.com/flaming-codes/crane-app"
                  className="hover:underline underline-offset-4"
                >
                  Github
                </ExternalLink>
              </li>
            </ul>
          </div>
        </div>
      </NavigationPage>
    </>
  );
}

function GradientBackground({ meshIndex }: { meshIndex: number }) {
  return (
    <>
      <div
        className={clsx("fixed top-0 inset-x-0 h-[60vh] -z-50", {
          "bg-mesh-1": meshIndex === 0,
          "bg-mesh-2": meshIndex === 1,
          "bg-mesh-3": meshIndex === 2,
          "bg-mesh-4": meshIndex === 3,
          "bg-mesh-5": meshIndex === 4,
          "bg-mesh-6": meshIndex === 5,
          "bg-mesh-7": meshIndex === 6,
          "bg-mesh-8": meshIndex === 7,
          "bg-mesh-9": meshIndex === 8,
          "bg-mesh-10": meshIndex === 9,
          "bg-mesh-11": meshIndex === 10,
          "bg-mesh-12": meshIndex === 11,
          "bg-mesh-13": meshIndex === 12,
          "bg-mesh-14": meshIndex === 13,
          "bg-mesh-15": meshIndex === 14,
          "bg-mesh-16": meshIndex === 15,
          "bg-mesh-17": meshIndex === 16,
          "bg-mesh-18": meshIndex === 17,
          "bg-mesh-19": meshIndex === 18,
        })}
      />
      <div className="fixed top-0 inset-x-0 bg-gradient-to-t from-white dark:from-black h-[60vh] -z-50" />
      <div className="fixed top-0 inset-x-0 bg-gradient-to-t from-white dark:from-black via-white dark:via-black h-[60vh] opacity-50 -z-40" />
      <div className="fixed top-[40vh] inset-x-0 bg-gradient-to-t from-white dark:from-black via-white dark:via-black h-[20vh] opacity-80 -z-30" />
    </>
  );
}
