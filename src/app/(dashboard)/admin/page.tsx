import type { Metadata } from "next";
import {
  Users,
  CalendarDays,
  Building2,
  Activity,
  ShieldCheck,
  TrendingUp,
  AlertCircle,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Admin Control Panel",
  description: "System-wide administration for the Hive platform.",
};

const systemStats = [
  {
    label: "TOTAL_MEMBERS",
    value: "---",
    icon: Users,
    color: "var(--hive-primary)",
    bg: "var(--hive-primary-light)",
    delta: "+0 this week",
  },
  {
    label: "COMMUNITIES",
    value: "---",
    icon: Building2,
    color: "#a855f7",
    bg: "#f3e8ff",
    delta: "active",
  },
  {
    label: "ACTIVE_EVENTS",
    value: "---",
    icon: CalendarDays,
    color: "var(--hive-success)",
    bg: "#f0fdf4",
    delta: "published",
  },
  {
    label: "SYSTEM_HEALTH",
    value: "OK",
    icon: Activity,
    color: "var(--hive-success)",
    bg: "#f0fdf4",
    delta: "all systems operational",
  },
];

const recentAlerts = [
  {
    type: "INFO",
    message: "Phase 2 auth system initialized",
    time: "Just now",
    icon: ShieldCheck,
    color: "var(--hive-primary)",
    bg: "var(--hive-primary-light)",
  },
  {
    type: "INFO",
    message: "Prisma schema v1.0 deployed",
    time: "Phase 2",
    icon: TrendingUp,
    color: "var(--hive-success)",
    bg: "#f0fdf4",
  },
  {
    type: "WARN",
    message: "Database credentials not yet configured",
    time: "Setup required",
    icon: AlertCircle,
    color: "var(--hive-warning)",
    bg: "#fef3c7",
  },
];

const adminModules = [
  {
    label: "MEMBER_MANAGEMENT",
    href: "/admin/members",
    description: "Assign roles, ban/activate members",
    icon: Users,
  },
  {
    label: "COMMUNITIES",
    href: "/admin/communities",
    description: "Create and manage communities",
    icon: Building2,
  },
  {
    label: "EVENT_OVERSIGHT",
    href: "/admin/events",
    description: "Review and moderate all events",
    icon: CalendarDays,
  },
  {
    label: "SYSTEM_ANALYTICS",
    href: "/admin/analytics",
    description: "Platform-wide usage insights",
    icon: TrendingUp,
  },
];

export default function AdminDashboardPage() {
  return (
    <div className="flex flex-col gap-8 max-w-5xl">
      {/* Header */}
      <div>
        <span
          className="hive-badge mb-2 inline-flex"
          style={{
            color: "var(--hive-text)",
            background: "var(--hive-surface)",
            borderColor: "var(--hive-border)",
          }}
        >
          ADMIN_CONTROL_PANEL
        </span>
        <h2 className="text-3xl font-bold" style={{ color: "var(--hive-text)" }}>
          System Overview 🛡️
        </h2>
        <p className="text-sm mt-1" style={{ color: "var(--hive-muted)" }}>
          Full platform administration and configuration.
        </p>
      </div>

      {/* System stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {systemStats.map((stat) => (
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
              <p className="text-[10px] mt-0.5" style={{ color: "var(--hive-muted)" }}>
                {stat.delta}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Admin modules */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          <h3 className="text-base font-bold" style={{ color: "var(--hive-text)" }}>
            Admin Modules
          </h3>
          <div className="grid sm:grid-cols-2 gap-3">
            {adminModules.map((mod) => (
              <a
                key={mod.label}
                href={mod.href}
                className="hive-card p-5 flex flex-col gap-3 group"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{
                    background: "var(--hive-surface)",
                    color: "var(--hive-primary)",
                  }}
                >
                  <mod.icon size={18} strokeWidth={2} />
                </div>
                <div>
                  <p
                    className="text-xs font-bold uppercase tracking-wide"
                    style={{
                      color: "var(--hive-text)",
                      fontFamily: "var(--font-mono)",
                    }}
                  >
                    {mod.label}
                  </p>
                  <p
                    className="text-xs mt-0.5"
                    style={{ color: "var(--hive-muted)" }}
                  >
                    {mod.description}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* System alerts */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <h3 className="text-base font-bold" style={{ color: "var(--hive-text)" }}>
            System Alerts
          </h3>
          <div className="hive-card p-4 flex flex-col divide-y">
            {recentAlerts.map((alert, i) => (
              <div
                key={i}
                className="flex items-start gap-3 py-3 first:pt-0 last:pb-0"
              >
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                  style={{ background: alert.bg, color: alert.color }}
                >
                  <alert.icon size={13} strokeWidth={2} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs" style={{ color: "var(--hive-text)" }}>
                    {alert.message}
                  </p>
                  <p
                    className="text-[10px] mt-0.5"
                    style={{ color: "var(--hive-muted)", fontFamily: "var(--font-mono)" }}
                  >
                    {alert.type} · {alert.time}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Phase progress */}
          <div
            className="rounded-2xl border p-5"
            style={{ background: "#fff", borderColor: "var(--hive-border)" }}
          >
            <p
              className="text-[10px] font-bold uppercase tracking-wider mb-3"
              style={{ color: "var(--hive-muted)", fontFamily: "var(--font-mono)" }}
            >
              BUILD_PROGRESS
            </p>
            {["PHASE_01_INFRA", "PHASE_02_AUTH", "PHASE_03_LAYOUTS", "PHASE_04_EVENTS", "PHASE_05_GROWTH"].map(
              (phase, i) => {
                const done = i < 3;
                const current = i === 2;
                return (
                  <div key={phase} className="flex items-center gap-2.5 mb-2 last:mb-0">
                    <div
                      className="w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0"
                      style={{
                        background: done
                          ? "var(--hive-primary)"
                          : current
                          ? "var(--hive-primary-light)"
                          : "var(--hive-surface)",
                        color: done ? "#fff" : current ? "var(--hive-primary)" : "var(--hive-muted)",
                        border: current ? "2px solid var(--hive-primary)" : "none",
                      }}
                    >
                      {done ? "✓" : i + 1}
                    </div>
                    <span
                      className="text-[10px] font-semibold"
                      style={{
                        fontFamily: "var(--font-mono)",
                        color: done
                          ? "var(--hive-text)"
                          : current
                          ? "var(--hive-primary)"
                          : "var(--hive-muted)",
                      }}
                    >
                      {phase}
                    </span>
                  </div>
                );
              }
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
