/**
 * By default, Remix will handle generating the HTTP Response for you.
 * You are free to delete this file if you'd like to, but if you ever want it revealed again, you can run `npx remix reveal` ✨
 * For more information, see https://remix.run/file-conventions/entry.server
 */

import { PassThrough } from "node:stream";
import type { EntryContext } from "react-router";
import { createReadableStreamFromReadable } from "@react-router/node";
import { ServerRouter } from "react-router";
import { isbot } from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import { server } from "./mocks/node.server";
import { slog } from "./modules/observability.server";
import { createSecureHeaders } from "@mcansh/http-helmet";
import { initOTEL } from "./modules/instrumentation.server";
import { BLOCKED_COUNTRIES } from "./modules/arcjet.server";

const ABORT_DELAY = 5_000;

initOTEL();

if (process.env.NODE_ENV === "development") {
  server.listen({ onUnhandledRequest: "bypass" });
  server.events.on("request:start", ({ request }) => {
    slog.debug("MSW intercepted:", request.method, request.url);
  });
}

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  reactRouterContext: EntryContext,
) {
  const country = (
    request.headers.get("cf-ipcountry") ||
    request.headers.get("x-vercel-ip-country") ||
    request.headers.get("x-geo-country")
  )
    ?.trim()
    .toUpperCase();

  if (country && BLOCKED_COUNTRIES.includes(country)) {
    slog.warn("Blocked request by country", { country, url: request.url });
    return new Response("Access not available in your region", { status: 403 });
  }

  responseHeaders.set("X-Frame-Options", "DENY");
  responseHeaders.set("X-Content-Type-Options", "nosniff");
  responseHeaders.set("Referrer-Policy", "strict-origin-when-cross-origin");
  responseHeaders.set(
    "Feature-Policy",
    "geolocation 'none'; midi 'none'; sync-xhr 'none'; microphone 'none'; camera 'none'; magnetometer 'none'; gyroscope 'none'; fullscreen 'self'; payment 'none'",
  );
  responseHeaders.set(
    "Strict-Transport-Security",
    "max-age=31536000; includeSubDomains; preload",
  );

  const nonce = reactRouterContext.staticHandlerContext.loaderData.root?.nonce;
  createSecureHeaders({
    "Content-Security-Policy": {
      "default-src": ["'self'"],
      "script-src": [
        "'self'",
        `'nonce-${nonce}'`,
        "https://cloud.umami.is",
        "https://plausible.flaming.codes",
      ],
      "script-src-elem": [
        "'self'",
        `'nonce-${nonce}'`,
        "https://plausible.flaming.codes",
        "https://cloud.umami.is",
      ],
      "connect-src": [
        "'self'",
        "https://plausible.flaming.codes",
        "https://cloud.umami.is",
        "https://gateway.umami.is",
        "https://eu.umami.is",
        "https://api-gateway-eu.umami.dev",
        "https://api-gateway.umami.dev",
      ],
      "style-src": ["'self'", "'unsafe-inline'"],
      "img-src": ["'self'", "*.digitaloceanspaces.com"],
      "base-uri": ["'self'"],
    },
  }).forEach((value, key) => {
    responseHeaders.set(key, value);
  });

  return isbot(request.headers.get("user-agent") || "")
    ? handleBotRequest(
        request,
        responseStatusCode,
        responseHeaders,
        reactRouterContext,
      )
    : handleBrowserRequest(
        request,
        responseStatusCode,
        responseHeaders,
        reactRouterContext,
      );
}

function handleBotRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  reactRouterContext: EntryContext,
) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    const nonce =
      reactRouterContext.staticHandlerContext.loaderData.root?.nonce;
    const { pipe, abort } = renderToPipeableStream(
      <ServerRouter
        context={reactRouterContext}
        nonce={nonce}
        url={request.url}
      />,
      {
        nonce,
        onAllReady() {
          shellRendered = true;
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);

          responseHeaders.set("Content-Type", "text/html");

          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode,
            }),
          );

          pipe(body);
        },
        onShellError(error: unknown) {
          reject(error);
        },
        onError(error: unknown) {
          responseStatusCode = 500;
          // Log streaming rendering errors from inside the shell.  Don't log
          // errors encountered during initial shell rendering since they'll
          // reject and get logged in handleDocumentRequest.
          if (shellRendered) {
            slog.error(error);
          }
        },
      },
    );

    setTimeout(abort, ABORT_DELAY);
  });
}

function handleBrowserRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  reactRouterContext: EntryContext,
) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    const nonce =
      reactRouterContext.staticHandlerContext.loaderData.root?.nonce;
    const { pipe, abort } = renderToPipeableStream(
      <ServerRouter
        context={reactRouterContext}
        nonce={nonce}
        url={request.url}
      />,
      {
        nonce,
        onShellReady() {
          shellRendered = true;
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);

          responseHeaders.set("Content-Type", "text/html");

          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode,
            }),
          );

          pipe(body);
        },
        onShellError(error: unknown) {
          reject(error);
        },
        onError(error: unknown) {
          responseStatusCode = 500;
          // Log streaming rendering errors from inside the shell.  Don't log
          // errors encountered during initial shell rendering since they'll
          // reject and get logged in handleDocumentRequest.
          if (shellRendered) {
            slog.error(error);
          }
        },
      },
    );

    setTimeout(abort, ABORT_DELAY);
  });
}
