import type { Metadata } from 'next'
import './globals.css'

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://nextjs-hello-world.zerops.app'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Next.js Hello World · Zerops',
  description: 'Hello World recipe for Next.js static export on Zerops',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
