import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

/**
 * Prisma v7 Client singleton for Next.js — uses the new TS engine (prisma-client
 * generator) which requires a driver adapter instead of the old Rust query engine.
 *
 * We use @prisma/adapter-pg (PostgreSQL / Supabase compatible).
 *
 * DATABASE_URL  — pooled Supabase connection string (for queries)
 * DIRECT_URL    — direct (non-pooled) connection string (for migrations)
 *
 * In development, a global variable prevents multiple PrismaClient instances
 * being created due to hot module replacement (HMR).
 */

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    // During build / CI without a real DB, return a no-op proxy so imports
    // don't crash at module evaluation time. Queries will throw at runtime.
    console.warn(
      "[prisma] DATABASE_URL is not set. Prisma queries will fail at runtime."
    );
    // We still need to return something — use a dummy URL so the adapter
    // doesn't throw at construction.
    const adapter = new PrismaPg({ connectionString: "postgresql://localhost/noop" });
    return new PrismaClient({ adapter });
  }

  const adapter = new PrismaPg({ connectionString });
  return new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === "development"
        ? ["error", "warn"]
        : ["error"],
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
