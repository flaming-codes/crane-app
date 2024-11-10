import {
  json,
  Link,
  Links,
  Meta,
  MetaFunction,
  Outlet,
  Scripts,
  ScrollRestoration,
  useMatches,
  useRouteLoaderData,
} from "@remix-run/react";
import { Footer } from "./modules/footer";
import "./tailwind.css";
import { ENV } from "./data/env";
import { useEffect } from "react";
import { unregisterServiceWorker } from "@remix-pwa/sw";
import { clog } from "./modules/observability";
import { BASE_URL } from "./modules/app";
import { createNonce } from "@mcansh/http-helmet/react";
import { createSecureHeaders } from "@mcansh/http-helmet";

export const meta: MetaFunction = ({ location }) => {
  // Pseudo-randomly select a cover image based on the length
  // of the current path (= stable index per site) and add
  //  the current day of the week as a seed so that the cover
  //  changes daily.
  const dayOfWeek = new Date().getDay();
  const coverIndex = ((location.pathname.length + dayOfWeek) & 9) + 1;

  return [
    { title: "CRAN/E" },
    { name: "description", content: "The R package search engine, enhanced" },
    { property: "og:type", content: "website" },
    { property: "og:url", content: BASE_URL },
    {
      property: "og:image",
      content: BASE_URL + `/images/og/cover-${coverIndex}.jpg`,
    },
  ];
};

export const loader = async () => {
  const nonce = createNonce();
  const headers = createSecureHeaders({
    "Content-Security-Policy": {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", `'nonce-${nonce}'`],
    },
  });

  return json(
    {
      isProduction: ENV.NODE_ENV === "production",
      domain: ENV.VITE_PLAUSIBLE_SITE_ID,
      version: ENV.npm_package_version,
      nonce
    },
    {
      headers,
    },
  );
};

export default function App() {
  const data = useRouteLoaderData<typeof loader>("root");
  const nonce = data?.nonce;

  const isPlausibleEnabled = data?.isProduction && data?.domain;

  const matches = useMatches().slice(1);
  const hasFooter = matches.some((match) => {
    const handle = match.handle as { hasFooter?: boolean } | undefined;
    return handle?.hasFooter;
  });

  useEffect(() => {
    unregisterServiceWorker().catch((error) => {
      clog.error("Failed to unregister service worker", error);
    });
  }, []);

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
        <link rel="shortcut icon" href="/icons/favicon.ico" />
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
      <body>
        <script
          nonce={nonce}
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
              nonce={nonce}
              data-domain="cran-e.com"
              src="https://plausible.io/js/script.outbound-links.js"
            />
            <script nonce={nonce}>
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
                <Link to="/" className="underline-offset-4 hover:underline">
                  Home
                </Link>
              </li>
            }
          />
        ) : null}
        <ScrollRestoration nonce={nonce} />
        <Scripts />
      </body>
    </html>
  );
}
