import { defineConfig, env } from "prisma/config";

/**
 * Prisma v7 configuration.
 *
 * Connection URLs have moved here from schema.prisma (breaking change in v7).
 * The datasource.url is used by the Prisma client at runtime.
 * The datasource.shadowDatabaseUrl is used during migrations.
 *
 * See: https://pris.ly/d/config-datasource
 */
export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: env("DATABASE_URL"),
  },
});
