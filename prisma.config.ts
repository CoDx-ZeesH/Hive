import "dotenv/config";
import { defineConfig } from "prisma/config";

/**
 * Prisma v7 config — correct API per @prisma/config type definitions.
 *
 * In Prisma v7:
 * - datasource.url  → used by prisma db push / migrate / introspect
 * - schema.prisma datasource block → provider only, NO url/directUrl
 *
 * dotenv/config is imported first so .env / .env.local vars are available
 * when the Prisma CLI executes this file.
 */
export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: process.env.DIRECT_URL ?? process.env.DATABASE_URL ?? "",
  },
});