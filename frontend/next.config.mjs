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
  webpack: (config) => {
    // Allow importing .glb 3D model files as static assets
    config.module.rules.push({
      test: /\.glb$/i,
      type: "asset/resource",
    })

    return config
  },
}

export default nextConfig