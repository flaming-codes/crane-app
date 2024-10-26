import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useMatch,
  useMatches,
} from "@remix-run/react";
import type { LinksFunction } from "@remix-run/node";

import "./tailwind.css";

export const links: LinksFunction = () => [];

export function Layout({ children }: { children: React.ReactNode }) {
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
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        {hasFooter ? (
          <footer className="py-6 text-sm flex justify-center gap-4 items-center px-8 border-t border-gray-dim">
            <span>About</span> <span>Help</span> <span>Privacy</span>
          </footer>
        ) : null}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <main className="min-h-full content-grid">
      <Outlet />
    </main>
  );
}
