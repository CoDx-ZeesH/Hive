import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges Tailwind CSS classes safely, resolving conflicts.
 * Uses clsx for conditional class handling + tailwind-merge for deduplication.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Formats a number with compact notation (e.g. 1200 → 1.2K)
 */
export function formatCompactNumber(n: number): string {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(n);
}

/**
 * Generates a JetBrains Mono–style Hive ID string.
 * e.g. generateHiveId("EVENT", 42) → "EVENT_042"
 */
export function generateHiveId(prefix: string, num: number): string {
  return `${prefix.toUpperCase()}_${String(num).padStart(3, "0")}`;
}

/**
 * Formats a date to a human-readable short string.
 */
export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

/**
 * Formats a date + time.
 */
export function formatDateTime(date: Date | string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(date));
}

/**
 * Returns initials from a full name (up to 2 chars).
 * e.g. "John Doe" → "JD"
 */
export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Truncates a string to maxLength with ellipsis.
 */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return `${str.slice(0, maxLength - 3)}...`;
}

/**
 * Returns { month: "JUL", day: "25" } from a Date — for the date block UI.
 */
export function formatEventDate(date: Date): { month: string; day: string } {
  const d = new Date(date);
  return {
    month: d.toLocaleString("en-US", { month: "short" }).toUpperCase(),
    day: String(d.getDate()).padStart(2, "0"),
  };
}

/**
 * Returns "6:00 PM" format from a Date.
 */
export function formatEventTime(date: Date): string {
  return new Date(date).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}
