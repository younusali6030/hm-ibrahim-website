/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
    ],
  },
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  async redirects() {
    return [
      { source: '/categories/iron-steel', destination: '/categories/structural-items', permanent: true },
      // Small categories folded into bigger ones.
      { source: '/categories/frp-bars', destination: '/categories/structural-items', permanent: true },
      { source: '/categories/fibermesh', destination: '/categories/structural-items', permanent: true },
      { source: '/categories/chicken-mesh', destination: '/categories/wiremesh', permanent: true },
      { source: '/categories/plastic-hexa', destination: '/categories/wiremesh', permanent: true },
      // One contact path: the quote form lives on /contact. Query strings (product, category, brand) carry over.
      { source: '/quote', destination: '/contact', permanent: true },
      { source: '/quote/success', destination: '/contact/success', permanent: true },
      { source: '/post-purchase', destination: '/contact', permanent: true },
      { source: '/purchase', destination: '/contact', permanent: true },
    ];
  },
};

export default nextConfig;
