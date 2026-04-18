import path from 'node:path';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@gamevine/shared'],
  typedRoutes: true,
  turbopack: {
    // Pin the workspace root so Turbopack doesn't pick up an unrelated
    // lockfile higher up the filesystem (e.g. a sibling repo).
    root: path.resolve(__dirname, '../..'),
  },
};

export default nextConfig;
