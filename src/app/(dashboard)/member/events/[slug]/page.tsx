import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  Clock,
  MapPin,
  Users,
  Globe,
  User,
} from "lucide-react";
import { getEventBySlug } from "@/actions/events";
import { RsvpButton } from "@/components/hive/rsvp-button";
import { formatDate, formatDateTime, generateHiveId } from "@/lib/utils";

interface EventDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: EventDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const result = await getEventBySlug(slug);
  if (!result.success) {
    return { title: "Event Not Found" };
  }
  return {
    title: result.data.title,
    description: result.data.description ?? undefined,
  };
}

export default async function MemberEventDetailPage({
  params,
}: EventDetailPageProps) {
  const { slug } = await params;
  const result = await getEventBySlug(slug);

  if (!result.success) {
    notFound();
  }

  const event = result.data;
  const timeLabel = event.startAt.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
  const endTimeLabel = event.endAt.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
  const canRsvp = event.status === "PUBLISHED" && event.isUpcoming;
  const registrationStatus = event.userRegistration?.status ?? null;

  return (
    <div className="flex flex-col gap-8 max-w-3xl">
      {/* Back link */}
      <Link
        href="/member/events"
        className="inline-flex items-center gap-1.5 text-xs hover:underline w-fit"
        style={{ color: "var(--hive-muted)", fontFamily: "var(--font-mono)" }}
      >
        <ArrowLeft size={12} />
        BACK_TO_EVENTS
      </Link>

      {/* Header card */}
      <div className="hive-card p-6 md:p-8 flex flex-col gap-6">
        {/* Tags */}
        <div className="flex flex-wrap items-center gap-2">
          <span
            className="hive-badge text-[10px]"
            style={{
              color: event.isUpcoming
                ? "var(--hive-primary)"
                : "var(--hive-muted)",
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
              color: "var(--hive-primary)",
              background: "var(--hive-primary-light)",
              borderColor: "var(--hive-primary-light)",
            }}
          >
            {event.category}
          </span>
          {event.isOnline && (
            <span
              className="hive-badge text-[10px]"
              style={{
                color: "var(--hive-success)",
                background: "#f0fdf4",
                borderColor: "#f0fdf4",
              }}
            >
              ONLINE
            </span>
          )}
          <span
            className="text-[10px] ml-auto"
            style={{ color: "var(--hive-muted)", fontFamily: "var(--font-mono)" }}
          >
            {generateHiveId(
              "EVENT",
              parseInt(event.id.slice(-3), 16) % 1000
            )}
          </span>
        </div>

        {/* Title & description */}
        <div>
          <h2
            className="text-2xl md:text-3xl font-bold leading-tight"
            style={{ color: "var(--hive-text)" }}
          >
            {event.title}
          </h2>
          {event.description && (
            <p
              className="text-sm mt-4 leading-relaxed whitespace-pre-wrap"
              style={{ color: "var(--hive-muted)" }}
            >
              {event.description}
            </p>
          )}
        </div>

        {/* Meta grid */}
        <div
          className="grid sm:grid-cols-2 gap-4 pt-4 border-t"
          style={{ borderColor: "var(--hive-border)" }}
        >
          <MetaItem
            icon={CalendarDays}
            label="DATE"
            value={formatDate(event.startAt)}
          />
          <MetaItem
            icon={Clock}
            label="TIME"
            value={`${timeLabel} – ${endTimeLabel}`}
          />
          <MetaItem
            icon={event.isOnline ? Globe : MapPin}
            label={event.isOnline ? "FORMAT" : "LOCATION"}
            value={
              event.isOnline
                ? "Online event"
                : event.location ?? "TBA"
            }
          />
          <MetaItem
            icon={Users}
            label="RSVPS"
            value={`${event.registrationCount}${event.capacity ? ` / ${event.capacity}` : ""} registered`}
          />
          <MetaItem
            icon={User}
            label="ORGANIZER"
            value={event.organizer.fullName}
          />
          <MetaItem
            icon={Globe}
            label="COMMUNITY"
            value={event.community.name}
          />
        </div>

        {/* Full datetime for clarity */}
        <p
          className="text-xs"
          style={{ color: "var(--hive-muted)", fontFamily: "var(--font-mono)" }}
        >
          {formatDateTime(event.startAt)} → {formatDateTime(event.endAt)}
        </p>
      </div>

      {/* RSVP section */}
      {event.isUpcoming && event.status === "PUBLISHED" && (
        <div className="hive-card p-6">
          <p
            className="text-xs font-semibold uppercase tracking-wider mb-4"
            style={{ fontFamily: "var(--font-mono)", color: "var(--hive-muted)" }}
          >
            REGISTRATION
          </p>
          <RsvpButton
            eventId={event.id}
            registrationStatus={registrationStatus}
            disabled={!canRsvp}
          />
        </div>
      )}

      {event.status === "CANCELLED" && (
        <div
          className="hive-card p-6 text-center text-sm"
          style={{ color: "var(--hive-error)" }}
        >
          This event has been cancelled.
        </div>
      )}
    </div>
  );
}

function MetaItem({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ size?: number; strokeWidth?: number }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
        style={{
          background: "var(--hive-surface)",
          color: "var(--hive-primary)",
        }}
      >
        <Icon size={14} strokeWidth={2} />
      </div>
      <div>
        <p
          className="text-[10px] font-semibold uppercase tracking-wider"
          style={{ fontFamily: "var(--font-mono)", color: "var(--hive-muted)" }}
        >
          {label}
        </p>
        <p className="text-sm font-medium" style={{ color: "var(--hive-text)" }}>
          {value}
        </p>
      </div>
    </div>
  );
}
