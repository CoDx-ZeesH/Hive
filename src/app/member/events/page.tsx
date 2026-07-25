import type { Metadata } from "next";
import { CalendarDays, Search } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { EventCard } from "@/components/hive/event-card";

export const metadata: Metadata = {
  title: "Events",
  description: "Browse upcoming community events, workshops, and hackathons.",
};

export default async function MemberEventsPage() {
  // STRICT RULE: Only fetch and display events where status === 'PUBLISHED'
  const events = await prisma.event.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { startAt: "asc" },
    include: {
      _count: {
        select: {
          registrations: { where: { status: { in: ["APPROVED", "ATTENDED"] } } },
        },
      },
    },
  });

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
          {events.length} event{events.length !== 1 ? "s" : ""} scheduled — click to RSVP and see details.
        </p>
      </div>

      {/* Search bar */}
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
        {events.length === 0 ? (
          <div
            className="hive-card p-12 flex flex-col items-center gap-3"
            style={{ textAlign: "center" }}
          >
            <CalendarDays size={32} style={{ color: "var(--hive-muted)" }} />
            <p
              className="text-sm font-semibold"
              style={{ fontFamily: "var(--font-mono)", color: "var(--hive-muted)" }}
            >
              NO_PUBLISHED_EVENTS_FOUND
            </p>
            <p className="text-xs text-muted-foreground">
              Check back soon for new community events!
            </p>
          </div>
        ) : (
          events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))
        )}
      </div>
    </div>
  );
}
