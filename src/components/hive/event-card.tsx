import Link from "next/link";
import { CalendarDays, Clock, MapPin, Users } from "lucide-react";
import { formatDate, generateHiveId } from "@/lib/utils";
import type { EventListItem } from "@/actions/events";

interface EventCardProps {
  event: EventListItem;
  href: string;
  showStatus?: boolean;
}

const categoryColors: Record<string, { bg: string; color: string }> = {
  WORKSHOP: { bg: "var(--hive-primary-light)", color: "var(--hive-primary)" },
  HACKATHON: { bg: "#f3e8ff", color: "#a855f7" },
  COMMUNITY: { bg: "#f0fdf4", color: "var(--hive-success)" },
  MEETUP: { bg: "#fef3c7", color: "#d97706" },
  TALK: { bg: "#ffe4e4", color: "var(--hive-accent)" },
};

const statusColors: Record<string, { bg: string; color: string }> = {
  DRAFT: { bg: "var(--hive-surface)", color: "var(--hive-muted)" },
  PUBLISHED: { bg: "#f0fdf4", color: "var(--hive-success)" },
  CANCELLED: { bg: "#fef2f2", color: "var(--hive-error)" },
  COMPLETED: { bg: "var(--hive-primary-light)", color: "var(--hive-primary)" },
};

/**
 * EventCard — reusable card for event list grids.
 */
export function EventCard({ event, href, showStatus = false }: EventCardProps) {
  const categoryStyle =
    categoryColors[event.category] ?? categoryColors.COMMUNITY;
  const statusStyle = statusColors[event.status] ?? statusColors.DRAFT;
  const timeLabel = event.startAt.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
  const locationLabel = event.isOnline
    ? "ONLINE"
    : event.location ?? "TBA";

  return (
    <Link href={href} className="hive-card p-5 flex flex-col gap-4 group">
      {/* Tags row */}
      <div className="flex flex-wrap items-center gap-2">
        <span
          className="hive-badge text-[10px]"
          style={{
            color: event.isUpcoming ? "var(--hive-primary)" : "var(--hive-muted)",
            background: event.isUpcoming
              ? "var(--hive-primary-light)"
              : "var(--hive-surface)",
            borderColor: event.isUpcoming
              ? "var(--hive-primary-light)"
              : "var(--hive-border)",
          }}
        >
          {event.isUpcoming ? "UPCOMING" : "PAST"}
        </span>
        <span
          className="hive-badge text-[10px]"
          style={{
            color: categoryStyle.color,
            background: categoryStyle.bg,
            borderColor: categoryStyle.bg,
          }}
        >
          {event.category}
        </span>
        {event.isOnline && (
          <span
            className="hive-badge text-[10px]"
            style={{
              color: "var(--hive-primary)",
              background: "var(--hive-primary-light)",
              borderColor: "var(--hive-primary-light)",
            }}
          >
            ONLINE
          </span>
        )}
        {showStatus && (
          <span
            className="hive-badge text-[10px]"
            style={{
              color: statusStyle.color,
              background: statusStyle.bg,
              borderColor: statusStyle.bg,
            }}
          >
            {event.status}
          </span>
        )}
      </div>

      {/* Title */}
      <div className="flex-1">
        <p
          className="text-[10px] mb-1"
          style={{ color: "var(--hive-muted)", fontFamily: "var(--font-mono)" }}
        >
          {generateHiveId("EVENT", parseInt(event.id.slice(-3), 16) % 1000)}
        </p>
        <h3
          className="text-base font-bold leading-snug group-hover:text-[var(--hive-primary)] transition-colors"
          style={{ color: "var(--hive-text)" }}
        >
          {event.title}
        </h3>
        {event.description && (
          <p
            className="text-sm mt-1.5 line-clamp-2"
            style={{ color: "var(--hive-muted)" }}
          >
            {event.description}
          </p>
        )}
      </div>

      {/* Meta */}
      <div
        className="flex flex-col gap-1.5 text-xs pt-3 border-t"
        style={{
          borderColor: "var(--hive-border)",
          color: "var(--hive-muted)",
          fontFamily: "var(--font-mono)",
        }}
      >
        <span className="flex items-center gap-1.5">
          <CalendarDays size={12} />
          {formatDate(event.startAt)}
        </span>
        <span className="flex items-center gap-1.5">
          <Clock size={12} />
          {timeLabel}
        </span>
        <span className="flex items-center gap-1.5">
          <MapPin size={12} />
          {locationLabel}
        </span>
        <span className="flex items-center gap-1.5">
          <Users size={12} />
          {event.registrationCount}
          {event.capacity ? ` / ${event.capacity}` : ""} RSVPS
        </span>
      </div>
    </Link>
  );
}
