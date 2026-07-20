import type { EventCategory } from "@/lib/validations/events";

const CATEGORY_PREFIX = "<!--hive-category:";

/**
 * Embeds the event category in the description for MVP storage
 * until a dedicated schema field is added.
 */
export function embedCategoryInDescription(
  description: string | undefined,
  category: EventCategory
): string | null {
  const body = description?.trim() ?? "";
  const tag = `${CATEGORY_PREFIX}${category}-->`;
  if (!body) return tag;
  return `${tag}\n${body}`;
}

/**
 * Extracts the embedded category tag from an event description.
 */
export function extractCategoryFromDescription(
  description: string | null | undefined
): EventCategory {
  const match = description?.match(
    /^<!--hive-category:(WORKSHOP|HACKATHON|COMMUNITY|MEETUP|TALK)-->/
  );
  if (match?.[1]) return match[1] as EventCategory;
  return "COMMUNITY";
}

/**
 * Strips the category tag from description for display.
 */
export function stripCategoryFromDescription(
  description: string | null | undefined
): string | null {
  if (!description) return null;
  const stripped = description
    .replace(/^<!--hive-category:[A-Z_]+-->\n?/, "")
    .trim();
  return stripped || null;
}

/**
 * Generates a URL-safe slug from a title.
 */
export function generateEventSlug(title: string): string {
  const base = title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);

  const suffix = Date.now().toString(36).slice(-4);
  return `${base}-${suffix}`;
}

/**
 * Determines whether an event is upcoming based on its start time.
 */
export function isEventUpcoming(startAt: Date, now = new Date()): boolean {
  return startAt >= now;
}
