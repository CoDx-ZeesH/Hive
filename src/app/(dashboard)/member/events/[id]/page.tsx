import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Calendar, Clock, MapPin, Wifi, Users, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { RsvpButton } from "@/components/hive/rsvp-button";
import { QrDisplay } from "@/components/hive/qr-display";
import { formatEventDate, formatEventTime, formatDate } from "@/lib/utils";

// ─── Mock data until Prisma DB is connected ──────────────────────────────────

const mockEvents: Record<string, {
  id: string; title: string; description: string;
  location: string | null; isOnline: boolean;
  startAt: Date; endAt: Date; status: string;
  capacity: number | null; _count: { registrations: number };
  organizer: { fullName: string };
}> = {
  "evt-001": {
    id: "evt-001",
    title: "Build Night: Web3 x AI",
    description: `An evening of hacking, learning, and building at the intersection of Web3 and AI. Open to all skill levels.\n\nWhat to expect:\n- 1h intro talk on current Web3 + AI tools\n- 2h free build time with mentors available\n- Demo presentations and community vote\n\nBring your laptop and your curiosity!`,
    location: null,
    isOnline: true,
    startAt: new Date("2026-07-25T18:00:00"),
    endAt: new Date("2026-07-25T21:00:00"),
    status: "PUBLISHED",
    capacity: 50,
    _count: { registrations: 34 },
    organizer: { fullName: "Hive Core Team" },
  },
  "evt-002": {
    id: "evt-002",
    title: "Open Source Sprint",
    description: "Pick an open source project and contribute alongside fellow community members. All skill levels welcome.",
    location: "Innovation Hub, Room 204",
    isOnline: false,
    startAt: new Date("2026-08-02T10:00:00"),
    endAt: new Date("2026-08-02T17:00:00"),
    status: "PUBLISHED",
    capacity: 30,
    _count: { registrations: 12 },
    organizer: { fullName: "Hive Core Team" },
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const event = mockEvents[id];
  return {
    title: event?.title ?? "Event Not Found",
    description: event?.description?.slice(0, 160),
  };
}

export default async function MemberEventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const event = mockEvents[id];
  if (!event) notFound();

  // Get current user for RSVP state
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const authUserId = user?.id ?? null;

  // In real app: query prisma.registration to check isRegistered
  const isRegistered = false;
  const isWaitlisted = false;
  const spotsLeft = event.capacity
    ? event.capacity - event._count.registrations
    : null;
  const { month, day } = formatEventDate(event.startAt);

  // QR token for the logged-in user (shown after RSVP in production)
  const qrData = authUserId ? `${authUserId}:${event.id}` : null;

  return (
    <div className="flex flex-col gap-8 max-w-3xl">
      {/* Back */}
      <Link
        href="/member/events"
        className="flex items-center gap-1.5 text-xs w-fit hover:underline"
        style={{ color: "var(--hive-muted)", fontFamily: "var(--font-mono)" }}
      >
        <ArrowLeft size={13} /> BACK_TO_EVENTS
      </Link>

      {/* Hero */}
      <div className="flex items-start gap-6">
        <div
          className="flex flex-col items-center justify-center w-20 h-20 rounded-2xl shrink-0 text-white"
          style={{ background: "var(--hive-primary)" }}
        >
          <span className="text-sm font-bold uppercase" style={{ fontFamily: "var(--font-mono)", opacity: 0.8 }}>{month}</span>
          <span className="text-4xl font-bold leading-none" style={{ fontFamily: "var(--font-mono)" }}>{day}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex gap-2 mb-2 flex-wrap">
            <span
              className="hive-badge text-[10px]"
              style={{ color: "var(--hive-primary)", background: "var(--hive-primary-light)", borderColor: "var(--hive-primary-light)" }}
            >
              PUBLISHED
            </span>
            <span
              className="hive-badge text-[10px]"
              style={{ color: "var(--hive-muted)", background: "var(--hive-surface)", borderColor: "var(--hive-border)" }}
            >
              {event.isOnline ? "ONLINE" : "IN_PERSON"}
            </span>
          </div>
          <h1 className="text-3xl font-bold" style={{ color: "var(--hive-text)" }}>
            {event.title}
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--hive-muted)" }}>
            Organized by {event.organizer.fullName}
          </p>
        </div>
      </div>

      {/* Details grid */}
      <div className="grid sm:grid-cols-2 gap-3">
        {[
          { icon: Calendar, label: "DATE", value: formatDate(event.startAt) },
          { icon: Clock, label: "TIME", value: `${formatEventTime(event.startAt)} – ${formatEventTime(event.endAt)}` },
          ...(event.isOnline
            ? [{ icon: Wifi, label: "FORMAT", value: "Online Event" }]
            : event.location
            ? [{ icon: MapPin, label: "LOCATION", value: event.location }]
            : []),
          { icon: Users, label: "ATTENDEES", value: `${event._count.registrations}${event.capacity ? ` / ${event.capacity}` : ""}${spotsLeft !== null && spotsLeft <= 10 ? ` (${spotsLeft} left)` : ""}` },
        ].map((item) => (
          <div
            key={item.label}
            className="hive-card px-4 py-3 flex items-center gap-3"
          >
            <item.icon size={16} style={{ color: "var(--hive-primary)" }} className="shrink-0" />
            <div>
              <p
                className="text-[10px] font-semibold uppercase tracking-wider"
                style={{ fontFamily: "var(--font-mono)", color: "var(--hive-muted)" }}
              >
                {item.label}
              </p>
              <p className="text-sm font-semibold" style={{ color: "var(--hive-text)" }}>
                {item.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Description */}
      <div className="hive-card p-6">
        <h2
          className="text-xs font-bold uppercase tracking-wider mb-3"
          style={{ fontFamily: "var(--font-mono)", color: "var(--hive-muted)" }}
        >
          ABOUT_THIS_EVENT
        </h2>
        <div className="prose prose-sm max-w-none">
          {event.description.split("\n").map((line, i) =>
            line.trim() === "" ? (
              <br key={i} />
            ) : (
              <p key={i} className="text-sm mb-2" style={{ color: "var(--hive-text)" }}>
                {line}
              </p>
            )
          )}
        </div>
      </div>

      {/* RSVP + QR section */}
      <div className="flex flex-col sm:flex-row items-start gap-6">
        <div className="flex flex-col gap-3 flex-1">
          <h2
            className="text-xs font-bold uppercase tracking-wider"
            style={{ fontFamily: "var(--font-mono)", color: "var(--hive-muted)" }}
          >
            REGISTRATION
          </h2>
          {spotsLeft === 0 && (
            <div
              className="hive-badge text-xs px-3 py-2 mb-1"
              style={{ color: "#dc2626", background: "#fef2f2", borderColor: "#fecaca" }}
            >
              EVENT_FULL — JOIN_WAITLIST
            </div>
          )}
          <RsvpButton
            eventId={event.id}
            isRegistered={isRegistered}
            isWaitlisted={isWaitlisted}
            eventStatus={event.status}
          />
          <p className="text-xs" style={{ color: "var(--hive-muted)" }}>
            {isRegistered
              ? "You're registered! Your QR code is shown on the right."
              : spotsLeft !== null && spotsLeft <= 5 && spotsLeft > 0
              ? `Only ${spotsLeft} spot${spotsLeft !== 1 ? "s" : ""} left — register now!`
              : "Register to receive your personal QR code for check-in."}
          </p>
        </div>

        {/* QR code — show after user registers */}
        {isRegistered && qrData && (
          <QrDisplay
            data={qrData}
            label="YOUR_CHECK-IN_QR"
            size={160}
          />
        )}
      </div>
    </div>
  );
}
