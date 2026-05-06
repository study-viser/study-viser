import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['pg', 'bcrypt', '@prisma/adapter-pg'],
};

export default nextConfig;
