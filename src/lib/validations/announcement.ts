import { z } from "zod";

/**
 * Zod v4 schemas for Announcements.
 */

export const createAnnouncementSchema = z.object({
  title: z
    .string()
    .min(4, { error: "Title must be at least 4 characters" })
    .max(120, { error: "Title must be 120 characters or less" })
    .trim(),
  content: z
    .string()
    .min(10, { error: "Content must be at least 10 characters" })
    .max(5000, { error: "Content must be 5000 characters or less" })
    .trim(),
  isPinned: z
    .enum(["true", "false"])
    .transform((v) => v === "true")
    .default(false),
});

export type CreateAnnouncementInput = z.infer<typeof createAnnouncementSchema>;

export type AnnouncementFormState =
  | {
      errors?: {
        title?: string[];
        content?: string[];
      };
      message?: string;
      success?: boolean;
    }
  | undefined;
