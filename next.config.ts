import type { NextConfig } from "next";

const toOriginHost = (value: string | undefined) => {
  if (!value?.trim()) return undefined;

  const candidate = value.trim();
  try {
    return new URL(candidate.includes('://') ? candidate : `https://${candidate}`).host;
  } catch {
    throw new Error(`Invalid Server Action origin: ${candidate}`);
  }
};

const serverActionOrigins = [
  ...(process.env.SERVER_ACTION_ALLOWED_ORIGINS?.split(',') ?? []),
  process.env.VERCEL_PROJECT_PRODUCTION_URL,
  process.env.VERCEL_BRANCH_URL,
  process.env.VERCEL_URL,
]
  .map(toOriginHost)
  .filter((origin): origin is string => Boolean(origin));

const nextConfig: NextConfig = {
  experimental: {
    // Server Actions compare Origin with the proxy-facing Host header. Production
    // deployments behind a CDN/reverse proxy must explicitly trust public hosts.
    serverActions: {
      allowedOrigins: [...new Set(serverActionOrigins)],
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
    ],
  }
};

export default nextConfig;
