import type { Metadata } from "next";
import { AuthCard } from "@/components/hive/auth-card";
import { RegisterForm } from "@/components/hive/register-form";

export const metadata: Metadata = {
  title: "Join Hive",
  description:
    "Create your Hive account and join a student developer community near you.",
};

/**
 * Register page — Server Component shell.
 * Client-side form logic handled by <RegisterForm />.
 */
export default function RegisterPage() {
  return (
    <AuthCard
      title="Join the community"
      subtitle="Create your account and start building together"
    >
      <RegisterForm />
    </AuthCard>
  );
}
