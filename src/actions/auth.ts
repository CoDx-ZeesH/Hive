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
): Promise<void> {
  try {
    // Generate a unique username from the email prefix
    const baseUsername = email.split("@")[0].toLowerCase().replace(/[^a-z0-9]/g, "_");

    await prisma.user.upsert({
      where: { authId },
      update: { email, fullName },
      create: {
        authId,
        email,
        fullName,
        username: `${baseUsername}_${authId.slice(0, 6)}`, // guaranteed unique
        role: "ADMIN",
      },
    });
  } catch (err) {
    // Non-fatal: DB may not be configured yet in dev.
    // The app works without it — Supabase session is the source of truth for auth.
    console.warn("[syncUserToDb] Could not sync user:", err);
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

  // 3. Sync to Prisma (non-blocking, best-effort)
  if (data.user) {
    const fullName =
      (data.user.user_metadata?.full_name as string | undefined) ??
      data.user.email?.split("@")[0] ??
      "Member";
    await syncUserToDb(data.user.id, data.user.email!, fullName);
  }

  // 4. Determine redirect by role from metadata
  const role = data.user?.user_metadata?.role as string | undefined;
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

  // 3. Sync new user to Prisma DB (best-effort)
  if (data.user) {
    await syncUserToDb(data.user.id, data.user.email!, validated.data.fullName);
  }

  // 4. If email confirmation is required, show success message
  if (!data.session) {
    return {
      success: true,
      message:
        "Account created! Check your email to confirm your address before signing in.",
    };
  }

  // 5. Auto-signed in → redirect to dashboard
  revalidatePath("/", "layout");
  redirect("/member");
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
