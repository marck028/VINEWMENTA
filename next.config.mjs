/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true
  },
  basePath: process.env.NODE_ENV === 'production' ? '/MENTA-VISUALIZADOR-VF' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/MENTA-VISUALIZADOR-VF/' : '',
}

export default nextConfig
