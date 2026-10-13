/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  // Pin the tracing root to this project so Next.js doesn't try to infer a
  // workspace root from a parent directory (silences the inference warning
  // and keeps Vercel builds deterministic).
  outputFileTracingRoot: import.meta.dirname,
};

export default nextConfig;
