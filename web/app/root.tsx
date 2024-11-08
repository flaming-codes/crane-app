import {
  json,
  Link,
  Links,
  Meta,
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
import { rootLinks, rootMeta } from "./route.meta";

export const meta = rootMeta

export const links = rootLinks

export const loader = async () => {
  return json({
    isProduction: ENV.NODE_ENV === "production",
    domain: ENV.VITE_PLAUSIBLE_SITE_ID,
    version: ENV.npm_package_version,
  });
};

export default function App() {
  const data = useRouteLoaderData<typeof loader>("root");

  const isPlausibleEnabled = data?.isProduction && data?.domain;

  const matches = useMatches().slice(1);
  const hasFooter = matches.some((match) => {
    const handle = match.handle as { hasFooter?: boolean } | undefined;
    return handle?.hasFooter;
  });

  useEffect(() => {
    unregisterServiceWorker();
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
        <Meta />
        <Links />
      </head>
      <body>
        <script
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
              data-domain="cran-e.com"
              src="https://plausible.io/js/script.outbound-links.js"
            />
            <script>
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
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
