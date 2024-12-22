import { data, useLoaderData } from "react-router";
import { SyneLogo } from "../modules/svg";
import NavigationPage from "../modules/nav";
import { randomInt } from "es-toolkit";
import { clsx } from "clsx";
import { Footer } from "../modules/footer";
import { ENV } from "../data/env";
import { ClientOnly } from "remix-utils/client-only";

export const handle = {
  hasFooter: false,
};

export const loader = async () => {
  const meshIndex = randomInt(0, 27);
  const version = ENV.npm_package_version;
  return data(
    { meshIndex, version },
    {
      headers: {
        "Cache-Control": `public, s-maxage=10`,
      },
    },
  );
};

export default function Index() {
  const { meshIndex, version } = useLoaderData<typeof loader>();

  return (
    <>
      <GradientBackground meshIndex={meshIndex} />

      <NavigationPage
        hasSubtleBackground
        inputClassName="placeholder:text-gray-6 dark:placeholder:text-gray-dim"
      >
        <div className="flex h-[90svh] flex-col justify-center gap-6">
          <div>
            <SyneLogo className="text-gray-normal w-[max(200px,65%)]" />
            <h1 className="sr-only">
              CRAN/E - The R Packages Search Engine, Enhanced
            </h1>
          </div>
          <p className="text-gray-dim text-lg font-light md:text-xl xl:text-2xl">
            Search for R packages and authors hosted on CRAN
          </p>
          <div className="text-gray-dim mt-16 space-y-2">
            <p className="animate-fade">
              Click on the <strong>top search bar</strong> to start searching
            </p>
            <p className="animate-fade animate-delay-150">
              Or press{" "}
              <ClientOnly fallback={<kbd>⌘ + K</kbd>}>
                {() => (
                  <kbd className="px-2 font-mono font-bold tracking-[-0.1rem]">
                    {navigator?.platform?.toLowerCase().includes("mac")
                      ? "⌘"
                      : "Ctrl"}
                    {" + K"}
                  </kbd>
                )}
              </ClientOnly>{" "}
              to open search from anywhere
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

function GradientBackground({ meshIndex }: { meshIndex: null | number }) {
  if (meshIndex === null) {
    return null;
  }
  return (
    <>
      <div
        className={clsx(
          "fixed inset-x-0 top-0 -z-50 h-[60vh] transform-gpu animate-fade duration-500",
          {
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
            "bg-mesh-26": meshIndex === 25,
            "bg-mesh-27": meshIndex === 26,
          },
        )}
      />

      <div className="fixed inset-x-0 top-0 -z-50 h-[60vh] bg-gradient-to-t from-white dark:from-black" />
      <div className="fixed inset-x-0 top-0 -z-40 h-[60vh] bg-gradient-to-t from-white via-white opacity-50 dark:from-black dark:via-black" />
      <div className="fixed inset-x-0 top-[40vh] -z-30 h-[20vh] bg-gradient-to-t from-white via-white opacity-80 dark:from-black dark:via-black" />
    </>
  );
}
