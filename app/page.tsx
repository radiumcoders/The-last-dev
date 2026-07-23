import { appEnv, buildTime } from '@/lib/site'

export default function Home() {
  return (
    <main>
      <h1>Hello from Zerops!</h1>
      <p className="subtitle">Next.js Static Export</p>
      <div className="info">
        <span className="label">Environment</span>
        <span className="value">{appEnv}</span>
        <span className="label">Built at</span>
        <span className="value">{buildTime}</span>
      </div>
    </main>
  )
}
