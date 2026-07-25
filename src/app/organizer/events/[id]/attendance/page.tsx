import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Users, QrCode } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { AttendanceScanner } from "@/components/hive/attendance-scanner";
import { OrganizerRosterTable } from "@/components/hive/organizer-roster-table";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const event = await prisma.event.findUnique({ where: { id } });
  return { title: event ? `Attendance & Roster: ${event.title}` : "Not Found" };
}

export default async function AttendancePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const event = await prisma.event.findUnique({
    where: { id },
  });

  if (!event) notFound();

  // Fetch all registrations for this event
  const registrations = await prisma.registration.findMany({
    where: { eventId: id },
    include: {
      user: {
        select: {
          id: true,
          fullName: true,
          email: true,
          username: true,
          avatarUrl: true,
        },
      },
    },
    orderBy: { registeredAt: "asc" },
  });

  return (
    <div className="flex flex-col gap-8 max-w-5xl">
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
          ORGANIZER › ROSTER & ATTENDANCE
        </span>
        <h2 className="text-3xl font-bold" style={{ color: "var(--hive-text)" }}>
          {event.title}
        </h2>
        <p className="text-sm mt-1" style={{ color: "var(--hive-muted)" }}>
          Manage member RSVPs and scan check-in QR codes.
        </p>
      </div>

      {/* ─── SECTION 1: ATTENDANCE SCANNER ─────────────────────────────────── */}
      <div className="flex flex-col gap-3">
        <h3
          className="text-xs font-bold uppercase tracking-wider flex items-center gap-2"
          style={{ fontFamily: "var(--font-mono)", color: "var(--hive-muted)" }}
        >
          <QrCode size={14} /> DOOR_CHECK-IN_SCANNER
        </h3>

        <div
          className="bg-white border rounded-2xl p-6"
          style={{ borderColor: "var(--hive-border)", boxShadow: "var(--shadow-sm)" }}
        >
          <AttendanceScanner eventId={event.id} eventTitle={event.title} />
        </div>
      </div>

      {/* ─── SECTION 2: MEMBER ROSTER TABLE ────────────────────────────────── */}
      <div className="flex flex-col gap-3 pt-4">
        <h3
          className="text-xs font-bold uppercase tracking-wider flex items-center gap-2"
          style={{ fontFamily: "var(--font-mono)", color: "var(--hive-muted)" }}
        >
          <Users size={14} /> MEMBER_ROSTER_MANAGEMENT ({registrations.length})
        </h3>

        <OrganizerRosterTable eventId={event.id} registrations={registrations} />
      </div>
    </div>
  );
}
