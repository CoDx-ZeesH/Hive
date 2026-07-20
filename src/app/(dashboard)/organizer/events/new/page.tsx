import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getOrganizerCommunitiesAction } from "@/actions/events";
import { CreateEventForm } from "@/components/hive/create-event-form";

export const metadata: Metadata = {
  title: "Create Event",
  description: "Schedule a new community event on Hive.",
};

export default async function CreateEventPage() {
  const communitiesResult = await getOrganizerCommunitiesAction();
  const communities = communitiesResult.success
    ? communitiesResult.data
    : [];

  return (
    <div className="flex flex-col gap-8 max-w-3xl">
      <div>
        <Link
          href="/organizer/events"
          className="inline-flex items-center gap-1.5 text-xs hover:underline mb-4"
          style={{ color: "var(--hive-muted)", fontFamily: "var(--font-mono)" }}
        >
          <ArrowLeft size={12} />
          BACK_TO_EVENTS
        </Link>
        <span
          className="hive-badge mb-2 inline-flex"
          style={{
            color: "var(--hive-primary)",
            background: "var(--hive-primary-light)",
            borderColor: "var(--hive-primary-light)",
          }}
        >
          NEW_EVENT
        </span>
        <h2
          className="text-3xl font-bold"
          style={{ color: "var(--hive-text)" }}
        >
          Create Event
        </h2>
        <p className="text-sm mt-1" style={{ color: "var(--hive-muted)" }}>
          Fill in the details below. Save as draft or publish immediately.
        </p>
      </div>

      <CreateEventForm communities={communities} />
    </div>
  );
}
