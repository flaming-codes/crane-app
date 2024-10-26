import {
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useMatches,
} from "@remix-run/react";
import type { LinksFunction } from "@remix-run/node";

import "./tailwind.css";
import { Footer } from "./modules/footer";

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
          <Footer
            variant="page"
            start={
              <li>
                <Link to="/" className="hover:underline underline-offset-4">
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

export default function App() {
  return (
    <main className="min-h-full content-grid">
      <Outlet />
    </main>
  );
}
