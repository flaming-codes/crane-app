import { data, useLoaderData } from "react-router";
import { SyneLogo } from "../modules/svg";
import NavigationPage from "../modules/nav";
import { randomInt } from "es-toolkit";
import { Footer } from "../modules/footer";
import { ENV } from "../data/env";
import { ClientOnly } from "remix-utils/client-only";
import { PackageService } from "../data/package.service";
import { AuthorService } from "../data/author.service";
import { gradients } from "../modules/gradients.server";

export const handle = {
  hasFooter: false,
};

export const loader = async () => {
  const version = ENV.npm_package_version;

  const [packageRes, authorRes] = await Promise.allSettled([
    PackageService.getTotalPackagesCount(),
    AuthorService.getTotalAuthorsCount(),
  ]);

  const packageCount = packageRes.status === "fulfilled" ? packageRes.value : 0;
  const authorCount = authorRes.status === "fulfilled" ? authorRes.value : 0;

  return data(
    {
      gradient: gradients[randomInt(0, gradients.length)],
      version,
      // We're using the server here for formatting numbers
      // to avoid client-side rehydration issues.
      packageCount: Intl.NumberFormat().format(packageCount),
      authorCount: Intl.NumberFormat().format(authorCount),
    },
    {
      headers: {
        "Cache-Control": `public, s-maxage=10`,
      },
    },
  );
};

export default function Index() {
  const { gradient, version, packageCount, authorCount } =
    useLoaderData<typeof loader>();

  return (
    <>
      <GradientBackground gradient={gradient} />

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
            Search for {packageCount} R packages and {authorCount} authors
            hosted on CRAN
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

function GradientBackground({ gradient }: { gradient: null | string }) {
  if (gradient === null) {
    return null;
  }
  return (
    <>
      <div
        style={{ background: gradient }}
        className="animate-fade fixed inset-x-0 top-0 -z-50 h-[60vh] transform-gpu duration-500"
      />

      <div className="fixed inset-x-0 top-0 -z-50 h-[60vh] bg-linear-to-t from-[#fff] dark:from-[#000]" />
      <div className="fixed inset-x-0 top-0 -z-40 h-[60vh] bg-linear-to-t from-[#fff] via-[#fff] opacity-50 dark:from-[#000] dark:via-[#000]" />
      <div className="fixed inset-x-0 top-[40vh] -z-30 h-[20vh] bg-linear-to-t from-[#fff] via-[#fff] opacity-80 dark:from-[#000] dark:via-[#000]" />
    </>
  );
}
