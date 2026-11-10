/// <reference lib="webworker" />

import { defaultCache } from "@serwist/turbopack/worker";
import { disableNavigationPreload, Serwist, type PrecacheEntry, type SerwistGlobalConfig } from "serwist";

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  precacheOptions: {
    // Next.js adds a version parameter to the favicon URL.
    // A ticket's HTML shell is shared; its number is resolved from IndexedDB.
    ignoreURLParametersMatching: [/^utm_/, /^fbclid$/, /^favicon\./, /^number$/],
  },
  skipWaiting: true,
  clientsClaim: true,
  runtimeCaching: defaultCache,
});

disableNavigationPreload();
serwist.addEventListeners();
