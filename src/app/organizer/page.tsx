import type { Metadata } from "next";
import Link from "next/link";
import {
  CalendarDays,
  Users,
  CheckSquare,
  TrendingUp,
  Plus,
  ArrowRight,
  Clock,
  Radio,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Organizer Hub",
  description: "Manage your events, members, and community analytics.",
};

const stats = [
  {
    label: "EVENTS_CREATED",
    value: "---",
    delta: "+0 this month",
    icon: CalendarDays,
    color: "var(--hive-primary)",
    bg: "var(--hive-primary-light)",
  },
  {
    label: "TOTAL_RSVPS",
    value: "---",
    delta: "across all events",
    icon: Users,
    color: "#a855f7",
    bg: "#f3e8ff",
  },
  {
    label: "AVG_ATTENDANCE",
    value: "---",
    delta: "vs target",
    icon: CheckSquare,
    color: "var(--hive-success)",
    bg: "#f0fdf4",
  },
  {
    label: "COMMUNITY_GROWTH",
    value: "---",
    delta: "new members",
    icon: TrendingUp,
    color: "var(--hive-accent)",
    bg: "#ffe4e4",
  },
];

const quickActions = [
  {
    label: "CREATE_EVENT",
    href: "/organizer/events/new",
    icon: Plus,
    description: "Schedule a new community event",
  },
  {
    label: "MARK_ATTENDANCE",
    href: "/organizer/events",
    icon: CheckSquare,
    description: "Scan QR codes at your event",
  },
  {
    label: "POST_ANNOUNCEMENT",
    href: "/organizer/announcements/new",
    icon: Radio,
    description: "Broadcast to all members",
  },
  {
    label: "VIEW_ANALYTICS",
    href: "/organizer/analytics",
    icon: TrendingUp,
    description: "Attendance & engagement insights",
  },
];

const recentEvents = [
  {
    id: "EVENT_001",
    title: "Build Night: Web3 x AI",
    date: "Jul 25, 2026",
    status: "PUBLISHED",
    rsvps: 0,
  },
  {
    id: "EVENT_002",
    title: "Open Source Sprint",
    date: "Aug 2, 2026",
    status: "DRAFT",
    rsvps: 0,
  },
];

const statusColors: Record<string, { bg: string; color: string }> = {
  PUBLISHED: { bg: "#f0fdf4", color: "var(--hive-success)" },
  DRAFT: { bg: "var(--hive-surface)", color: "var(--hive-muted)" },
  CANCELLED: { bg: "#fef2f2", color: "var(--hive-error)" },
  COMPLETED: { bg: "var(--hive-primary-light)", color: "var(--hive-primary)" },
};

