import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { getEvents } from "@/actions/events";
import { EventCard } from "@/components/hive/event-card";
import { EventsFilterTabs } from "@/components/hive/events-filter-tabs";
import { getCurrentDbUser, hasRole } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Events",
  description: "Browse upcoming and past community events on Hive.",
};

interface MemberEventsPageProps {
  searchParams: Promise<{ filter?: string }>;
}

export default async function MemberEventsPage({
  searchParams,
}: MemberEventsPageProps) {
  const { filter: filterParam } = await searchParams;
  const filter = filterParam === "past" ? "past" : "upcoming";
  const result = await getEvents(filter);
  const user = await getCurrentDbUser();
  const canCreate =
    user && hasRole(user, ["ORGANIZER", "ADMIN"]);

  return (
    <div className="flex flex-col gap-8 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <span
            className="hive-badge mb-2 inline-flex"
            style={{
              color: "var(--hive-primary)",
              background: "var(--hive-primary-light)",
              borderColor: "var(--hive-primary-light)",
            }}
          >
            EVENTS
          </span>
          <h2
            className="text-3xl font-bold"
            style={{ color: "var(--hive-text)" }}
          >
            Community Events
          </h2>
          <p className="text-sm mt-1" style={{ color: "var(--hive-muted)" }}>
            Discover workshops, hackathons, and meetups in your community.
          </p>
        </div>

        {canCreate && (
          <Link
            href="/organizer/events/new"
            className="hive-btn inline-flex items-center gap-2 px-4 py-2.5 text-white text-xs shrink-0"
            style={{ background: "var(--hive-primary)" }}
          >
            <Plus size={14} />
            CREATE_EVENT
          </Link>
        )}
      </div>

      {/* Filter tabs */}
      <Suspense fallback={null}>
        <EventsFilterTabs basePath="/member/events" />
      </Suspense>

      {/* Events grid */}
      {!result.success ? (
        <div
          className="hive-card p-8 text-center text-sm"
          style={{ color: "var(--hive-muted)" }}
        >
          {result.error}
        </div>
      ) : result.data.length === 0 ? (
        <div
          className="hive-card p-12 flex flex-col items-center gap-3 text-center"
          style={{ color: "var(--hive-muted)" }}
        >
          <p className="text-sm">
            {filter === "past"
              ? "No past events yet."
              : "No upcoming events scheduled."}
          </p>
          {canCreate && filter === "upcoming" && (
            <Link
              href="/organizer/events/new"
              className="hive-btn px-4 py-2 text-white text-xs"
              style={{ background: "var(--hive-primary)" }}
            >
              CREATE_FIRST_EVENT
            </Link>
          )}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {result.data.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              href={`/member/events/${event.slug}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
