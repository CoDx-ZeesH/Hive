import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft, Edit, Users, QrCode, BarChart2 } from "lucide-react";
import Link from "next/link";
import { QrDisplay } from "@/components/hive/qr-display";
import { formatDate, formatEventTime } from "@/lib/utils";

// ─── Mock until DB is live ────────────────────────────────────────────────────

const mockEvents: Record<string, {
  id: string; title: string; description: string;
  location: string | null; isOnline: boolean;
  startAt: Date; endAt: Date; status: string;
  capacity: number | null; qrToken: string;
  _count: { registrations: number; attendance: number };
}> = {
  "evt-001": {
    id: "evt-001",
    title: "Build Night: Web3 x AI",
    description: "An evening of hacking at the intersection of Web3 and AI.",
    location: null,
    isOnline: true,
    startAt: new Date("2026-07-25T18:00:00"),
    endAt: new Date("2026-07-25T21:00:00"),
    status: "PUBLISHED",
    capacity: 50,
    qrToken: "evt-001-qr-token",
    _count: { registrations: 34, attendance: 0 },
  },
  "evt-002": {
    id: "evt-002",
    title: "Open Source Sprint",
    description: "Contribute to open source alongside community members.",
    location: "Innovation Hub, Room 204",
    isOnline: false,
    startAt: new Date("2026-08-02T10:00:00"),
    endAt: new Date("2026-08-02T17:00:00"),
    status: "DRAFT",
    capacity: 30,
    qrToken: "evt-002-qr-token",
    _count: { registrations: 0, attendance: 0 },
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const event = mockEvents[id];
  return { title: event?.title ? `Manage: ${event.title}` : "Event Not Found" };
}

export default async function OrganizerEventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const event = mockEvents[id];
  if (!event) notFound();

  const attendanceRate =
    event._count.registrations > 0
      ? Math.round((event._count.attendance / event._count.registrations) * 100)
      : 0;

  return (
    <div className="flex flex-col gap-8 max-w-4xl">
      {/* Back */}
      <Link
        href="/organizer/events"
        className="flex items-center gap-1.5 text-xs w-fit hover:underline"
        style={{ color: "var(--hive-muted)", fontFamily: "var(--font-mono)" }}
      >
        <ArrowLeft size={13} /> BACK_TO_EVENTS
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="flex gap-2 mb-2">
            <span
              className="hive-badge text-[10px]"
              style={{
                color: event.status === "PUBLISHED" ? "var(--hive-primary)" : "var(--hive-muted)",
                background: event.status === "PUBLISHED" ? "var(--hive-primary-light)" : "var(--hive-surface)",
                borderColor: event.status === "PUBLISHED" ? "var(--hive-primary-light)" : "var(--hive-border)",
              }}
            >
              {event.status}
            </span>
          </div>
          <h2 className="text-3xl font-bold" style={{ color: "var(--hive-text)" }}>
            {event.title}
          </h2>
          <p className="text-sm mt-1" style={{ color: "var(--hive-muted)" }}>
            {formatDate(event.startAt)} · {formatEventTime(event.startAt)} – {formatEventTime(event.endAt)}
            {event.location ? ` · ${event.location}` : " · Online"}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            className="hive-btn px-4 py-2.5 text-sm flex items-center gap-2"
            style={{ background: "var(--hive-surface)", color: "var(--hive-muted)", border: "1px solid var(--hive-border)" }}
          >
            <Edit size={14} /> EDIT
          </button>
          <Link
            href={`/organizer/events/${event.id}/attendance`}
            className="hive-btn px-4 py-2.5 text-sm text-white flex items-center gap-2"
            style={{ background: "var(--hive-primary)" }}
          >
            <Users size={14} /> ATTENDANCE
          </Link>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "RSVPS", value: event._count.registrations, max: event.capacity ?? "∞", icon: Users, color: "var(--hive-primary)" },
          { label: "CHECKED_IN", value: event._count.attendance, max: null, icon: QrCode, color: "var(--hive-success)" },
          { label: "ATTEND_RATE", value: `${attendanceRate}%`, max: null, icon: BarChart2, color: "#a855f7" },
        ].map((s) => (
          <div key={s.label} className="hive-card p-5 flex flex-col gap-2">
            <s.icon size={18} style={{ color: s.color }} strokeWidth={2} />
            <p className="text-2xl font-bold hive-stat" style={{ color: s.color }}>
              {s.value}
              {s.max !== null && (
                <span className="text-sm font-normal" style={{ color: "var(--hive-muted)" }}>
                  /{s.max}
                </span>
              )}
            </p>
            <p
              className="text-[10px] font-semibold uppercase tracking-wider"
              style={{ fontFamily: "var(--font-mono)", color: "var(--hive-muted)" }}
            >
              {s.label}
            </p>
          </div>
        ))}
      </div>

      {/* Content grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Description */}
        <div className="hive-card p-6">
          <h3
            className="text-xs font-bold uppercase tracking-wider mb-3"
            style={{ fontFamily: "var(--font-mono)", color: "var(--hive-muted)" }}
          >
            EVENT_DESCRIPTION
          </h3>
          <p className="text-sm" style={{ color: "var(--hive-text)" }}>
            {event.description}
          </p>
        </div>

        {/* QR Code */}
        <div className="hive-card p-6 flex flex-col items-center gap-4">
          <h3
            className="text-xs font-bold uppercase tracking-wider self-start"
            style={{ fontFamily: "var(--font-mono)", color: "var(--hive-muted)" }}
          >
            EVENT_QR_TOKEN
          </h3>
          <p className="text-xs self-start" style={{ color: "var(--hive-muted)" }}>
            Display this QR at the entrance for the attendance scanner.
          </p>
          <QrDisplay
            data={`https://hive.app/events/${event.id}/check-in`}
            label={`EVENT_${event.id.toUpperCase()}`}
            size={160}
          />
        </div>
      </div>
    </div>
  );
}
