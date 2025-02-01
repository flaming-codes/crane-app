import {
  Link,
  Links,
  LinksFunction,
  LoaderFunction,
  Meta,
  MetaFunction,
  Outlet,
  Scripts,
  ScrollRestoration,
  useMatches,
  useRouteLoaderData,
} from "react-router";
import { Footer } from "./modules/footer";
import stylesheet from "./tailwind.css?url";
import { ENV } from "./data/env";
import { BASE_URL } from "./modules/app";
import { createNonce } from "@mcansh/http-helmet";

const isServer = typeof window === "undefined";

export const meta: MetaFunction = () => {
  return [
    { title: "CRAN/E - The R packages & authors search engine, enhanced" },
    {
      name: "description",
      content:
        "CRAN/E is a semantic search engine for R packages and authors, enhanced with additional features.",
    },
    { property: "og:type", content: "website" },
    { property: "og:url", content: BASE_URL },
    {
      property: "og:image",
      content: BASE_URL + `/og`,
    },
  ];
};

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
];

type LoaderData = {
  isProduction: boolean;
  domain: string;
  version: string;
  nonce: string;
};

export const loader: LoaderFunction = async (): Promise<LoaderData> => {
  const nonce = createNonce();
  return {
    isProduction: ENV.NODE_ENV === "production",
    domain: ENV.VITE_PLAUSIBLE_SITE_ID,
    version: ENV.npm_package_version,
    nonce,
  };
};

export default function App() {
  const data = useRouteLoaderData<LoaderData>("root");

  const nonce = data?.nonce;

  const isPlausibleEnabled = data?.isProduction && data?.domain;

  const matches = useMatches().slice(1);
  const hasFooter = matches.some((match) => {
    const handle = match.handle as { hasFooter?: boolean } | undefined;
    return handle?.hasFooter;
  });

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="msapplication-TileColor" content="#111111" />
        <meta
          name="theme-color"
          content="#fff"
          media="(prefers-color-scheme: light)"
        />
        <meta
          name="theme-color"
          content="#000"
          media="(prefers-color-scheme: dark)"
        />
        <meta name="mobile-web-app-capable" content="yes" />
        <link
          rel="icon"
          type="image/png"
          href="/icons/favicon-96x96.png"
          sizes="96x96"
        />
        <link rel="icon" type="image/svg+xml" href="/icons/favicon.svg" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/icons/apple-touch-icon.png"
        />
        <meta name="apple-mobile-web-app-title" content="CRAN/E" />
        <link rel="manifest" href="/manifest.webmanifest" />
        <Meta />
        <Links />
      </head>
      <body className="text-gray-normal">
        <script
          nonce={isServer ? nonce : ""}
          dangerouslySetInnerHTML={{
            __html: `window.ENV = ${JSON.stringify({
              isPlausibleEnabled,
            })}`,
          }}
        />
        {isPlausibleEnabled ? (
          <>
            <script
              defer
              nonce={isServer ? nonce : ""}
              data-domain="cran-e.com"
              src="https://plausible.flaming.codes/js/script.outbound-links.js"
            />
            <script nonce={isServer ? nonce : ""}>
              {`
                window.plausible = window.plausible || function()
                {(window.plausible.q = window.plausible.q || []).push(arguments)}
              `}
            </script>
          </>
        ) : null}

        <main className="content-grid min-h-full">
          <Outlet />
        </main>
        {hasFooter ? (
          <Footer
            variant="page"
            version={data?.version}
            start={
              <li>
                <Link
                  viewTransition
                  to="/"
                  className="underline-offset-4 hover:underline"
                >
                  Home
                </Link>
              </li>
            }
          />
        ) : null}
        <ScrollRestoration nonce={isServer ? nonce : ""} />
        <Scripts nonce={isServer ? nonce : ""} />
      </body>
    </html>
  );
}

export function ErrorBoundary() {
  // const error = useRouteError() as Error | unknown;

  return (
    <html lang="en">
      <head>
        <title>Oh no!</title>
        <Meta />
        <Links />
      </head>
      <body className="flex min-h-full flex-col bg-black">
        {/* add the UI you want your users to see */}

        <main className="flex h-full flex-1 flex-col justify-center">
          <div className="mx-auto max-w-5xl px-2">
            <h1 className="font-serif text-7xl italic">Oh no!</h1>
            <p>
              Something went wrong.
              <br />
              Please try in a few minutes again.
            </p>
          </div>
        </main>

        <Footer
          variant="page"
          start={
            <li>
              <Link
                viewTransition
                to="/"
                className="underline-offset-4 hover:underline"
              >
                Home
              </Link>
            </li>
          }
        />
      </body>
    </html>
  );
}
