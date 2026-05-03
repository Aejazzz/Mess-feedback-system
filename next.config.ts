import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Prisma uses native binaries; bundling it with Turbopack can cause "Cannot fetch data from service" in dev.
  serverExternalPackages: ["@prisma/client", "prisma"],
};

export default nextConfig;
