import { PrismaClient } from "@prisma/client";

/**
 * Prisma Client singleton for Next.js.
 *
 * In development, we use a global variable to prevent multiple instances
 * being created due to hot module replacement (HMR).
 * In production, a single instance is created and reused.
 */

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
