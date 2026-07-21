import type { Metadata } from "next";
import { CalendarDays, Eye, Users } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Events — Admin",
  description: "Platform-wide event oversight.",
};

async function getAllEvents() {
  try {
    return await prisma.event.findMany({
      include: {
        _count: { select: { registrations: true, attendance: true } },
        community: { select: { name: true } },
      },
      orderBy: { startAt: "desc" },
      take: 50,
    });
  } catch {
    return [];
  }
}

const mockEvents = [
  { id: "e1", title: "Build Night: Web3 x AI",  status: "PUBLISHED", startAt: new Date("2026-07-25"), community: { name: "Hive Core" }, _count: { registrations: 34, attendance: 0 } },
  { id: "e2", title: "Open Source Sprint",        status: "DRAFT",     startAt: new Date("2026-08-02"), community: { name: "Hive Core" }, _count: { registrations: 0,  attendance: 0 } },
];

const statusColors: Record<string, { color: string; bg: string }> = {
  PUBLISHED: { color: "var(--hive-primary)", bg: "var(--hive-primary-light)" },
  DRAFT:     { color: "var(--hive-muted)",   bg: "var(--hive-surface)" },
  CANCELLED: { color: "var(--hive-accent)",  bg: "#ffe4e4" },
  COMPLETED: { color: "var(--hive-success)", bg: "#f0fdf4" },
};

export default async function AdminEventsPage() {
  const dbEvents = await getAllEvents();
  const events = dbEvents.length > 0 ? dbEvents : mockEvents;

  return (
    <div className="flex flex-col gap-8 max-w-5xl">
      <div>
        <span
          className="hive-badge mb-1 inline-flex w-fit"
          style={{ color: "var(--hive-accent)", background: "#ffe4e4", borderColor: "#ffe4e4" }}
        >
          ADMIN › EVENTS
        </span>
        <h2 className="text-3xl font-bold" style={{ color: "var(--hive-text)" }}>
          All Events
        </h2>
        <p className="text-sm mt-1" style={{ color: "var(--hive-muted)" }}>
          {events.length} events across all communities
        </p>
      </div>

      <div className="hive-card overflow-hidden p-0">
        <div
          className="grid grid-cols-[1fr_140px_120px_80px_80px] gap-3 px-5 py-3 border-b text-[10px] font-bold uppercase tracking-wider"
          style={{ borderColor: "var(--hive-border)", color: "var(--hive-muted)", fontFamily: "var(--font-mono)", background: "var(--hive-surface)" }}
        >
          <span>EVENT</span>
          <span>COMMUNITY</span>
          <span>DATE</span>
          <span className="text-right">RSVPs</span>
          <span className="text-right">STATUS</span>
        </div>

        {events.map((event) => {
          const sc = statusColors[event.status] ?? statusColors.DRAFT;
          return (
            <div
              key={event.id}
              className="grid grid-cols-[1fr_140px_120px_80px_80px] gap-3 items-center px-5 py-3.5 border-b last:border-b-0 hover:bg-[var(--hive-surface)] transition-colors"
              style={{ borderColor: "var(--hive-border)" }}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: "var(--hive-primary-light)" }}
                >
                  <CalendarDays size={13} style={{ color: "var(--hive-primary)" }} />
                </div>
                <p className="text-xs font-semibold truncate" style={{ color: "var(--hive-text)" }}>
                  {event.title}
                </p>
              </div>

              <p className="text-xs truncate" style={{ color: "var(--hive-muted)", fontFamily: "var(--font-mono)" }}>
                {event.community.name}
              </p>

              <p className="text-[10px]" style={{ color: "var(--hive-muted)", fontFamily: "var(--font-mono)" }}>
                {formatDate(event.startAt)}
              </p>

              <p className="text-xs font-bold text-right" style={{ color: "var(--hive-primary)", fontFamily: "var(--font-mono)" }}>
                {event._count.registrations}
              </p>

              <div className="flex justify-end">
                <span
                  className="hive-badge text-[10px]"
                  style={{ color: sc.color, background: sc.bg, borderColor: sc.bg }}
                >
                  {event.status}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
