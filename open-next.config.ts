import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import staticAssetsIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache";

export default {
  ...defineCloudflareConfig({
    // All app routes are prerendered; serve the build-time cache from Worker assets.
    incrementalCache: staticAssetsIncrementalCache,
    enableCacheInterception: true,
  }),
  // The default build script produces the Worker, so invoke Next.js directly here.
  buildCommand: "pnpm run build:next",
};
