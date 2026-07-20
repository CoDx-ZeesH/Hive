import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  Clock,
  MapPin,
  Users,
  Globe,
  User,
  ExternalLink,
} from "lucide-react";
import { getEventBySlug } from "@/actions/events";
import { getCurrentDbUser, hasRole } from "@/lib/auth";
import { formatDate, formatDateTime, generateHiveId } from "@/lib/utils";

interface OrganizerEventDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: OrganizerEventDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const result = await getEventBySlug(slug);
  if (!result.success) {
    return { title: "Event Not Found" };
  }
  return { title: `${result.data.title} — Manage` };
}

export default async function OrganizerEventDetailPage({
  params,
}: OrganizerEventDetailPageProps) {
  const { slug } = await params;
  const user = await getCurrentDbUser();
  const result = await getEventBySlug(slug);

  if (!result.success) {
    notFound();
  }

  const event = result.data;
  const isOwner =
    user &&
    (event.organizer.id === user.id || hasRole(user, ["ADMIN"]));

  if (!isOwner) {
    redirect(`/member/events/${slug}`);
  }

  const timeLabel = event.startAt.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
  const endTimeLabel = event.endAt.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <div className="flex flex-col gap-8 max-w-3xl">
      <Link
        href="/organizer/events"
        className="inline-flex items-center gap-1.5 text-xs hover:underline w-fit"
        style={{ color: "var(--hive-muted)", fontFamily: "var(--font-mono)" }}
      >
        <ArrowLeft size={12} />
        BACK_TO_EVENTS
      </Link>

      <div className="hive-card p-6 md:p-8 flex flex-col gap-6">
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
              color:
                event.status === "PUBLISHED"
                  ? "var(--hive-success)"
                  : "var(--hive-muted)",
              background:
                event.status === "PUBLISHED" ? "#f0fdf4" : "var(--hive-surface)",
              borderColor:
                event.status === "PUBLISHED" ? "#f0fdf4" : "var(--hive-border)",
            }}
          >
            {event.status}
          </span>
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

        <div>
          <h2
            className="text-2xl md:text-3xl font-bold"
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

        <div
          className="grid sm:grid-cols-2 gap-4 pt-4 border-t"
          style={{ borderColor: "var(--hive-border)" }}
        >
          <MetaItem icon={CalendarDays} label="DATE" value={formatDate(event.startAt)} />
          <MetaItem icon={Clock} label="TIME" value={`${timeLabel} – ${endTimeLabel}`} />
          <MetaItem
            icon={event.isOnline ? Globe : MapPin}
            label={event.isOnline ? "FORMAT" : "LOCATION"}
            value={event.isOnline ? "Online" : event.location ?? "TBA"}
          />
          <MetaItem
            icon={Users}
            label="RSVPS"
            value={`${event.registrationCount}${event.capacity ? ` / ${event.capacity}` : ""}`}
          />
          <MetaItem icon={User} label="ORGANIZER" value={event.organizer.fullName} />
          <MetaItem icon={Globe} label="COMMUNITY" value={event.community.name} />
        </div>

        <p
          className="text-xs"
          style={{ color: "var(--hive-muted)", fontFamily: "var(--font-mono)" }}
        >
          {formatDateTime(event.startAt)} → {formatDateTime(event.endAt)}
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link
          href={`/member/events/${slug}`}
          className="hive-btn inline-flex items-center gap-2 px-4 py-2.5 text-white text-xs"
          style={{ background: "var(--hive-primary)" }}
        >
          <ExternalLink size={14} />
          VIEW_PUBLIC_PAGE
        </Link>
      </div>
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
        style={{ background: "var(--hive-surface)", color: "var(--hive-primary)" }}
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
