import { z } from "zod";

/**
 * Zod v4 auth schemas.
 * NOTE: Zod v4 uses `{ error: '...' }` instead of `{ message: '...' }`
 * for custom validation error messages.
 */

/* ─── Login ──────────────────────────────────────────────────────────────── */

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, { error: "Email is required" })
    .email({ error: "Please enter a valid email address" }),
  password: z
    .string()
    .min(1, { error: "Password is required" }),
});

/* ─── Register ───────────────────────────────────────────────────────────── */

export const registerSchema = z
  .object({
    fullName: z
      .string()
      .min(2, { error: "Name must be at least 2 characters" })
      .max(60, { error: "Name is too long (max 60 characters)" })
      .trim(),
    email: z
      .string()
      .min(1, { error: "Email is required" })
      .email({ error: "Please enter a valid email address" })
      .trim(),
    password: z
      .string()
      .min(8, { error: "Password must be at least 8 characters" })
      .regex(/[A-Z]/, { error: "Must contain at least one uppercase letter" })
      .regex(/[0-9]/, { error: "Must contain at least one number" })
      .trim(),
    confirmPassword: z.string().min(1, { error: "Please confirm your password" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    error: "Passwords do not match",
    path: ["confirmPassword"],
  });

/* ─── Profile ────────────────────────────────────────────────────────────── */

export const profileSchema = z.object({
  fullName: z
    .string()
    .min(2, { error: "Name must be at least 2 characters" })
    .max(60, { error: "Name is too long" })
    .trim(),
  bio: z
    .string()
    .max(300, { error: "Bio must be 300 characters or less" })
    .optional(),
  skills: z.array(z.string()).max(10, { error: "Maximum 10 skills" }).optional(),
  githubUrl: z
    .string()
    .url({ error: "Please enter a valid URL" })
    .optional()
    .or(z.literal("")),
  linkedinUrl: z
    .string()
    .url({ error: "Please enter a valid URL" })
    .optional()
    .or(z.literal("")),
  portfolioUrl: z
    .string()
    .url({ error: "Please enter a valid URL" })
    .optional()
    .or(z.literal("")),
});

/* ─── Inferred Types ─────────────────────────────────────────────────────── */

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ProfileInput = z.infer<typeof profileSchema>;

/* ─── Form State ─────────────────────────────────────────────────────────── */

export type AuthFormState =
  | {
      errors?: {
        fullName?: string[];
        email?: string[];
        password?: string[];
        confirmPassword?: string[];
      };
      message?: string;
      success?: boolean;
    }
  | undefined;
