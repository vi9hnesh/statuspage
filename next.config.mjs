/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  
  // Allow custom domains in development
  experimental: {
    allowedDevOrigins: [
      'http://status.acme.com:3001',
      'https://status.acme.com',
      // Add more custom domains as needed
    ]
  }
}

export default nextConfig
