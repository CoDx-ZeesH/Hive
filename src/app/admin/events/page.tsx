import type { Metadata } from "next";
import { CalendarDays, Clock, CheckCircle2 } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { AdminApprovalCard } from "@/components/hive/admin-approval-card";

export const metadata: Metadata = {
  title: "Events — Admin",
  description: "Platform-wide event oversight and review queue.",
};

const statusColors: Record<string, { color: string; bg: string; label: string }> = {
  PUBLISHED: { color: "#22c55e", bg: "#f0fdf4", label: "[PUBLISHED]" },
  PENDING:   { color: "#f59e0b", bg: "#fffbeb", label: "[PENDING]" },
  REJECTED:  { color: "#ef4444", bg: "#fef2f2", label: "[REJECTED]" },
  DRAFT:     { color: "var(--hive-muted)", bg: "var(--hive-surface)", label: "[DRAFT]" },
  CANCELLED: { color: "#dc2626", bg: "#fef2f2", label: "[CANCELLED]" },
  COMPLETED: { color: "var(--hive-primary)", bg: "#ecfeff", label: "[COMPLETED]" },
};

export default async function AdminEventsPage() {
  // Fetch pending review queue events
  const pendingEvents = await prisma.event.findMany({
    where: { status: "PENDING" },
    include: {
      community: { select: { name: true } },
      organizer: { select: { fullName: true, email: true } },
    },
    orderBy: { createdAt: "asc" },
  });

  // Fetch all events for platform oversight
  const allEvents = await prisma.event.findMany({
    include: {
      _count: { select: { registrations: true, attendance: true } },
      community: { select: { name: true } },
      organizer: { select: { fullName: true } },
    },
    orderBy: { startAt: "desc" },
    take: 100,
  });

  return (
    <div className="flex flex-col gap-8 max-w-5xl">
      {/* Page Header */}
      <div>
        <span
          className="hive-badge mb-1 inline-flex w-fit"
          style={{ color: "var(--hive-accent)", background: "#ffe4e4", borderColor: "#ffe4e4" }}
        >
          ADMIN › EVENTS
        </span>
        <h2 className="text-3xl font-bold" style={{ color: "var(--hive-text)" }}>
          Event Approval & Oversight
        </h2>
        <p className="text-sm mt-1" style={{ color: "var(--hive-muted)" }}>
          Review pending event submissions and manage platform events.
        </p>
      </div>

      {/* ─── PENDING REVIEW QUEUE ───────────────────────────────────────────── */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3
            className="text-xs font-bold uppercase tracking-wider flex items-center gap-2"
            style={{ fontFamily: "var(--font-mono)", color: "#f59e0b" }}
          >
            <Clock size={14} />
            <span>PENDING_REVIEW_QUEUE</span>
            <span className="hive-badge text-[10px]" style={{ color: "#f59e0b", background: "#fffbeb", borderColor: "#f59e0b" }}>
              {pendingEvents.length} SUBMISSION{pendingEvents.length !== 1 ? "S" : ""}
            </span>
          </h3>
        </div>

        {pendingEvents.length === 0 ? (
          <div
            className="hive-card p-8 flex flex-col items-center gap-2 text-center"
            style={{ background: "var(--hive-surface)" }}
          >
            <CheckCircle2 size={24} style={{ color: "var(--hive-success)" }} />
            <p className="text-xs font-semibold font-mono" style={{ color: "var(--hive-muted)" }}>
              NO_PENDING_APPROVALS
            </p>
            <p className="text-xs text-muted-foreground">
              All organizer event submissions have been reviewed!
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {pendingEvents.map((event) => (
              <AdminApprovalCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>

      {/* ─── ALL PLATFORM EVENTS TABLE ─────────────────────────────────────── */}
      <div className="flex flex-col gap-4 pt-4">
        <h3
          className="text-xs font-bold uppercase tracking-wider text-[var(--hive-muted)]"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          ALL_PLATFORM_EVENTS ({allEvents.length})
        </h3>

        <div className="hive-card overflow-hidden p-0">
          <div
            className="grid grid-cols-[1fr_140px_140px_120px_90px_100px] gap-3 px-5 py-3 border-b text-[10px] font-bold uppercase tracking-wider"
            style={{ borderColor: "var(--hive-border)", color: "var(--hive-muted)", fontFamily: "var(--font-mono)", background: "var(--hive-surface)" }}
          >
            <span>EVENT</span>
            <span>COMMUNITY</span>
            <span>ORGANIZER</span>
            <span>DATE</span>
            <span className="text-right">RSVPs</span>
            <span className="text-right">STATUS</span>
          </div>

          {allEvents.length === 0 ? (
            <div className="p-8 text-center text-xs font-mono text-[var(--hive-muted)]">
              NO_EVENTS_FOUND
            </div>
          ) : (
            allEvents.map((event) => {
              const sc = statusColors[event.status] ?? statusColors.DRAFT;
              return (
                <div
                  key={event.id}
                  className="grid grid-cols-[1fr_140px_140px_120px_90px_100px] gap-3 items-center px-5 py-3.5 border-b last:border-b-0 hover:bg-[var(--hive-surface)] transition-colors"
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

                  <p className="text-xs truncate font-mono text-[var(--hive-muted)]">
                    {event.community?.name ?? "—"}
                  </p>

                  <p className="text-xs truncate font-mono text-[var(--hive-muted)]">
                    {event.organizer?.fullName ?? "—"}
                  </p>

                  <p className="text-[10px] font-mono text-[var(--hive-muted)]">
                    {formatDate(event.startAt)}
                  </p>

                  <p className="text-xs font-bold text-right font-mono text-[var(--hive-primary)]">
                    {event._count.registrations}
                  </p>

                  <div className="flex justify-end">
                    <span
                      className="hive-badge text-[10px] font-mono"
                      style={{ color: sc.color, background: sc.bg, borderColor: sc.color }}
                    >
                      {sc.label}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
