import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" }); // for local dev
// dotenv.config({ path: ".env.local" }); // for vercel deployment
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: 'tsx prisma/seed.ts',
  },
  datasource: {
    url: process.env["DATABASE_URL_UNPOOLED"],
  },
});