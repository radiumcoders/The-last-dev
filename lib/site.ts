// Build-time values for static export — evaluated once during `next build`.
export const buildTime = new Date().toISOString()

// Set NEXT_PUBLIC_APP_ENV in build.envVariables in zerops.yaml.
export const appEnv = process.env.NEXT_PUBLIC_APP_ENV ?? 'development'
