# Ticket app

## Development

```sh
pnpm install --frozen-lockfile
pnpm dev
```

## Cloudflare Workers

```sh
pnpm preview
pnpm deploy
```

Both commands build the app before running the OpenNext preview or deploy command.
`pnpm run build` produces the OpenNext Worker, compiled configuration, and static
cache assets. OpenNext calls `pnpm run build:next` to compile the Next.js app,
avoiding a recursive call to the default build script.

All current routes are prerendered, so the cache uses Workers Static Assets
rather than R2. If routes later need revalidation, update the cache configuration.

For Cloudflare Git builds, use:

- Build command: `pnpm run build`
- Deploy command: `npx wrangler deploy`

Wrangler delegates deployment to OpenNext before processing custom build hooks.
The Cloudflare build command must therefore create `.open-next` before deployment
starts. No Wrangler custom build hook is needed.

For a local Node.js production build, use `pnpm run build:next` then `pnpm start`.

`esbuild-wasm` is installed because OpenNext resolves both esbuild imports in
Serwist's route handler. Service worker generation still uses native esbuild.
