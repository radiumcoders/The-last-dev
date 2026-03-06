import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Static export — produces plain HTML/CSS/JS in 'out/'.
  // Required for Zerops static service (Nginx-served).
  output: 'export',
}

export default nextConfig
