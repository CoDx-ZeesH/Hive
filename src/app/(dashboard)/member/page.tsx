import type { Metadata } from "next";
import {
  CalendarDays,
  Trophy,
  Star,
  Flame,
  ArrowRight,
  Clock,
  MapPin,
} from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Your Hive member dashboard — events, score, and community activity.",
};

// ─── Mock data (Phase 4 will connect to Prisma) ─────────────────────────────

const stats = [
  {
    label: "EVENTS_ATTENDED",
    value: "---",
    icon: CalendarDays,
    color: "var(--hive-primary)",
    bg: "var(--hive-primary-light)",
  },
  {
    label: "COMMUNITY_SCORE",
    value: "---",
    icon: Star,
    color: "#f59e0b",
    bg: "#fef3c7",
  },
  {
    label: "BADGES_EARNED",
    value: "---",
    icon: Trophy,
    color: "#a855f7",
    bg: "#f3e8ff",
  },
  {
    label: "ATTEND_STREAK",
    value: "---",
    icon: Flame,
    color: "var(--hive-accent)",
    bg: "#ffe4e4",
  },
];

const upcomingEvents = [
  {
    id: "EVENT_001",
    title: "Build Night: Web3 x AI",
    date: "Jul 25, 2026",
    time: "6:00 PM",
    location: "Online",
    tag: "WORKSHOP",
  },
  {
    id: "EVENT_002",
    title: "Open Source Sprint",
    date: "Aug 2, 2026",
    time: "10:00 AM",
    location: "Hive HQ",
    tag: "HACKATHON",
  },
  {
    id: "EVENT_003",
    title: "Monthly Community Call",
    date: "Aug 5, 2026",
    time: "7:00 PM",
    location: "Online",
    tag: "COMMUNITY",
  },
];

const recentActivity = [
  { action: "REGISTERED", target: "Build Night: Web3 x AI", time: "2h ago" },
  { action: "BADGE_EARNED", target: "Early Adopter", time: "1d ago" },
  { action: "PROFILE_UPDATED", target: "Added 3 skills", time: "3d ago" },
];

// ─── Page ────────────────────────────────────────────────────────────────────

export default function MemberDashboardPage() {
  return (
    <div className="flex flex-col gap-8 max-w-5xl">
      {/* Welcome */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2 mb-1">
          <span
            className="hive-badge"
            style={{
              color: "var(--hive-primary)",
              background: "var(--hive-primary-light)",
              borderColor: "var(--hive-primary-light)",
            }}
          >
            MEMBER_DASHBOARD
          </span>
        </div>
        <h2
          className="text-3xl font-bold"
          style={{ color: "var(--hive-text)" }}
        >
          Welcome back 👋
        </h2>
        <p className="text-sm" style={{ color: "var(--hive-muted)" }}>
          Here&apos;s what&apos;s happening in your community today.
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="hive-card p-5 flex flex-col gap-3"
          >
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
                className="text-[10px] font-semibold mt-0.5 uppercase tracking-wider"
                style={{
                  color: "var(--hive-muted)",
                  fontFamily: "var(--font-mono)",
                }}
              >
                {stat.label}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Content grid */}
      <div className="grid lg:grid-cols-5 gap-6">
        {/* Upcoming events — takes 3 cols */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3
              className="text-base font-bold"
              style={{ color: "var(--hive-text)" }}
            >
              Upcoming Events
            </h3>
            <Link
              href="/member/events"
              className="text-xs flex items-center gap-1 hover:underline"
              style={{
                color: "var(--hive-primary)",
                fontFamily: "var(--font-mono)",
              }}
            >
              VIEW_ALL <ArrowRight size={12} />
            </Link>
          </div>

          <div className="flex flex-col gap-3">
            {upcomingEvents.map((event) => (
              <div
                key={event.id}
                className="hive-card p-4 flex items-start gap-4"
              >
                {/* Date block */}
                <div
                  className="flex flex-col items-center justify-center w-12 h-12 rounded-xl shrink-0 text-white"
                  style={{ background: "var(--hive-primary)" }}
                >
                  <span
                    className="text-[10px] font-bold uppercase"
                    style={{ fontFamily: "var(--font-mono)", opacity: 0.8 }}
                  >
                    {event.date.split(" ")[0]}
                  </span>
                  <span
                    className="text-lg font-bold leading-none"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    {event.date.split(" ")[1].replace(",", "")}
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className="hive-badge text-[10px]"
                      style={{
                        color: "var(--hive-primary)",
                        background: "var(--hive-primary-light)",
                        borderColor: "var(--hive-primary-light)",
                      }}
                    >
                      {event.tag}
                    </span>
                    <span
                      className="text-[10px]"
                      style={{
                        color: "var(--hive-muted)",
                        fontFamily: "var(--font-mono)",
                      }}
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
                  <div
                    className="flex items-center gap-3 mt-1 text-xs"
                    style={{
                      color: "var(--hive-muted)",
                      fontFamily: "var(--font-mono)",
                    }}
                  >
                    <span className="flex items-center gap-1">
                      <Clock size={11} /> {event.time}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin size={11} /> {event.location}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  className="hive-btn shrink-0 px-3 py-1.5 text-[11px] text-white"
                  style={{ background: "var(--hive-primary)" }}
                >
                  RSVP
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Recent activity — takes 2 cols */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <h3
            className="text-base font-bold"
            style={{ color: "var(--hive-text)" }}
          >
            Recent Activity
          </h3>

          <div
            className="hive-card p-4 flex flex-col gap-0 divide-y"
            style={{ "--tw-divide-opacity": 1 } as React.CSSProperties}
          >
            {recentActivity.map((item, i) => (
              <div key={i} className="flex flex-col gap-0.5 py-3 first:pt-0 last:pb-0">
                <span
                  className="text-[10px] font-bold uppercase tracking-wider"
                  style={{
                    color: "var(--hive-primary)",
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  {item.action}
                </span>
                <span className="text-xs" style={{ color: "var(--hive-text)" }}>
                  {item.target}
                </span>
                <span
                  className="text-[10px]"
                  style={{
                    color: "var(--hive-muted)",
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  {item.time}
                </span>
              </div>
            ))}
          </div>

          {/* Score card */}
          <div
            className="rounded-2xl p-5 flex flex-col gap-2 border"
            style={{
              background: "var(--hive-primary)",
              borderColor: "var(--hive-primary)",
            }}
          >
            <div className="flex items-center justify-between">
              <span
                className="text-[10px] font-bold uppercase tracking-wider text-white opacity-80"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                COMMUNITY_SCORE
              </span>
              <Trophy size={16} className="text-white opacity-60" />
            </div>
            <p
              className="text-4xl font-bold text-white hive-stat"
            >
              ---
            </p>
            <p className="text-xs text-white opacity-70">
              Keep attending events to level up!
            </p>
            <Link
              href="/member/leaderboard"
              className="mt-1 text-[11px] text-white underline underline-offset-2 hover:opacity-80"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              VIEW_LEADERBOARD →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
