import type { MetaFunction } from "@remix-run/node";
import { json, useLoaderData } from "@remix-run/react";
import { SineLogo } from "../modules/svg";
import NavigationPage from "../modules/nav";
import { randomInt } from "es-toolkit";
import clsx from "clsx";
import { Footer } from "../modules/footer";
import { ENV } from "../data/env";
import { usePrevious } from "@uidotdev/usehooks";

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
  const meshIndex = randomInt(0, 25);
  const version = ENV.npm_package_version;
  return json({ meshIndex, version });
};

export default function Index() {
  const { meshIndex, version } = useLoaderData<typeof loader>();

  // TODO: Remove once "useRevalidator" has been removed as well.
  // This is only for a few days for legacy support of the old SW,
  // as Remix PWA can't init itself on initial page load.
  const prevMeshIndex = usePrevious(meshIndex);

  return (
    <>
      <GradientBackground meshIndex={prevMeshIndex} />

      <NavigationPage
        hasSubtleBackground
        inputClassName="placeholder:text-gray-6 dark:placeholder:text-gray-dim"
      >
        <div className="flex h-[90svh] flex-col justify-center gap-6">
          <div>
            <SineLogo className="text-gray-normal w-[max(100px,60%)]" />
            <h1 className="sr-only">
              CRAN/E - The R Packages Search Engine, Enhanced
            </h1>
          </div>
          <p className="text-gray-dim text-lg font-light md:text-xl xl:text-2xl">
            Search for R packages and authors hosted on CRAN
          </p>
          <div className="text-gray-dim mt-16 space-y-2">
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

        <div className="content-grid absolute inset-x-0 bottom-0">
          <Footer variant="start" version={version} />
        </div>
      </NavigationPage>
    </>
  );
}

function GradientBackground({ meshIndex }: { meshIndex: number }) {
  return (
    <>
      <div
        className={clsx("fixed inset-x-0 top-0 -z-50 h-[60vh]", {
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
          "bg-mesh-20": meshIndex === 19,
          "bg-mesh-21": meshIndex === 20,
          "bg-mesh-22": meshIndex === 21,
          "bg-mesh-23": meshIndex === 22,
          "bg-mesh-24": meshIndex === 23,
          "bg-mesh-25": meshIndex === 24,
        })}
      />
      <div className="fixed inset-x-0 top-0 -z-50 h-[60vh] bg-gradient-to-t from-white dark:from-black" />
      <div className="fixed inset-x-0 top-0 -z-40 h-[60vh] bg-gradient-to-t from-white via-white opacity-50 dark:from-black dark:via-black" />
      <div className="fixed inset-x-0 top-[40vh] -z-30 h-[20vh] bg-gradient-to-t from-white via-white opacity-80 dark:from-black dark:via-black" />
    </>
  );
}
