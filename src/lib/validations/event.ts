import { z } from "zod";

/**
 * Zod v4 schemas for Event creation and management.
 */

export const createEventSchema = z
  .object({
    title: z
      .string()
      .min(4, { error: "Title must be at least 4 characters" })
      .max(120, { error: "Title must be 120 characters or less" })
      .trim(),
    description: z
      .string()
      .max(2000, { error: "Description must be 2000 characters or less" })
      .optional(),
    location: z
      .string()
      .max(200, { error: "Location must be 200 characters or less" })
      .optional(),
    isOnline: z.enum(["true", "false"]).transform((v) => v === "true"),
    meetLink: z
      .string()
      .url({ error: "Please enter a valid meeting URL" })
      .optional()
      .or(z.literal("")),
    startAt: z.string().min(1, { error: "Start date and time is required" }),
    endAt: z.string().min(1, { error: "End date and time is required" }),
    capacity: z
      .string()
      .optional()
      .transform((v) => (v ? parseInt(v, 10) : undefined))
      .pipe(
        z
          .number()
          .min(1, { error: "Capacity must be at least 1" })
          .max(10000, { error: "Capacity must be 10,000 or less" })
          .optional()
      ),
    status: z.enum(["DRAFT", "PUBLISHED"]).default("DRAFT"),
  })
  .refine(
    (data) => {
      if (!data.startAt || !data.endAt) return true;
      return new Date(data.endAt) > new Date(data.startAt);
    },
    { error: "End time must be after start time", path: ["endAt"] }
  );

export const updateEventSchema = createEventSchema.partial().extend({
  status: z.enum(["DRAFT", "PUBLISHED", "CANCELLED", "COMPLETED"]).optional(),
});

export type CreateEventInput = z.infer<typeof createEventSchema>;
export type UpdateEventInput = z.infer<typeof updateEventSchema>;

export type EventFormState =
  | {
      errors?: {
        title?: string[];
        description?: string[];
        location?: string[];
        meetLink?: string[];
        startAt?: string[];
        endAt?: string[];
        capacity?: string[];
      };
      message?: string;
      success?: boolean;
      eventId?: string;
    }
  | undefined;
