import type { Metadata } from "next";
import { TrendingUp, Users, CalendarDays, BarChart2, Activity } from "lucide-react";

export const metadata: Metadata = {
  title: "Analytics",
  description: "Community engagement and event performance analytics.",
};

const stats = [
  { label: "TOTAL_MEMBERS",   value: "5",   delta: "+2 this week",  icon: Users,       color: "var(--hive-primary)" },
  { label: "EVENTS_HOSTED",   value: "2",   delta: "1 live now",    icon: CalendarDays, color: "var(--hive-success)" },
  { label: "AVG_ATTENDANCE",  value: "68%", delta: "+4% vs last",   icon: TrendingUp,  color: "#f59e0b" },
  { label: "TOTAL_SCORE_PTS", value: "7.1k",delta: "+840 this week",icon: BarChart2,   color: "#a855f7" },
];

// Sparkline mock data for the bar chart (7-day event RSVPs)
const rsvpSeries = [4, 7, 12, 8, 20, 34, 18];
const maxRsvp = Math.max(...rsvpSeries);

const topEvents = [
  { title: "Build Night: Web3 x AI", rsvps: 34, attended: 0, rate: "—" },
  { title: "Open Source Sprint",     rsvps: 0,  attended: 0, rate: "—" },
];

export default function OrganizerAnalyticsPage() {
  return (
    <div className="flex flex-col gap-8 max-w-4xl">
      {/* Header */}
      <div>
        <span
          className="hive-badge mb-1 inline-flex w-fit"
          style={{ color: "#a855f7", background: "#f3e8ff", borderColor: "#f3e8ff" }}
        >
          ANALYTICS
        </span>
        <h2 className="text-3xl font-bold" style={{ color: "var(--hive-text)" }}>
          Analytics
        </h2>
        <p className="text-sm mt-1" style={{ color: "var(--hive-muted)" }}>
          Community engagement overview · last 30 days
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="hive-card p-5 flex flex-col gap-2">
            <s.icon size={18} style={{ color: s.color }} strokeWidth={2} />
            <p className="text-2xl font-bold hive-stat" style={{ color: s.color }}>
              {s.value}
            </p>
            <p
              className="text-[9px] font-bold uppercase tracking-wider"
              style={{ fontFamily: "var(--font-mono)", color: "var(--hive-muted)" }}
            >
              {s.label}
            </p>
            <p className="text-[10px]" style={{ color: "var(--hive-muted)" }}>
              {s.delta}
            </p>
          </div>
        ))}
      </div>

      {/* RSVP Trend bar chart (pure CSS) */}
      <div className="hive-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h3
            className="text-xs font-bold uppercase tracking-wider"
            style={{ fontFamily: "var(--font-mono)", color: "var(--hive-muted)" }}
          >
            RSVP_TREND — LAST 7 DAYS
          </h3>
          <Activity size={14} style={{ color: "var(--hive-primary)" }} />
        </div>
        <div className="flex items-end gap-2 h-36">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, i) => {
            const pct = (rsvpSeries[i] / maxRsvp) * 100;
            const isLatest = i === rsvpSeries.length - 1;
            return (
              <div key={day} className="flex flex-col items-center gap-1.5 flex-1">
                <p
                  className="text-[10px] font-bold"
                  style={{ color: isLatest ? "var(--hive-primary)" : "var(--hive-muted)", fontFamily: "var(--font-mono)" }}
                >
                  {rsvpSeries[i]}
                </p>
                <div className="w-full rounded-t-lg transition-all" style={{
                  height: `${pct}%`,
                  minHeight: "4px",
                  background: isLatest ? "var(--hive-primary)" : "var(--hive-primary-light)",
                }} />
                <p
                  className="text-[9px] uppercase"
                  style={{ fontFamily: "var(--font-mono)", color: "var(--hive-muted)" }}
                >
                  {day}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Top events */}
      <div className="hive-card p-6">
        <h3
          className="text-xs font-bold uppercase tracking-wider mb-4"
          style={{ fontFamily: "var(--font-mono)", color: "var(--hive-muted)" }}
        >
          TOP_EVENTS
        </h3>
        <div className="flex flex-col gap-3">
          {topEvents.map((evt, i) => (
            <div
              key={evt.title}
              className="flex items-center gap-4 p-3 rounded-xl"
              style={{ background: "var(--hive-surface)" }}
            >
              <span
                className="w-6 h-6 rounded-lg flex items-center justify-center text-[11px] font-bold shrink-0"
                style={{ background: "var(--hive-primary-light)", color: "var(--hive-primary)", fontFamily: "var(--font-mono)" }}
              >
                {i + 1}
              </span>
              <p className="flex-1 text-xs font-semibold truncate" style={{ color: "var(--hive-text)" }}>
                {evt.title}
              </p>
              <div className="flex gap-4 shrink-0">
                <div className="text-right">
                  <p className="text-xs font-bold" style={{ color: "var(--hive-primary)", fontFamily: "var(--font-mono)" }}>{evt.rsvps}</p>
                  <p className="text-[9px] uppercase" style={{ color: "var(--hive-muted)", fontFamily: "var(--font-mono)" }}>RSVPS</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold" style={{ color: "var(--hive-success)", fontFamily: "var(--font-mono)" }}>{evt.rate}</p>
                  <p className="text-[9px] uppercase" style={{ color: "var(--hive-muted)", fontFamily: "var(--font-mono)" }}>RATE</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
