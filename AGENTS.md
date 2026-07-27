# nextjs-static-hello-world-app

Next.js 16 static export — `output: 'export'` produces plain HTML/CSS/JS at build time, served by nginx in prod; dev container runs `next dev` over SSH.

## Zerops service facts

- HTTP port: dev `3000` (next dev) / prod `80` (nginx)
- Siblings: —
- Runtime base: dev `nodejs@22` / prod `static`

## Zerops dev

`setup: dev` idles on `zsc noop --silent`; the agent starts the dev server.

- Dev command: `npm run dev`
- In-container rebuild without deploy: `npm run build`

**All platform operations (start/stop/status/logs of the dev server, deploy, env / scaling / storage / domains) go through the Zerops development workflow via `zcp` MCP tools. Don't shell out to `zcli`.**

## Notes

- `next.config.ts` sets `output: 'export'` — the build emits `out/` with no Node.js required at runtime. Prod `deployFiles: out/~` strips the prefix so the exported tree is the nginx document root.
- `NEXT_PUBLIC_*` env vars are baked into the bundle at build time; set them in `build.envVariables` in `zerops.yaml`, not as runtime service vars (there's no runtime process in static mode).
- Build cache includes `.next/cache` for Next.js incremental compilation — don't remove it.
