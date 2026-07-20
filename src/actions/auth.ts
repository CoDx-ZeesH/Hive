"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { loginSchema, registerSchema } from "@/lib/validations/auth";
import type { AuthFormState } from "@/lib/validations/auth";

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
  const { error } = await supabase.auth.signInWithPassword({
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

  // 3. Redirect to member dashboard on success
  revalidatePath("/", "layout");
  redirect("/member");
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

  // 3. If email confirmation is required, show success message
  if (!data.session) {
    return {
      success: true,
      message:
        "Account created! Check your email to confirm your address before signing in.",
    };
  }

  // 4. Auto-signed in → redirect to dashboard
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
