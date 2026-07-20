import { z } from "zod";

/* ─── Event Categories (display tags) ─────────────────────────────────────── */

export const eventCategorySchema = z.enum([
  "WORKSHOP",
  "HACKATHON",
  "COMMUNITY",
  "MEETUP",
  "TALK",
]);

export type EventCategory = z.infer<typeof eventCategorySchema>;

/* ─── Create Event ─────────────────────────────────────────────────────────── */

export const createEventSchema = z
  .object({
    title: z
      .string()
      .min(3, { error: "Title must be at least 3 characters" })
      .max(120, { error: "Title is too long (max 120 characters)" })
      .trim(),
    description: z
      .string()
      .max(5000, { error: "Description is too long" })
      .optional()
      .or(z.literal("")),
    communityId: z
      .string()
      .min(1, { error: "Community is required" }),
    category: eventCategorySchema.default("COMMUNITY"),
    location: z
      .string()
      .max(200, { error: "Location is too long" })
      .optional()
      .or(z.literal("")),
    isOnline: z.coerce.boolean().default(false),
    meetLink: z
      .string()
      .url({ error: "Please enter a valid meeting URL" })
      .optional()
      .or(z.literal("")),
    startAt: z
      .string()
      .min(1, { error: "Start date is required" }),
    endAt: z
      .string()
      .min(1, { error: "End date is required" }),
    capacity: z
      .union([
        z.literal(""),
        z.coerce
          .number()
          .int({ error: "Capacity must be a whole number" })
          .positive({ error: "Capacity must be greater than 0" }),
      ])
      .optional(),
    status: z.enum(["DRAFT", "PUBLISHED"]).default("DRAFT"),
  })
  .refine(
    (data) => {
      const start = new Date(data.startAt);
      const end = new Date(data.endAt);
      return end > start;
    },
    { error: "End time must be after start time", path: ["endAt"] }
  )
  .refine(
    (data) => {
      if (data.isOnline) return Boolean(data.meetLink);
      return Boolean(data.location?.trim());
    },
    {
      error: "Online events need a meeting link; in-person events need a location",
      path: ["location"],
    }
  );

export type CreateEventInput = z.infer<typeof createEventSchema>;

/* ─── Form State ─────────────────────────────────────────────────────────── */

export type EventFormState =
  | {
      success?: boolean;
      message?: string;
      errors?: Partial<Record<keyof CreateEventInput, string[]>>;
    }
  | undefined;

/* ─── RSVP ─────────────────────────────────────────────────────────────────── */

export const rsvpSchema = z.object({
  eventId: z.string().uuid({ error: "Invalid event ID" }),
});
