import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { getEvents } from "@/actions/events";
import { getCurrentDbUser } from "@/lib/auth";
import { EventCard } from "@/components/hive/event-card";
import { EventsFilterTabs } from "@/components/hive/events-filter-tabs";

export const metadata: Metadata = {
  title: "Manage Events",
  description: "Create and manage community events as an organizer.",
};

interface OrganizerEventsPageProps {
  searchParams: Promise<{ filter?: string }>;
}

export default async function OrganizerEventsPage({
  searchParams,
}: OrganizerEventsPageProps) {
  const { filter: filterParam } = await searchParams;
  const filter = filterParam === "past" ? "past" : "upcoming";
  const user = await getCurrentDbUser();

  const result = await getEvents(filter, {
    includeDrafts: true,
    organizerId: user?.role === "ADMIN" ? undefined : user?.id,
  });

  return (
    <div className="flex flex-col gap-8 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <span
            className="hive-badge mb-2 inline-flex"
            style={{
              color: "var(--hive-accent)",
              background: "#ffe4e4",
              borderColor: "#ffe4e4",
            }}
          >
            ORGANIZER
          </span>
          <h2
            className="text-3xl font-bold"
            style={{ color: "var(--hive-text)" }}
          >
            Your Events
          </h2>
          <p className="text-sm mt-1" style={{ color: "var(--hive-muted)" }}>
            Manage drafts, published events, and track RSVPs.
          </p>
        </div>

        <Link
          href="/organizer/events/new"
          className="hive-btn inline-flex items-center gap-2 px-4 py-2.5 text-white text-xs shrink-0"
          style={{ background: "var(--hive-primary)" }}
        >
          <Plus size={14} />
          CREATE_EVENT
        </Link>
      </div>

      <Suspense fallback={null}>
        <EventsFilterTabs basePath="/organizer/events" />
      </Suspense>

      {!result.success ? (
        <div
          className="hive-card p-8 text-center text-sm"
          style={{ color: "var(--hive-muted)" }}
        >
          {result.error}
        </div>
      ) : result.data.length === 0 ? (
        <div
          className="hive-card p-12 flex flex-col items-center gap-3 text-center border-dashed"
          style={{ borderStyle: "dashed", color: "var(--hive-muted)" }}
        >
          <p className="text-sm">No events yet. Create your first one!</p>
          <Link
            href="/organizer/events/new"
            className="hive-btn px-4 py-2 text-white text-xs"
            style={{ background: "var(--hive-primary)" }}
          >
            CREATE_EVENT
          </Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {result.data.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              href={`/organizer/events/${event.slug}`}
              showStatus
            />
          ))}
        </div>
      )}
    </div>
  );
}
