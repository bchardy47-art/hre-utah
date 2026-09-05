import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const projectDir = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(projectDir, "..");

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  turbopack: {
    root: repoRoot,
  },
};

export default nextConfig;
