import type { Metadata } from "next";
import Link from "next/link";
import { Plus, Filter } from "lucide-react";
import { EventCard } from "@/components/hive/event-card";

export const metadata: Metadata = {
  title: "Manage Events",
  description: "Create and manage all your community events.",
};

const mockEvents = [
  {
    id: "evt-001",
    title: "Build Night: Web3 x AI",
    slug: "build-night-web3-ai",
    description: "An evening of hacking at the intersection of Web3 and AI.",
    location: null,
    isOnline: true,
    startAt: new Date("2026-07-25T18:00:00"),
    endAt: new Date("2026-07-25T21:00:00"),
    status: "PUBLISHED",
    capacity: 50,
    _count: { registrations: 34 },
  },
  {
    id: "evt-002",
    title: "Open Source Sprint",
    slug: "open-source-sprint",
    description: "Contribute to open source alongside community members.",
    location: "Innovation Hub, Room 204",
    isOnline: false,
    startAt: new Date("2026-08-02T10:00:00"),
    endAt: new Date("2026-08-02T17:00:00"),
    status: "DRAFT",
    capacity: 30,
    _count: { registrations: 0 },
  },
];

export default function OrganizerEventsPage() {
  const published = mockEvents.filter((e) => e.status === "PUBLISHED");
  const drafts = mockEvents.filter((e) => e.status === "DRAFT");

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
            {published.length} published · {drafts.length} draft
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

      {/* Filter chips */}
      <div className="flex items-center gap-2 flex-wrap">
        <Filter size={14} style={{ color: "var(--hive-muted)" }} />
        {["ALL", "PUBLISHED", "DRAFT", "COMPLETED", "CANCELLED"].map((f, i) => (
          <button
            key={f}
            type="button"
            className="hive-badge cursor-pointer"
            style={{
              color: i === 0 ? "#fff" : "var(--hive-muted)",
              background: i === 0 ? "var(--hive-primary)" : "var(--hive-surface)",
              borderColor: i === 0 ? "var(--hive-primary)" : "var(--hive-border)",
            }}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Published events */}
      {published.length > 0 && (
        <div className="flex flex-col gap-3">
          <h3
            className="text-xs font-bold uppercase tracking-wider"
            style={{ fontFamily: "var(--font-mono)", color: "var(--hive-muted)" }}
          >
            LIVE_EVENTS ({published.length})
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

      {/* Draft events */}
      {drafts.length > 0 && (
        <div className="flex flex-col gap-3">
          <h3
            className="text-xs font-bold uppercase tracking-wider"
            style={{ fontFamily: "var(--font-mono)", color: "var(--hive-muted)" }}
          >
            DRAFTS ({drafts.length})
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

      {/* Empty state */}
      {mockEvents.length === 0 && (
        <div className="hive-card p-12 flex flex-col items-center gap-4">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center"
            style={{ background: "var(--hive-primary-light)" }}
          >
            <Plus size={28} style={{ color: "var(--hive-primary)" }} />
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
