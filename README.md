# Next.js 16 Static Hello World Recipe App

<!-- #ZEROPS_EXTRACT_START:intro# -->
A minimal Next.js 16 application deployed as a static export on Zerops — built with Node.js and served by Nginx, with build-time environment variable injection via `NEXT_PUBLIC_*` prefix.
Used within [Next.js Hello World recipe](https://app.zerops.io/recipes/nextjs-hello-world) for [Zerops](https://zerops.io) platform.
<!-- #ZEROPS_EXTRACT_END:intro# -->

⬇️ **Full recipe page and deploy with one-click**

[![Deploy on Zerops](https://github.com/zeropsio/recipe-shared-assets/blob/main/deploy-button/light/deploy-button.svg)](https://app.zerops.io/recipes/nextjs-hello-world?environment=small-production)

![nextjs cover](https://github.com/zeropsio/recipe-shared-assets/blob/main/covers/svg/cover-nextjs.svg)

## Integration Guide

<!-- #ZEROPS_EXTRACT_START:integration-guide# -->

### 1. Adding `zerops.yaml`
The main application configuration file you place at the root of your repository, it tells Zerops how to build, deploy and run your application.

```yaml
# Build with Node.js (npm/npx), serve with Nginx.
# The build container compiles Next.js into static
# HTML/CSS/JS — Node.js is NOT present at runtime.
zerops:
  - setup: prod
    build:
      base: nodejs@22

      # NEXT_PUBLIC_* vars are baked into the static
      # output at build time — there is no runtime
      # process to read env vars in static deployments.
      envVariables:
        NEXT_PUBLIC_APP_ENV: production

      buildCommands:
        - npm ci
        - npm run build

      # Strip 'out/' prefix — contents become the Nginx
      # root. Requires 'output: export' in next.config.ts.
      deployFiles:
        - out/~

      # .next/cache preserves incremental compilation
      # state across builds — significantly speeds up
      # subsequent deployments.
      cache:
        - node_modules
        - .next/cache

    run:
      # Nginx serves the compiled assets — no Node.js
      # at runtime.
      base: static
      # Built-in SPA fallback serves /index.html for all
      # unmatched routes — no custom routing config needed
      # for Next.js static export.

  - setup: dev
    build:
      base: nodejs@22
      os: ubuntu
      buildCommands:
        # npm install (not ci) — lock file may not exist
        # yet in a fresh dev workspace.
        - npm install
      # Deploy the full working tree so the developer has
      # source code and node_modules ready via SSH.
      deployFiles: ./
      cache:
        - node_modules

    run:
      # Node.js at runtime so the developer can run
      # 'npm run dev' or any other tooling via SSH.
      base: nodejs@22
      os: ubuntu
      # Keep the container alive — developer drives via
      # SSH, starting their own dev server manually.
      start: zsc noop --silent
```

### 2. Enabling static export in `next.config.ts`

Next.js must be configured to produce a static export — this outputs plain HTML/CSS/JS into `out/` instead of a server bundle:

```ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'export',
}

export default nextConfig
```

### 3. Reading build-time environment variables

In static deployments there is no runtime process — all configuration must be injected at build time. Next.js exposes variables prefixed with `NEXT_PUBLIC_` to client code during the build:

```tsx
// Replaced at build time — not available at runtime.
const appEnv = process.env.NEXT_PUBLIC_APP_ENV ?? 'development'
```

Set the variable in `build.envVariables` in `zerops.yaml` (or as a Zerops service environment variable with the `RUNTIME_` prefix to inject it at build time from the Zerops UI).

<!-- #ZEROPS_EXTRACT_END:integration-guide# -->
