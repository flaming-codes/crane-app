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
  useRevalidator,
  useRouteLoaderData,
} from "@remix-run/react";
import type { LinksFunction } from "@remix-run/node";
import { Footer } from "./modules/footer";
import "./tailwind.css";
import { ENV } from "./data/env";
import { BASE_URL } from "./modules/app";
import { useEffect } from "react";

export const meta: MetaFunction = () => {
  return [
    { title: "CRAN/E" },
    { name: "description", content: "A collection of R packages for CRAN" },
    { property: "og:type", content: "website" },
    { property: "og:url", content: BASE_URL },
    { property: "og:image", content: BASE_URL + "/images/og/cover-01.jpg" },
  ];
};

export const links: LinksFunction = () => {
  return [
    {
      rel: "manifest",
      href: "/manifest.webmanifest",
    },
    {
      rel: "icon",
      href: "/icons/favicon.ico",
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "32x32",
      href: "/icons/favicon-32x32.png",
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "16x16",
      href: "/icons/favicon-16x16.png",
    },
    {
      rel: "mask-icon",
      href: "/icons/safari-pinned-tab.svg",
      color: "#5bbad5",
    },
    {
      rel: "apple-touch-icon",
      href: "/icons/apple-icon-180.png",
    },
    {
      rel: "apple-touch-startup-image",
      href: "/icons/apple-splash-2048-2732.jpg",
      media:
        "(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
    },
    {
      rel: "apple-touch-startup-image",
      href: "/icons/apple-splash-2732-2048.jpg",
      media:
        "(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)",
    },
    {
      rel: "apple-touch-startup-image",
      href: "/icons/apple-splash-1668-2388.jpg",
      media:
        "(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
    },
    {
      rel: "apple-touch-startup-image",
      href: "/icons/apple-splash-2388-1668.jpg",
      media:
        "(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)",
    },
    {
      rel: "apple-touch-startup-image",
      href: "/icons/apple-splash-1536-2048.jpg",
      media:
        "(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
    },
    {
      rel: "apple-touch-startup-image",
      href: "/icons/apple-splash-2048-1536.jpg",
      media:
        "(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)",
    },
    {
      rel: "apple-touch-startup-image",
      href: "/icons/apple-splash-1668-2224.jpg",
      media:
        "(device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
    },
    {
      rel: "apple-touch-startup-image",
      href: "/icons/apple-splash-2224-1668.jpg",
      media:
        "(device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)",
    },
    {
      rel: "apple-touch-startup-image",
      href: "/icons/apple-splash-1620-2160.jpg",
      media:
        "(device-width: 810px) and (device-height: 1080px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
    },
    {
      rel: "apple-touch-startup-image",
      href: "/icons/apple-splash-2160-1620.jpg",
      media:
        "(device-width: 810px) and (device-height: 1080px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)",
    },
    {
      rel: "apple-touch-startup-image",
      href: "/icons/apple-splash-1290-2796.jpg",
      media:
        "(device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)",
    },
    {
      rel: "apple-touch-startup-image",
      href: "/icons/apple-splash-2796-1290.jpg",
      media:
        "(device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)",
    },
    {
      rel: "apple-touch-startup-image",
      href: "/icons/apple-splash-1179-2556.jpg",
      media:
        "(device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)",
    },
    {
      rel: "apple-touch-startup-image",
      href: "/icons/apple-splash-2556-1179.jpg",
      media:
        "(device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)",
    },
    {
      rel: "apple-touch-startup-image",
      href: "/icons/apple-splash-1284-2778.jpg",
      media:
        "(device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)",
    },
    {
      rel: "apple-touch-startup-image",
      href: "/icons/apple-splash-2778-1284.jpg",
      media:
        "(device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)",
    },
    {
      rel: "apple-touch-startup-image",
      href: "/icons/apple-splash-1170-2532.jpg",
      media:
        "(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)",
    },
    {
      rel: "apple-touch-startup-image",
      href: "/icons/apple-splash-2532-1170.jpg",
      media:
        "(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)",
    },
    {
      rel: "apple-touch-startup-image",
      href: "/icons/apple-splash-1125-2436.jpg",
      media:
        "(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)",
    },
    {
      rel: "apple-touch-startup-image",
      href: "/icons/apple-splash-2436-1125.jpg",
      media:
        "(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)",
    },
    {
      rel: "apple-touch-startup-image",
      href: "/icons/apple-splash-1242-2688.jpg",
      media:
        "(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)",
    },
    {
      rel: "apple-touch-startup-image",
      href: "/icons/apple-splash-2688-1242.jpg",
      media:
        "(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)",
    },
    {
      rel: "apple-touch-startup-image",
      href: "/icons/apple-splash-828-1792.jpg",
      media:
        "(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
    },
    {
      rel: "apple-touch-startup-image",
      href: "/icons/apple-splash-1792-828.jpg",
      media:
        "(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)",
    },
    {
      rel: "apple-touch-startup-image",
      href: "/icons/apple-splash-1242-2208.jpg",
      media:
        "(device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)",
    },
    {
      rel: "apple-touch-startup-image",
      href: "/icons/apple-splash-2208-1242.jpg",
      media:
        "(device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)",
    },
    {
      rel: "apple-touch-startup-image",
      href: "/icons/apple-splash-750-1334.jpg",
      media:
        "(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
    },
    {
      rel: "apple-touch-startup-image",
      href: "/icons/apple-splash-1334-750.jpg",
      media:
        "(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)",
    },
    {
      rel: "apple-touch-startup-image",
      href: "/icons/apple-splash-640-1136.jpg",
      media:
        "(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
    },
    {
      rel: "apple-touch-startup-image",
      href: "/icons/apple-splash-1136-640.jpg",
      media:
        "(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)",
    },
  ];
};

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

  const revalidator = useRevalidator();
  useEffect(() => {
    revalidator.revalidate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="msapplication-TileColor" content="#111111" />
        <meta name="theme-color" content="#000" />
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
                <Link
                  to="/"
                  className="underline-offset-4 hover:underline"
                  aria-label="Open landing page"
                >
                  Start
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
