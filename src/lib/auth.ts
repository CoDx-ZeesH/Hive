import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import type { UserRole } from "@/types";
import type { User } from "@prisma/client";

/**
 * Resolves the Supabase auth session user (or null).
 */
export async function getSessionUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

/**
 * Builds a unique username from an email address.
 */
function usernameFromEmail(email: string): string {
  const base = email
    .split("@")[0]
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, "_")
    .slice(0, 24);
  const suffix = Math.random().toString(36).slice(2, 6);
  return `${base}_${suffix}`;
}

/**
 * Finds or creates the Prisma User row for the current Supabase session.
 */
export async function getCurrentDbUser(): Promise<User | null> {
  const authUser = await getSessionUser();
  if (!authUser?.email) return null;

  const existing = await prisma.user.findUnique({
    where: { authId: authUser.id },
  });

  if (existing) return existing;

  const fullName =
    (authUser.user_metadata?.full_name as string | undefined) ??
    authUser.email.split("@")[0] ??
    "Member";

  const role =
    ((authUser.user_metadata?.role as string | undefined) ?? "MEMBER") as UserRole;

  let username = usernameFromEmail(authUser.email);
  let attempts = 0;

  while (attempts < 5) {
    try {
      return await prisma.user.create({
        data: {
          authId: authUser.id,
          email: authUser.email,
          fullName,
          username,
          role,
          avatarUrl:
            (authUser.user_metadata?.avatar_url as string | undefined) ?? null,
        },
      });
    } catch {
      username = usernameFromEmail(authUser.email);
      attempts += 1;
    }
  }

  return null;
}

/**
 * Requires an authenticated Prisma user or throws.
 */
export async function requireDbUser(): Promise<User> {
  const user = await getCurrentDbUser();
  if (!user) {
    throw new Error("Unauthorized");
  }
  return user;
}

/**
 * Checks whether the user has one of the allowed roles.
 */
export function hasRole(user: User, roles: UserRole[]): boolean {
  return roles.includes(user.role as UserRole);
}

/**
 * Requires organizer or admin role.
 */
export async function requireOrganizer(): Promise<User> {
  const user = await requireDbUser();
  if (!hasRole(user, ["ORGANIZER", "ADMIN"])) {
    throw new Error("Forbidden: organizer role required");
  }
  return user;
}
