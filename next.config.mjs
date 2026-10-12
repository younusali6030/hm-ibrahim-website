/** @type {import('next').NextConfig} */
const nextConfig = {
  // Lets a verification build run beside a dev server without sharing .next.
  distDir: process.env.NEXT_DIST_DIR || ".next",
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24 * 30,
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
    // The quote form accepts one photo or PDF of up to 3 MB; the default 1 MB would reject it before the action runs.
    serverActions: { bodySizeLimit: '4mb' },
  },
  async headers() {
    // Long cache for files in the media folders ONLY. Four of these folder names are also page routes
    // (/products, /products/[slug], /brands, /blog), and a bare "/products/:path*" rule also matched the HTML pages,
    // so browsers and the CDN kept stale pages for 7 days (+30 days stale-while-revalidate). Match by file extension.
    const media = "public, max-age=604800, stale-while-revalidate=2592000";
    const ext = "(jpg|jpeg|png|webp|avif|gif|svg|mp4|webm|vtt)";
    return ["hero", "reels", "stock", "videos", "blog", "products", "brands"].map((dir) => ({
      source: `/${dir}/:path*.${ext}`,
      headers: [{ key: "Cache-Control", value: media }],
    }));
  },
  async redirects() {
    return [
      // Old misspelt brand URL.
      { source: '/brands/boarder', destination: '/brands/border', permanent: true },
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
