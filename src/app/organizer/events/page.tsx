import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Plus, CalendarDays } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { EventCard } from "@/components/hive/event-card";

export const metadata: Metadata = {
  title: "Manage Events",
  description: "Create and manage all your community events.",
};

export default async function OrganizerEventsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const dbUser = await prisma.user.findUnique({
    where: { authId: user.id },
  });

  if (!dbUser) {
    redirect("/login");
  }

  // Fetch organizer's events
  const events = await prisma.event.findMany({
    where: { organizerId: dbUser.id },
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { registrations: true } },
    },
  });

  const pending = events.filter((e) => e.status === "PENDING");
  const published = events.filter((e) => e.status === "PUBLISHED");
  const drafts = events.filter((e) => e.status === "DRAFT");
  const rejected = events.filter((e) => e.status === "REJECTED");
  const completed = events.filter((e) => e.status === "COMPLETED");

  return (
    <div className="flex flex-col gap-8 max-w-3xl">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <span
            className="hive-badge mb-1 inline-flex w-fit"
            style={{ color: "var(--hive-accent)", background: "#ffe4e4", borderColor: "#ffe4e4" }}
          >
            EVENT_MANAGEMENT
          </span>
          <h2 className="text-3xl font-bold" style={{ color: "var(--hive-text)" }}>
            Your Events
          </h2>
          <p className="text-sm mt-1" style={{ color: "var(--hive-muted)" }}>
            {published.length} published · {pending.length} pending · {drafts.length} draft
          </p>
        </div>
        <Link
          href="/organizer/events/new"
          id="create-event-btn"
          className="hive-btn px-5 py-2.5 text-sm text-white flex items-center gap-2 shrink-0"
          style={{ background: "var(--hive-primary)" }}
        >
          <Plus size={16} /> CREATE_EVENT
        </Link>
      </div>

      {/* Summary Chips */}
      <div className="flex items-center gap-2 flex-wrap text-xs" style={{ fontFamily: "var(--font-mono)" }}>
        <span className="hive-badge" style={{ color: "#22c55e", background: "#f0fdf4", borderColor: "#22c55e" }}>
          [PUBLISHED: {published.length}]
        </span>
        <span className="hive-badge" style={{ color: "#f59e0b", background: "#fffbeb", borderColor: "#f59e0b" }}>
          [PENDING: {pending.length}]
        </span>
        <span className="hive-badge" style={{ color: "var(--hive-muted)", background: "var(--hive-surface)", borderColor: "var(--hive-border)" }}>
          [DRAFT: {drafts.length}]
        </span>
        {rejected.length > 0 && (
          <span className="hive-badge" style={{ color: "#ef4444", background: "#fef2f2", borderColor: "#ef4444" }}>
            [REJECTED: {rejected.length}]
          </span>
        )}
        {completed.length > 0 && (
          <span className="hive-badge" style={{ color: "var(--hive-primary)", background: "#ecfeff", borderColor: "var(--hive-primary)" }}>
            [COMPLETED: {completed.length}]
          </span>
        )}
      </div>

      {/* Pending Events (Under Review) */}
      {pending.length > 0 && (
        <div className="flex flex-col gap-3">
          <h3
            className="text-xs font-bold uppercase tracking-wider flex items-center gap-2"
            style={{ fontFamily: "var(--font-mono)", color: "#f59e0b" }}
          >
            <span>[PENDING_APPROVAL]</span>
            <span className="text-[10px] font-normal text-muted-foreground">
              (Awaiting Admin Review)
            </span>
          </h3>
          {pending.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              href={`/organizer/events/${event.id}`}
              organizer
            />
          ))}
        </div>
      )}

      {/* Live / Published Events */}
      {published.length > 0 && (
        <div className="flex flex-col gap-3">
          <h3
            className="text-xs font-bold uppercase tracking-wider"
            style={{ fontFamily: "var(--font-mono)", color: "#22c55e" }}
          >
            [LIVE_EVENTS] ({published.length})
          </h3>
          {published.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              href={`/organizer/events/${event.id}`}
              organizer
            />
          ))}
        </div>
      )}

      {/* Rejected Events */}
      {rejected.length > 0 && (
        <div className="flex flex-col gap-3">
          <h3
            className="text-xs font-bold uppercase tracking-wider"
            style={{ fontFamily: "var(--font-mono)", color: "#ef4444" }}
          >
            [REJECTED_EVENTS] ({rejected.length})
          </h3>
          {rejected.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              href={`/organizer/events/${event.id}`}
              organizer
            />
          ))}
        </div>
      )}

      {/* Draft Events */}
      {drafts.length > 0 && (
        <div className="flex flex-col gap-3">
          <h3
            className="text-xs font-bold uppercase tracking-wider"
            style={{ fontFamily: "var(--font-mono)", color: "var(--hive-muted)" }}
          >
            [DRAFTS] ({drafts.length})
          </h3>
          {drafts.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              href={`/organizer/events/${event.id}`}
              organizer
            />
          ))}
        </div>
      )}

      {/* Completed Events */}
      {completed.length > 0 && (
        <div className="flex flex-col gap-3">
          <h3
            className="text-xs font-bold uppercase tracking-wider"
            style={{ fontFamily: "var(--font-mono)", color: "var(--hive-primary)" }}
          >
            [COMPLETED_EVENTS] ({completed.length})
          </h3>
          {completed.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              href={`/organizer/events/${event.id}`}
              organizer
            />
          ))}
        </div>
      )}

      {/* Empty state */}
      {events.length === 0 && (
        <div className="hive-card p-12 flex flex-col items-center gap-4">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center"
            style={{ background: "var(--hive-primary-light)" }}
          >
            <CalendarDays size={28} style={{ color: "var(--hive-primary)" }} />
          </div>
          <p
            className="font-semibold text-sm"
            style={{ fontFamily: "var(--font-mono)", color: "var(--hive-muted)" }}
          >
            NO_EVENTS_YET
          </p>
          <Link
            href="/organizer/events/new"
            className="hive-btn px-5 py-2.5 text-sm text-white"
            style={{ background: "var(--hive-primary)" }}
          >
            CREATE_FIRST_EVENT
          </Link>
        </div>
      )}
    </div>
  );
}
