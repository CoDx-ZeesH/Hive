import type { Metadata } from "next";
import { BarChart2, Users, Globe, CalendarDays, TrendingUp, Activity } from "lucide-react";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Analytics — Admin",
  description: "Platform-wide analytics and health metrics.",
};

async function getPlatformStats() {
  try {
    const [users, communities, events, registrations] = await Promise.all([
      prisma.user.count(),
      prisma.community.count(),
      prisma.event.count(),
      prisma.registration.count(),
    ]);
    return { users, communities, events, registrations, error: null };
  } catch {
    return { users: 0, communities: 0, events: 0, registrations: 0, error: true };
  }
}

// Fake weekly growth data
const weeklyUsers = [1, 1, 2, 2, 3, 4, 5];
const max = Math.max(...weeklyUsers);

export default async function AdminAnalyticsPage() {
  const stats = await getPlatformStats();

  const metrics = [
    { label: "TOTAL_USERS",     value: stats.users,         icon: Users,       color: "var(--hive-primary)" },
    { label: "COMMUNITIES",     value: stats.communities,   icon: Globe,       color: "var(--hive-success)" },
    { label: "EVENTS",          value: stats.events,        icon: CalendarDays,color: "#f59e0b" },
    { label: "REGISTRATIONS",   value: stats.registrations, icon: BarChart2,   color: "#a855f7" },
  ];

  return (
    <div className="flex flex-col gap-8 max-w-4xl">
      <div>
        <span
          className="hive-badge mb-1 inline-flex w-fit"
          style={{ color: "var(--hive-accent)", background: "#ffe4e4", borderColor: "#ffe4e4" }}
        >
          ADMIN › ANALYTICS
        </span>
        <h2 className="text-3xl font-bold" style={{ color: "var(--hive-text)" }}>
          Platform Analytics
        </h2>
        <p className="text-sm mt-1" style={{ color: "var(--hive-muted)" }}>
          {stats.error ? "Demo data — connect DB for live stats." : "Live platform metrics."}
        </p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {metrics.map((m) => (
          <div key={m.label} className="hive-card p-5 flex flex-col gap-2">
            <m.icon size={18} style={{ color: m.color }} strokeWidth={2} />
            <p className="text-2xl font-bold hive-stat" style={{ color: m.color }}>{m.value}</p>
            <p className="text-[9px] font-bold uppercase tracking-wider" style={{ fontFamily: "var(--font-mono)", color: "var(--hive-muted)" }}>
              {m.label}
            </p>
          </div>
        ))}
      </div>

      {/* User growth chart */}
      <div className="hive-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xs font-bold uppercase tracking-wider" style={{ fontFamily: "var(--font-mono)", color: "var(--hive-muted)" }}>
            USER_GROWTH — LAST 7 DAYS
          </h3>
          <Activity size={14} style={{ color: "var(--hive-primary)" }} />
        </div>
        <div className="flex items-end gap-2 h-28">
          {["D-6", "D-5", "D-4", "D-3", "D-2", "D-1", "TODAY"].map((day, i) => {
            const pct = (weeklyUsers[i] / max) * 100;
            const isToday = i === 6;
            return (
              <div key={day} className="flex flex-col items-center gap-1.5 flex-1">
                <p className="text-[10px] font-bold" style={{ color: isToday ? "var(--hive-primary)" : "var(--hive-muted)", fontFamily: "var(--font-mono)" }}>
                  {weeklyUsers[i]}
                </p>
                <div className="w-full rounded-t-lg" style={{
                  height: `${pct}%`,
                  minHeight: "4px",
                  background: isToday ? "var(--hive-primary)" : "var(--hive-primary-light)",
                }} />
                <p className="text-[9px] uppercase" style={{ fontFamily: "var(--font-mono)", color: "var(--hive-muted)" }}>{day}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Health panel */}
      <div className="hive-card p-6">
        <h3 className="text-xs font-bold uppercase tracking-wider mb-4" style={{ fontFamily: "var(--font-mono)", color: "var(--hive-muted)" }}>
          PLATFORM_HEALTH
        </h3>
        <div className="flex flex-col gap-3">
          {[
            { label: "API Response",   value: "~80ms",  status: "HEALTHY" },
            { label: "Auth (Supabase)",value: "Online",  status: "HEALTHY" },
            { label: "Database",       value: stats.error ? "Disconnected" : "Online", status: stats.error ? "WARN" : "HEALTHY" },
            { label: "Build",          value: "Passing", status: "HEALTHY" },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between py-2 border-b last:border-0" style={{ borderColor: "var(--hive-border)" }}>
              <p className="text-xs" style={{ color: "var(--hive-text)" }}>{item.label}</p>
              <div className="flex items-center gap-2">
                <p className="text-xs" style={{ color: "var(--hive-muted)", fontFamily: "var(--font-mono)" }}>{item.value}</p>
                <span
                  className="hive-badge text-[9px]"
                  style={{
                    color:   item.status === "HEALTHY" ? "var(--hive-success)" : "#f59e0b",
                    background: item.status === "HEALTHY" ? "#f0fdf4" : "#fef3c7",
                    borderColor: item.status === "HEALTHY" ? "#f0fdf4" : "#fef3c7",
                  }}
                >
                  {item.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