export default function OrganizerDashboardPage() {
  return (
    <div className="flex flex-col gap-8 max-w-5xl">
      {/* Header */}
      <div>
        <span
          className="hive-badge mb-2 inline-flex"
          style={{
            color: "var(--hive-accent)",
            background: "#ffe4e4",
            borderColor: "#ffe4e4",
          }}
        >
          ORGANIZER_DASHBOARD
        </span>
        <h2 className="text-3xl font-bold" style={{ color: "var(--hive-text)" }}>
          Organizer Hub 🎯
        </h2>
        <p className="text-sm mt-1" style={{ color: "var(--hive-muted)" }}>
          Build events, grow your community, track what matters.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="hive-card p-5 flex flex-col gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: stat.bg }}
            >
              <stat.icon size={18} style={{ color: stat.color }} strokeWidth={2} />
            </div>
            <div>
              <p
                className="text-2xl font-bold hive-stat"
                style={{ color: stat.color }}
              >
                {stat.value}
              </p>
              <p
                className="text-[10px] font-semibold uppercase tracking-wider"
                style={{ color: "var(--hive-muted)", fontFamily: "var(--font-mono)" }}
              >
                {stat.label}
              </p>
              <p
                className="text-[10px] mt-0.5"
                style={{ color: "var(--hive-muted)" }}
              >
                {stat.delta}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Content grid */}
      <div className="grid lg:grid-cols-5 gap-6">
        {/* Quick actions */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <h3 className="text-base font-bold" style={{ color: "var(--hive-text)" }}>
            Quick Actions
          </h3>
          <div className="flex flex-col gap-2">
            {quickActions.map((action) => (
              <Link
                key={action.label}
                href={action.href}
                className="hive-card p-4 flex items-center gap-3 group"
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors"
                  style={{
                    background: "var(--hive-primary-light)",
                    color: "var(--hive-primary)",
                  }}
                >
                  <action.icon size={16} strokeWidth={2} />
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className="text-xs font-bold uppercase tracking-wide"
                    style={{
                      color: "var(--hive-text)",
                      fontFamily: "var(--font-mono)",
                    }}
                  >
                    {action.label}
                  </p>
                  <p
                    className="text-xs truncate"
                    style={{ color: "var(--hive-muted)" }}
                  >
                    {action.description}
                  </p>
                </div>
                <ArrowRight
                  size={14}
                  style={{ color: "var(--hive-muted)" }}
                  className="shrink-0 group-hover:translate-x-0.5 transition-transform"
                />
              </Link>
            ))}
          </div>
        </div>

        {/* Recent events */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3
              className="text-base font-bold"
              style={{ color: "var(--hive-text)" }}
            >
              Your Events
            </h3>
            <Link
              href="/organizer/events"
              className="text-xs flex items-center gap-1 hover:underline"
              style={{ color: "var(--hive-primary)", fontFamily: "var(--font-mono)" }}
            >
              MANAGE_ALL <ArrowRight size={12} />
            </Link>
          </div>

          <div className="flex flex-col gap-3">
            {recentEvents.map((event) => {
              const sc = statusColors[event.status] ?? statusColors.DRAFT;
              return (
                <div
                  key={event.id}
                  className="hive-card p-4 flex items-center gap-4"
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{
                      background: "var(--hive-primary-light)",
                      color: "var(--hive-primary)",
                    }}
                  >
                    <CalendarDays size={18} strokeWidth={2} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span
                        className="hive-badge text-[10px]"
                        style={{ color: sc.color, background: sc.bg, borderColor: sc.bg }}
                      >
                        {event.status}
                      </span>
                      <span
                        className="text-[10px]"
                        style={{ color: "var(--hive-muted)", fontFamily: "var(--font-mono)" }}
                      >
                        {event.id}
                      </span>
                    </div>
                    <p
                      className="text-sm font-semibold truncate"
                      style={{ color: "var(--hive-text)" }}
                    >
                      {event.title}
                    </p>
                    <p
                      className="flex items-center gap-1 text-xs mt-0.5"
                      style={{ color: "var(--hive-muted)", fontFamily: "var(--font-mono)" }}
                    >
                      <Clock size={11} /> {event.date}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p
                      className="text-lg font-bold hive-stat"
                      style={{ color: "var(--hive-primary)" }}
                    >
                      {event.rsvps}
                    </p>
                    <p
                      className="text-[10px] uppercase"
                      style={{ color: "var(--hive-muted)", fontFamily: "var(--font-mono)" }}
                    >
                      RSVPS
                    </p>
                  </div>
                </div>
              );
            })}

            {/* CTA to create first event */}
            <Link
              href="/organizer/events/new"
              className="hive-card p-4 flex items-center justify-center gap-2 border-dashed hover:border-[var(--hive-primary)] transition-colors"
              style={{ borderStyle: "dashed" }}
            >
              <Plus size={16} style={{ color: "var(--hive-primary)" }} />
              <span
                className="text-xs font-bold uppercase"
                style={{
                  color: "var(--hive-primary)",
                  fontFamily: "var(--font-mono)",
                }}
              >
                CREATE_NEW_EVENT
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
