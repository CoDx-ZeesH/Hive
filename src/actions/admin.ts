"use server";

import { revalidatePath } from "next/cache";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import type { UserRole } from "@/generated/prisma/enums";

/**
 * Helper to initialize Supabase Admin client with Service Role Key
 */
function getSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      "Missing SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_URL environment variables."
    );
  }

  return createSupabaseClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

/**
 * Helper to verify authenticated Admin user
 */
async function requireAdminUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized: Please sign in.");

  const dbUser = await prisma.user.findUnique({ where: { authId: user.id } });
  if (!dbUser || dbUser.role !== "ADMIN") {
    throw new Error("Unauthorized: Admin permissions required.");
  }
  return dbUser;
}

/**
 * updateUserRole — Server Action
 * Updates a user's role in the Prisma database AND in Supabase Auth user_metadata.
 */
export async function updateUserRole(
  userId: string,
  newRole: UserRole
): Promise<{ success: boolean; message?: string }> {
  try {
    // 1. Verify admin authority
    await requireAdminUser();

    // 2. Validate role string
    const validRoles: UserRole[] = ["MEMBER", "ORGANIZER", "ADMIN"];
    if (!validRoles.includes(newRole)) {
      return { success: false, message: "Invalid role specified." };
    }

    // 3. Update target user role in Prisma
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role: newRole },
    });

    // 4. Update role in Supabase Auth user_metadata using Service Role Key
    if (updatedUser.authId) {
      try {
        const supabaseAdmin = getSupabaseAdmin();
        const { error: authError } = await supabaseAdmin.auth.admin.updateUserById(
          updatedUser.authId,
          {
            user_metadata: { role: newRole },
          }
        );

        if (authError) {
          console.warn("[updateUserRole] Supabase Auth update warning:", authError.message);
        }
      } catch (authErr) {
        console.error("[updateUserRole] Failed to sync Supabase Auth metadata:", authErr);
      }
    }

    // 5. Revalidate paths for real-time UI updates
    revalidatePath("/admin/members");
    revalidatePath("/admin/users");
    revalidatePath("/admin");

    return {
      success: true,
      message: `Updated ${updatedUser.fullName}'s role to [${newRole}] in DB & Supabase Auth.`,
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Failed to update role.";
    return { success: false, message: errorMsg };
  }
}
