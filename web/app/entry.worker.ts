/// <reference lib="WebWorker" />

export {};

declare let self: ServiceWorkerGlobalScope;

import { Logger } from "@remix-pwa/sw";

const logger = new Logger({ prefix: "[SW]" });

self.addEventListener("install", (event) => {
  logger.log("Service worker installed");

  event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", (event) => {
  logger.log("Service worker activated");

  const cachesToKeep: string[] = [];

  const clearUpAllLegacyCaches = async () => {
    return caches.keys().then((keyList) =>
      Promise.all(
        keyList.map((key) => {
          if (!cachesToKeep.includes(key)) {
            return caches.delete(key);
          }
        }),
      ),
    );
  };

  const handler = async () => {
    await clearUpAllLegacyCaches();
    await self.clients.claim();
  };

  event.waitUntil(handler());
});
