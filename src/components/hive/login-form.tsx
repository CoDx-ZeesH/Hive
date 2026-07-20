"use client";

import { useActionState } from "react";
import Link from "next/link";
import { loginAction } from "@/actions/auth";
import type { AuthFormState } from "@/lib/validations/auth";

/**
 * LoginForm — Client Component
 *
 * Design: "Hack Club meets Linear"
 * - Plus Jakarta Sans for labels and helper text
 * - JetBrains Mono (uppercase) for the submit button
 * - White card, rounded corners, flat with soft border
 * - No gradients, no glassmorphism
 * - useActionState for progressive enhancement
 */
export function LoginForm() {
  const [state, action, isPending] = useActionState<AuthFormState, FormData>(
    loginAction,
    undefined
  );

  return (
    <form action={action} className="flex flex-col gap-5" noValidate>
      {/* Global error / success message */}
      {state?.message && !state.success && (
        <div
          className="flex items-start gap-2.5 px-4 py-3 rounded-xl border text-sm"
          style={{
            background: "#fef2f2",
            borderColor: "#fecaca",
            color: "#dc2626",
          }}
          role="alert"
        >
          <span className="mt-0.5 shrink-0">⚠</span>
          <span>{state.message}</span>
        </div>
      )}

      {/* Email field */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="email"
          className="text-xs font-semibold uppercase tracking-wider"
          style={{ fontFamily: "var(--font-mono)", color: "var(--hive-muted)" }}
        >
          EMAIL_ADDRESS
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="you@example.com"
          className="hive-input w-full px-4 py-3 text-sm"
          style={{
            color: "var(--hive-text)",
            fontFamily: "var(--font-sans)",
          }}
          aria-describedby={state?.errors?.email ? "email-error" : undefined}
          aria-invalid={!!state?.errors?.email}
        />
        {state?.errors?.email && (
          <p
            id="email-error"
            className="text-xs"
            style={{ color: "var(--hive-error)", fontFamily: "var(--font-mono)" }}
          >
            {state.errors.email[0]}
          </p>
        )}
      </div>

      {/* Password field */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label
            htmlFor="password"
            className="text-xs font-semibold uppercase tracking-wider"
            style={{
              fontFamily: "var(--font-mono)",
              color: "var(--hive-muted)",
            }}
          >
            PASSWORD
          </label>
          <Link
            href="/forgot-password"
            className="text-xs hover:underline"
            style={{
              fontFamily: "var(--font-mono)",
              color: "var(--hive-primary)",
            }}
          >
            FORGOT?
          </Link>
        </div>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          placeholder="••••••••"
          className="hive-input w-full px-4 py-3 text-sm"
          style={{ color: "var(--hive-text)" }}
          aria-describedby={
            state?.errors?.password ? "password-error" : undefined
          }
          aria-invalid={!!state?.errors?.password}
        />
        {state?.errors?.password && (
          <p
            id="password-error"
            className="text-xs"
            style={{ color: "var(--hive-error)", fontFamily: "var(--font-mono)" }}
          >
            {state.errors.password[0]}
          </p>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        id="login-submit"
        disabled={isPending}
        className="hive-btn w-full py-3.5 text-white text-sm relative overflow-hidden"
        style={{
          background: isPending
            ? "var(--hive-primary-hover)"
            : "var(--hive-primary)",
          cursor: isPending ? "not-allowed" : "pointer",
          opacity: isPending ? 0.8 : 1,
        }}
      >
        {isPending ? "SIGNING_IN..." : "SIGN_IN"}
      </button>

      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px" style={{ background: "var(--hive-border)" }} />
        <span
          className="text-xs"
          style={{ fontFamily: "var(--font-mono)", color: "var(--hive-muted)" }}
        >
          OR
        </span>
        <div className="flex-1 h-px" style={{ background: "var(--hive-border)" }} />
      </div>

      {/* Register link */}
      <p
        className="text-center text-sm"
        style={{ color: "var(--hive-muted)", fontFamily: "var(--font-sans)" }}
      >
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="font-semibold hover:underline"
          style={{
            color: "var(--hive-primary)",
            fontFamily: "var(--font-mono)",
          }}
        >
          JOIN_NOW →
        </Link>
      </p>
    </form>
  );
}
