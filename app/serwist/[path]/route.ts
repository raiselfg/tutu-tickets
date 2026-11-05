import { createHash } from "node:crypto";
import { readFileSync, readdirSync } from "node:fs";
import { createSerwistRoute } from "@serwist/turbopack";

const sourceHash = createHash("sha256").update(readFileSync("pnpm-lock.yaml"));
for (const file of readdirSync("app", { recursive: true }).sort()) {
  if (/\.(tsx?|css)$/.test(String(file))) {
    sourceHash.update(readFileSync(`app/${file}`));
  }
}
const revision = sourceHash.digest("hex");

export const { dynamic, dynamicParams, revalidate, generateStaticParams, GET } = createSerwistRoute({
  swSrc: "app/sw.ts",
  useNativeEsbuild: true,
  globPatterns: [
    ".next/static/**/*.{js,css,html,ico,apng,png,avif,jpg,jpeg,jfif,pjpeg,pjp,gif,svg,webp,json,webmanifest}",
    ".next/static/media/**/*.{ttf,woff,woff2}",
    "public/**/*",
  ],
  additionalPrecacheEntries: ["/", "/ticket", "/create-ticket", "/schedule", "/station", "/other", "/manifest.webmanifest", "/favicon.ico"].map((url) => ({ url, revision })),
});
