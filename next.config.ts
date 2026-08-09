import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Static export — produces plain HTML/CSS/JS in 'out/'.
  // Required for Zerops static service (Nginx-served).
  output: 'export',
  // Default image loader needs a server; disable for static export.
  images: { unoptimized: true },
  // Allow Zerops subdomain to load Next.js dev assets (HMR / chunks).
  allowedDevOrigins: [
    'appdev-24c5-3000.prg1.zerops.app',
    '*.prg1.zerops.app',
  ],
}

export default nextConfig
