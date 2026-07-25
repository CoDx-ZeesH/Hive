"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { loginSchema, registerSchema } from "@/lib/validations/auth";
import type { AuthFormState } from "@/lib/validations/auth";

/* ─── Helper: sync Supabase user → Prisma DB user ─────────────────────────── */

async function syncUserToDb(
  authId: string,
  email: string,
  fullName: string
): Promise<string | null> {
  try {
    const baseUsername = email.split("@")[0].toLowerCase().replace(/[^a-z0-9]/g, "_");
    const uniqueUsername = `${baseUsername}_${authId.slice(0, 6)}`;

    // 1. Look up the existing user
    const existingUser = await prisma.user.findFirst({ where: { email } });

    let finalRole: string;

    if (existingUser) {
      // 2. Update if they exist
      const updatedUser = await prisma.user.update({
        where: { id: existingUser.id },
        data: { authId, fullName },
        select: { role: true },
      });
      finalRole = updatedUser.role;
    } else {
      // 3. Create if they are new
      const createdUser = await prisma.user.create({
        data: {
          authId,
          email,
          fullName,
          username: uniqueUsername,
          skills: [],
          interests: [],
        },
        select: { role: true },
      });
      finalRole = createdUser.role;
    }

    // TypeScript now guarantees finalRole is a string!
    return finalRole;
  } catch (err) {
    console.error("[syncUserToDb] Prisma failed to sync user:", err);
    return null;
  }
}

/* ─────────────────────────────────────────────────────────────────────────────
   LOGIN
   ───────────────────────────────────────────────────────────────────────────── */

export async function loginAction(
  _state: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const raw = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  // 1. Validate input shape
  const validated = loginSchema.safeParse(raw);
  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  // 2. Attempt Supabase sign-in
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email: validated.data.email,
    password: validated.data.password,
  });

  if (error) {
    return {
      message:
        error.message === "Invalid login credentials"
          ? "Invalid email or password. Please try again."
          : error.message,
    };
  }

  // 3. Sync to Prisma & Fetch ACTUAL role
  let role: string | undefined = undefined;

  if (data.user) {
    const fullName =
      (data.user.user_metadata?.full_name as string | undefined) ??
      data.user.email?.split("@")[0] ??
      "Member";

    // FIX 3: Get the role directly from your Prisma database
    const dbRole = await syncUserToDb(data.user.id, data.user.email!, fullName);
    
    // Fallback to Supabase metadata if DB fetch fails
    role = dbRole ?? (data.user.user_metadata?.role as string | undefined);
  }

  // 4. Determine redirect by actual Prisma DB role
  const dest = role === "ADMIN" ? "/admin" : role === "ORGANIZER" ? "/organizer" : "/member";

  revalidatePath("/", "layout");
  redirect(dest);
}

/* ─────────────────────────────────────────────────────────────────────────────
   REGISTER
   ───────────────────────────────────────────────────────────────────────────── */

export async function registerAction(
  _state: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const raw = {
    fullName: formData.get("fullName") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    confirmPassword: formData.get("confirmPassword") as string,
  };

  // 1. Validate
  const validated = registerSchema.safeParse(raw);
  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  // 2. Sign up via Supabase Auth
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email: validated.data.email,
    password: validated.data.password,
    options: {
      data: {
        full_name: validated.data.fullName,
        role: "MEMBER",
      },
    },
  });

  if (error) {
    return {
      message:
        error.message.includes("already registered")
          ? "An account with this email already exists. Please sign in."
          : error.message,
    };
  }

  let dest = "/member";

  // 3. Sync new user to Prisma DB 
  if (data.user) {
    const dbRole = await syncUserToDb(data.user.id, data.user.email!, validated.data.fullName);
    if (dbRole === "ADMIN") dest = "/admin";
    if (dbRole === "ORGANIZER") dest = "/organizer";
  }

  // 4. If email confirmation is required, show success message
  if (!data.session) {
    return {
      success: true,
      message:
        "Account created! Check your email to confirm your address before signing in.",
    };
  }

  // 5. Auto-signed in → redirect based on DB role
  revalidatePath("/", "layout");
  redirect(dest);
}

/* ─────────────────────────────────────────────────────────────────────────────
  LOGOUT
   ───────────────────────────────────────────────────────────────────────────── */

export async function logoutAction(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}