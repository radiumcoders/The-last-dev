import type { Metadata } from 'next'
import { Share_Tech_Mono } from 'next/font/google'
import './globals.css'

const terminal = Share_Tech_Mono({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-terminal',
})

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://appdev.zerops.app'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'The Last Developer',
  description:
    'CRT narrative management game — you are the final human employee. Decide, or be automated.',
  icons: { icon: '/favicon.ico' },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#050805',
  viewportFit: 'cover' as const,
  colorScheme: 'dark' as const,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={terminal.variable}>
      <body className={`terminal-body ${terminal.className}`}>{children}</body>
    </html>
  )
}
