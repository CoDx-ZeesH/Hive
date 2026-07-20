"use client";

import { useActionState } from "react";
import Link from "next/link";
import { registerAction } from "@/actions/auth";
import type { AuthFormState } from "@/lib/validations/auth";

/**
 * RegisterForm — Client Component
 *
 * Design: "Hack Club meets Linear"
 * - useActionState for progressive enhancement
 * - Field-level Zod validation errors
 * - Password strength requirements displayed inline
 */
export function RegisterForm() {
  const [state, action, isPending] = useActionState<AuthFormState, FormData>(
    registerAction,
    undefined
  );

  return (
    <form action={action} className="flex flex-col gap-5" noValidate>
      {/* Success message */}
      {state?.success && state.message && (
        <div
          className="flex items-start gap-2.5 px-4 py-3 rounded-xl border text-sm"
          style={{
            background: "#f0fdf4",
            borderColor: "#86efac",
            color: "#16a34a",
          }}
          role="status"
        >
          <span className="mt-0.5 shrink-0">✓</span>
          <span>{state.message}</span>
        </div>
      )}

      {/* Global error */}
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

      {/* Full name */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="fullName"
          className="text-xs font-semibold uppercase tracking-wider"
          style={{ fontFamily: "var(--font-mono)", color: "var(--hive-muted)" }}
        >
          FULL_NAME
        </label>
        <input
          id="fullName"
          name="fullName"
          type="text"
          autoComplete="name"
          required
          placeholder="Jane Doe"
          className="hive-input w-full px-4 py-3 text-sm"
          style={{ color: "var(--hive-text)", fontFamily: "var(--font-sans)" }}
          aria-describedby={
            state?.errors?.fullName ? "fullName-error" : undefined
          }
          aria-invalid={!!state?.errors?.fullName}
        />
        {state?.errors?.fullName && (
          <p
            id="fullName-error"
            className="text-xs"
            style={{ color: "var(--hive-error)", fontFamily: "var(--font-mono)" }}
          >
            {state.errors.fullName[0]}
          </p>
        )}
      </div>

      {/* Email */}
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
          style={{ color: "var(--hive-text)", fontFamily: "var(--font-sans)" }}
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

      {/* Password */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="password"
          className="text-xs font-semibold uppercase tracking-wider"
          style={{ fontFamily: "var(--font-mono)", color: "var(--hive-muted)" }}
        >
          PASSWORD
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          placeholder="••••••••"
          className="hive-input w-full px-4 py-3 text-sm"
          style={{ color: "var(--hive-text)" }}
          aria-describedby="password-requirements password-error"
          aria-invalid={!!state?.errors?.password}
        />
        {state?.errors?.password ? (
          <ul
            id="password-error"
            className="flex flex-col gap-0.5"
            style={{ color: "var(--hive-error)" }}
          >
            {state.errors.password.map((err) => (
              <li
                key={err}
                className="text-xs"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                ✗ {err}
              </li>
            ))}
          </ul>
        ) : (
          <p
            id="password-requirements"
            className="text-xs"
            style={{ color: "var(--hive-muted)", fontFamily: "var(--font-mono)" }}
          >
            MIN_8_CHARS · 1_UPPERCASE · 1_NUMBER
          </p>
        )}
      </div>

      {/* Confirm Password */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="confirmPassword"
          className="text-xs font-semibold uppercase tracking-wider"
          style={{ fontFamily: "var(--font-mono)", color: "var(--hive-muted)" }}
        >
          CONFIRM_PASSWORD
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          required
          placeholder="••••••••"
          className="hive-input w-full px-4 py-3 text-sm"
          style={{ color: "var(--hive-text)" }}
          aria-describedby={
            state?.errors?.confirmPassword
              ? "confirmPassword-error"
              : undefined
          }
          aria-invalid={!!state?.errors?.confirmPassword}
        />
        {state?.errors?.confirmPassword && (
          <p
            id="confirmPassword-error"
            className="text-xs"
            style={{ color: "var(--hive-error)", fontFamily: "var(--font-mono)" }}
          >
            {state.errors.confirmPassword[0]}
          </p>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        id="register-submit"
        disabled={isPending || state?.success === true}
        className="hive-btn w-full py-3.5 text-white text-sm"
        style={{
          background:
            isPending || state?.success
              ? "var(--hive-primary-hover)"
              : "var(--hive-primary)",
          cursor:
            isPending || state?.success ? "not-allowed" : "pointer",
          opacity: isPending || state?.success ? 0.8 : 1,
        }}
      >
        {isPending ? "CREATING_ACCOUNT..." : "CREATE_ACCOUNT"}
      </button>

      {/* Terms notice */}
      <p
        className="text-center text-xs leading-relaxed"
        style={{ color: "var(--hive-muted)", fontFamily: "var(--font-sans)" }}
      >
        By joining, you agree to Hive&apos;s{" "}
        <Link
          href="/terms"
          className="hover:underline"
          style={{ color: "var(--hive-primary)" }}
        >
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link
          href="/privacy"
          className="hover:underline"
          style={{ color: "var(--hive-primary)" }}
        >
          Privacy Policy
        </Link>
        .
      </p>

      {/* Login link */}
      <p
        className="text-center text-sm"
        style={{ color: "var(--hive-muted)", fontFamily: "var(--font-sans)" }}
      >
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-semibold hover:underline"
          style={{
            color: "var(--hive-primary)",
            fontFamily: "var(--font-mono)",
          }}
        >
          SIGN_IN →
        </Link>
      </p>
    </form>
  );
}
