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

Both commands run the Cloudflare build from `wrangler.jsonc`. The build creates
an OpenNext Worker and copies the prerendered cache into its static assets.
All current routes are prerendered, so the cache uses Workers Static Assets
rather than R2. If routes later need revalidation, update the cache configuration.

For Cloudflare Git builds, the existing settings work:

- Build command: `pnpm run build`
- Deploy command: `npx wrangler deploy`

Wrangler runs `pnpm run build:cloudflare` before deploying. The explicit
configuration prevents automatic project migration during deployment.

`esbuild-wasm` is installed because OpenNext resolves both esbuild imports in
Serwist's route handler. Service worker generation still uses native esbuild.
