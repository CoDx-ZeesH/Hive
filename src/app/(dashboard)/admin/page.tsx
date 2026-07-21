import type { Metadata } from "next";
import { Users, CalendarDays, Globe, ShieldCheck, TrendingUp, AlertCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Hive platform administration overview.",
};

async function getAdminStats() {
  try {
    const [userCount, communityCount, eventCount] = await Promise.all([
      prisma.user.count(),
      prisma.community.count(),
      prisma.event.count(),
    ]);
    return { userCount, communityCount, eventCount, error: null };
  } catch {
    return { userCount: 0, communityCount: 0, eventCount: 0, error: "DB not connected" };
  }
}

export default async function AdminDashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { userCount, communityCount, eventCount, error } = await getAdminStats();

  const stats = [
    { label: "TOTAL_USERS",       value: userCount,      icon: Users,       color: "var(--hive-primary)" },
    { label: "COMMUNITIES",       value: communityCount, icon: Globe,       color: "var(--hive-success)" },
    { label: "TOTAL_EVENTS",      value: eventCount,     icon: CalendarDays,color: "#f59e0b" },
    { label: "PLATFORM_HEALTH",   value: "100%",         icon: TrendingUp,  color: "#a855f7" },
  ];

  return (
    <div className="flex flex-col gap-8 max-w-4xl">
      {/* Header */}
      <div>
        <span
          className="hive-badge mb-1 inline-flex w-fit"
          style={{ color: "var(--hive-accent)", background: "#ffe4e4", borderColor: "#ffe4e4" }}
        >
          ADMIN_PANEL
        </span>
        <h2 className="text-3xl font-bold" style={{ color: "var(--hive-text)" }}>
          Admin Dashboard
        </h2>
        <p className="text-sm mt-1" style={{ color: "var(--hive-muted)" }}>
          Platform-wide overview and controls.
        </p>
      </div>

      {/* DB warning */}
      {error && (
        <div
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-xs"
          style={{ background: "#ffe4e4", color: "var(--hive-accent)", border: "1px solid #fca5a5" }}
        >
          <AlertCircle size={14} />
          <span style={{ fontFamily: "var(--font-mono)" }}>
            DB_NOT_CONNECTED — Configure DATABASE_URL to see live stats. Showing placeholder values.
          </span>
        </div>
      )}

      {/* Stats */}
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
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { href: "/admin/members",     label: "MANAGE_MEMBERS",      icon: Users,       desc: "View, promote, ban members" },
          { href: "/admin/communities", label: "MANAGE_COMMUNITIES",  icon: Globe,       desc: "Create and configure communities" },
          { href: "/admin/events",      label: "OVERSEE_EVENTS",      icon: CalendarDays,desc: "Monitor all platform events" },
        ].map((action) => (
          <a
            key={action.href}
            href={action.href}
            className="hive-card p-5 flex flex-col gap-3 hover:ring-1 hover:ring-[var(--hive-primary)] transition-all group"
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: "var(--hive-primary-light)" }}
            >
              <action.icon size={18} style={{ color: "var(--hive-primary)" }} strokeWidth={2} />
            </div>
            <div>
              <p
                className="text-[11px] font-bold mb-1"
                style={{ color: "var(--hive-text)", fontFamily: "var(--font-mono)" }}
              >
                {action.label}
              </p>
              <p className="text-xs" style={{ color: "var(--hive-muted)" }}>
                {action.desc}
              </p>
            </div>
          </a>
        ))}
      </div>

      {/* Security notice */}
      <div
        className="flex items-start gap-3 p-4 rounded-xl"
        style={{ background: "var(--hive-primary-light)", border: "1px solid rgba(13,180,201,0.2)" }}
      >
        <ShieldCheck size={16} style={{ color: "var(--hive-primary)", marginTop: 2 }} />
        <div>
          <p
            className="text-xs font-bold mb-0.5"
            style={{ color: "var(--hive-primary)", fontFamily: "var(--font-mono)" }}
          >
            ADMIN_ACCESS
          </p>
          <p className="text-xs" style={{ color: "var(--hive-text)" }}>
            You have full platform admin rights. All actions are logged and auditable. Handle with care.
          </p>
        </div>
      </div>
    </div>
  );
}
