import type { Metadata } from "next";
import { CalendarDays, Search } from "lucide-react";
import { EventCard } from "@/components/hive/event-card";

export const metadata: Metadata = {
  title: "Events",
  description: "Browse upcoming community events, workshops, and hackathons.",
};

// ─── Mock events — Phase 4: connected to Prisma after DB is live ─────────────

const mockEvents = [
  {
    id: "evt-001",
    title: "Build Night: Web3 x AI",
    slug: "build-night-web3-ai",
    description:
      "An evening of hacking, learning, and building at the intersection of Web3 and AI. Open to all skill levels.",
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
    description:
      "Pick an open source project and contribute alongside fellow community members. All skill levels welcome — maintainers will be on hand to guide you.",
    location: "Innovation Hub, Room 204",
    isOnline: false,
    startAt: new Date("2026-08-02T10:00:00"),
    endAt: new Date("2026-08-02T17:00:00"),
    status: "PUBLISHED",
    capacity: 30,
    _count: { registrations: 12 },
  },
  {
    id: "evt-003",
    title: "Monthly Community Call",
    slug: "monthly-community-call",
    description:
      "Our monthly all-hands: community updates, shoutouts, upcoming events, and open floor discussion.",
    location: null,
    isOnline: true,
    startAt: new Date("2026-08-05T19:00:00"),
    endAt: new Date("2026-08-05T20:00:00"),
    status: "PUBLISHED",
    capacity: null,
    _count: { registrations: 8 },
  },
  {
    id: "evt-004",
    title: "Figma to Code Workshop",
    slug: "figma-to-code",
    description:
      "Hands-on session converting Figma designs to production-ready Next.js components.",
    location: "Tech Campus, Lab A",
    isOnline: false,
    startAt: new Date("2026-08-12T14:00:00"),
    endAt: new Date("2026-08-12T17:00:00"),
    status: "PUBLISHED",
    capacity: 20,
    _count: { registrations: 19 },
  },
];

export default function MemberEventsPage() {
  return (
    <div className="flex flex-col gap-8 max-w-3xl">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <span
          className="hive-badge mb-1 inline-flex w-fit"
          style={{ color: "var(--hive-primary)", background: "var(--hive-primary-light)", borderColor: "var(--hive-primary-light)" }}
        >
          EVENTS_DIRECTORY
        </span>
        <h2 className="text-3xl font-bold" style={{ color: "var(--hive-text)" }}>
          Upcoming Events
        </h2>
        <p className="text-sm" style={{ color: "var(--hive-muted)" }}>
          {mockEvents.length} events scheduled — click to RSVP and see details.
        </p>
      </div>

      {/* Search bar (UI only — Phase 5 will wire up) */}
      <div
        className="flex items-center gap-3 hive-input px-4 py-3"
      >
        <Search size={16} style={{ color: "var(--hive-muted)" }} />
        <input
          type="search"
          placeholder="Search events by title, tag, or location..."
          className="flex-1 bg-transparent text-sm outline-none"
          style={{ color: "var(--hive-text)" }}
          aria-label="Search events"
        />
      </div>

      {/* Filter chips */}
      <div className="flex gap-2 flex-wrap">
        {["ALL_EVENTS", "ONLINE", "IN_PERSON", "HACKATHON", "WORKSHOP"].map(
          (chip, i) => (
            <button
              key={chip}
              type="button"
              className="hive-badge cursor-pointer transition-colors"
              style={{
                color: i === 0 ? "#fff" : "var(--hive-muted)",
                background: i === 0 ? "var(--hive-primary)" : "var(--hive-surface)",
                borderColor: i === 0 ? "var(--hive-primary)" : "var(--hive-border)",
              }}
            >
              {chip}
            </button>
          )
        )}
      </div>

      {/* Events list */}
      <div className="flex flex-col gap-4">
        {mockEvents.length === 0 ? (
          <div
            className="hive-card p-12 flex flex-col items-center gap-3"
            style={{ textAlign: "center" }}
          >
            <CalendarDays size={32} style={{ color: "var(--hive-muted)" }} />
            <p
              className="text-sm font-semibold"
              style={{ fontFamily: "var(--font-mono)", color: "var(--hive-muted)" }}
            >
              NO_EVENTS_FOUND
            </p>
          </div>
        ) : (
          mockEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))
        )}
      </div>
    </div>
  );
}
