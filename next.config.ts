import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Static export — produces plain HTML/CSS/JS in 'out/'.
  // Required for Zerops static service (Nginx-served).
  output: 'export',
  // Default image loader needs a server; disable for static export.
  images: { unoptimized: true },
}

export default nextConfig
