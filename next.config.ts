import type { NextConfig } from 'next';

// Static export: `npm run build` writes a plain HTML site to ./out,
// which any host (Netlify, Cloudflare Pages, GitHub Pages...) can serve.
// BASE_PATH is set only for the GitHub Pages preview (served under /twopixeldev).
const basePath = process.env.BASE_PATH || '';

const nextConfig: NextConfig = {
  output: 'export',
  basePath,
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
  images: { unoptimized: true },
  trailingSlash: true,
};

export default nextConfig;
