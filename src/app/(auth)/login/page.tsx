import type { Metadata } from "next";
import { AuthCard } from "@/components/hive/auth-card";
import { LoginForm } from "@/components/hive/login-form";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your Hive account to access your community dashboard.",
};

/**
 * Login page — Server Component shell.
 * Client-side form logic handled by <LoginForm />.
 */
export default function LoginPage() {
  return (
    <AuthCard
      title="Welcome back"
      subtitle="Sign in to your community dashboard"
    >
      <LoginForm />
    </AuthCard>
  );
}
