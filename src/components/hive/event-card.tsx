import Link from "next/link";
import { CalendarDays, MapPin, Clock, Users, Wifi } from "lucide-react";
import { formatEventDate, formatEventTime } from "@/lib/utils";

interface EventCardProps {
  event: {
    id: string;
    title: string;
    slug: string;
    description?: string | null;
    location?: string | null;
    isOnline: boolean;
    startAt: Date;
    endAt: Date;
    status: string;
    capacity?: number | null;
    _count?: { registrations: number };
  };
  /** href override — defaults to /member/events/[id] */
  href?: string;
  /** show organizer controls (edit, status badge) */
  organizer?: boolean;
}

const statusStyles: Record<string, { bg: string; color: string; label: string }> = {
  DRAFT:     { bg: "var(--hive-surface)",     color: "var(--hive-muted)",    label: "DRAFT"     },
  PUBLISHED: { bg: "var(--hive-primary-light)", color: "var(--hive-primary)", label: "PUBLISHED" },
  CANCELLED: { bg: "#fef2f2",                color: "#dc2626",              label: "CANCELLED" },
  COMPLETED: { bg: "#f0fdf4",                color: "var(--hive-success)",  label: "COMPLETED" },
};

export function EventCard({ event, href, organizer = false }: EventCardProps) {
  const link = href ?? `/member/events/${event.id}`;
  const s = statusStyles[event.status] ?? statusStyles.DRAFT;
  const spotsLeft =
    event.capacity != null && event._count
      ? event.capacity - event._count.registrations
      : null;

  return (
    <Link
      href={link}
      className="hive-card flex flex-col gap-4 p-5 group"
    >
      {/* Top row: date block + title */}
      <div className="flex items-start gap-4">
        {/* Date block */}
        <div
          className="flex flex-col items-center justify-center w-14 h-14 rounded-xl shrink-0 text-white"
          style={{ background: "var(--hive-primary)" }}
        >
          <span
            className="text-[10px] font-bold uppercase leading-none"
            style={{ fontFamily: "var(--font-mono)", opacity: 0.8 }}
          >
            {formatEventDate(event.startAt).month}
          </span>
          <span
            className="text-2xl font-bold leading-tight"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            {formatEventDate(event.startAt).day}
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            {/* Status badge — organizer only */}
            {organizer && (
              <span
                className="hive-badge text-[10px]"
                style={{ color: s.color, background: s.bg, borderColor: s.bg }}
              >
                {s.label}
              </span>
            )}
            {/* Format badge */}
            <span
              className="hive-badge text-[10px]"
              style={{
                color: "var(--hive-muted)",
                background: "var(--hive-surface)",
                borderColor: "var(--hive-border)",
              }}
            >
              {event.isOnline ? "ONLINE" : "IN_PERSON"}
            </span>
          </div>
          <h3
            className="text-sm font-bold leading-snug group-hover:text-[var(--hive-primary)] transition-colors"
            style={{ color: "var(--hive-text)" }}
          >
            {event.title}
          </h3>
          {event.description && (
            <p
              className="text-xs mt-1 line-clamp-2"
              style={{ color: "var(--hive-muted)" }}
            >
              {event.description}
            </p>
          )}
        </div>
      </div>

      {/* Meta row */}
      <div
        className="flex items-center gap-4 text-xs flex-wrap"
        style={{ color: "var(--hive-muted)", fontFamily: "var(--font-mono)" }}
      >
        <span className="flex items-center gap-1">
          <Clock size={12} />
          {formatEventTime(event.startAt)} – {formatEventTime(event.endAt)}
        </span>
        {event.isOnline ? (
          <span className="flex items-center gap-1">
            <Wifi size={12} /> Online
          </span>
        ) : event.location ? (
          <span className="flex items-center gap-1 truncate max-w-[180px]">
            <MapPin size={12} /> {event.location}
          </span>
        ) : null}
        {event._count !== undefined && (
          <span className="flex items-center gap-1 ml-auto">
            <Users size={12} />
            {event._count.registrations}
            {event.capacity ? `/${event.capacity}` : ""} RSVP
          </span>
        )}
        {spotsLeft !== null && spotsLeft <= 5 && spotsLeft > 0 && (
          <span
            className="hive-badge text-[10px] ml-auto"
            style={{
              color: "var(--hive-accent)",
              background: "#ffe4e4",
              borderColor: "#ffe4e4",
            }}
          >
            {spotsLeft} SPOT{spotsLeft !== 1 ? "S" : ""}_LEFT
          </span>
        )}
        {spotsLeft === 0 && (
          <span
            className="hive-badge text-[10px] ml-auto"
            style={{ color: "#dc2626", background: "#fef2f2", borderColor: "#fef2f2" }}
          >
            FULL
          </span>
        )}
      </div>

      {/* Organizer quick-actions */}
      {organizer && (
        <div
          className="pt-3 border-t flex items-center gap-2"
          style={{ borderColor: "var(--hive-border)" }}
        >
          <Link
            href={`/organizer/events/${event.id}`}
            className="hive-btn px-3 py-1.5 text-[11px]"
            style={{
              background: "var(--hive-primary-light)",
              color: "var(--hive-primary)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            MANAGE
          </Link>
          <Link
            href={`/organizer/events/${event.id}/attendance`}
            className="hive-btn px-3 py-1.5 text-[11px]"
            style={{
              background: "var(--hive-surface)",
              color: "var(--hive-muted)",
              border: "1px solid var(--hive-border)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            ATTENDANCE
          </Link>
        </div>
      )}
    </Link>
  );
}
