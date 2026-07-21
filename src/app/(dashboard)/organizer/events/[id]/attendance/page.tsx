import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AttendanceScanner } from "@/components/hive/attendance-scanner";

const mockEvents: Record<string, { id: string; title: string }> = {
  "evt-001": { id: "evt-001", title: "Build Night: Web3 x AI" },
  "evt-002": { id: "evt-002", title: "Open Source Sprint" },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const event = mockEvents[id];
  return { title: event ? `Attendance: ${event.title}` : "Not Found" };
}

export default async function AttendancePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const event = mockEvents[id];
  if (!event) notFound();

  return (
    <div className="flex flex-col gap-8 max-w-4xl">
      <Link
        href={`/organizer/events/${event.id}`}
        className="flex items-center gap-1.5 text-xs w-fit hover:underline"
        style={{ color: "var(--hive-muted)", fontFamily: "var(--font-mono)" }}
      >
        <ArrowLeft size={13} /> BACK_TO_EVENT
      </Link>

      <div>
        <span
          className="hive-badge mb-1 inline-flex w-fit"
          style={{ color: "var(--hive-primary)", background: "var(--hive-primary-light)", borderColor: "var(--hive-primary-light)" }}
        >
          ATTENDANCE_TRACKING
        </span>
        <h2 className="text-3xl font-bold" style={{ color: "var(--hive-text)" }}>
          Scan Check-ins
        </h2>
        <p className="text-sm mt-1" style={{ color: "var(--hive-muted)" }}>
          Use the camera scanner or enter QR tokens manually.
        </p>
      </div>

      {/* Scanner card */}
      <div
        className="bg-white border rounded-2xl p-6"
        style={{ borderColor: "var(--hive-border)", boxShadow: "var(--shadow-md)" }}
      >
        <AttendanceScanner eventId={event.id} eventTitle={event.title} />
      </div>
    </div>
  );
}
