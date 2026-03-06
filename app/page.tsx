import pkg from '../package.json'

// This component runs at build time in static export mode.
// new Date() captures the build timestamp — not request time.
const buildTime = new Date().toISOString()

// NEXT_PUBLIC_* vars are replaced at build time by Next.js.
// Set NEXT_PUBLIC_APP_ENV in build.envVariables in zerops.yaml.
const appEnv = process.env.NEXT_PUBLIC_APP_ENV ?? 'development'

const nextVersion = pkg.dependencies.next.replace(/^\^/, '')

export default function Home() {
  return (
    <main>
      <h1>Hello from Zerops!</h1>
      <p className="subtitle">
        Next.js {nextVersion} &middot; Static Export
      </p>
      <div className="info">
        <span className="label">Environment</span>
        <span className="value">{appEnv}</span>
        <span className="label">Built at</span>
        <span className="value">{buildTime}</span>
      </div>
    </main>
  )
}
