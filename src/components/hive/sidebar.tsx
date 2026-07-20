import Link from "next/link";
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  Trophy,
  Megaphone,
  Briefcase,
  BarChart2,
  Settings,
  ShieldCheck,
  UserCog,
} from "lucide-react";
import { SidebarNav } from "@/components/hive/sidebar-nav";
import { UserAvatar } from "@/components/hive/user-avatar";
import { logoutAction } from "@/actions/auth";
import type { UserRole } from "@/types";

interface SidebarUser {
  fullName: string;
  email: string;
  role: UserRole;
  avatarUrl?: string | null;
}

interface SidebarProps {
  user: SidebarUser;
}

// ─── Navigation definitions per role ──────────────────────────────────────────

const memberNav = [
  {
    items: [
      { label: "Dashboard", href: "/member", icon: LayoutDashboard },
      { label: "Events", href: "/member/events", icon: CalendarDays },
      { label: "Community", href: "/member/community", icon: Users },
      { label: "Opportunities", href: "/member/opportunities", icon: Briefcase },
      { label: "Leaderboard", href: "/member/leaderboard", icon: Trophy },
    ],
  },
];

const organizerNav = [
  {
    title: "OVERVIEW",
    items: [
      { label: "Dashboard", href: "/organizer", icon: LayoutDashboard },
      { label: "Events", href: "/organizer/events", icon: CalendarDays },
      { label: "Members", href: "/organizer/members", icon: Users },
      { label: "Announcements", href: "/organizer/announcements", icon: Megaphone },
    ],
  },
  {
    title: "INSIGHTS",
    items: [
      { label: "Analytics", href: "/organizer/analytics", icon: BarChart2 },
    ],
  },
];

const adminNav = [
  {
    title: "MANAGEMENT",
    items: [
      { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
      { label: "Members", href: "/admin/members", icon: UserCog },
      { label: "Communities", href: "/admin/communities", icon: ShieldCheck },
      { label: "Events", href: "/admin/events", icon: CalendarDays },
    ],
  },
  {
    title: "SYSTEM",
    items: [
      { label: "Analytics", href: "/admin/analytics", icon: BarChart2 },
      { label: "Settings", href: "/admin/settings", icon: Settings },
    ],
  },
];

function getNavGroups(role: UserRole) {
  if (role === "ADMIN") return adminNav;
  if (role === "ORGANIZER") return organizerNav;
  return memberNav;
}

function getRoleLabel(role: UserRole) {
  if (role === "ADMIN") return "ADMIN";
  if (role === "ORGANIZER") return "ORGANIZER";
  return "MEMBER";
}

/**
 * Sidebar — Server Component.
 * Navigation state (active) handled by the SidebarNav client sub-component.
 */
export function Sidebar({ user }: SidebarProps) {
  const navGroups = getNavGroups(user.role);

  return (
    <aside
      className="hidden md:flex flex-col w-56 shrink-0 border-r h-screen sticky top-0 overflow-hidden"
      style={{
        background: "#ffffff",
        borderColor: "var(--hive-border)",
      }}
    >
      {/* Logo */}
      <div
        className="flex items-center gap-2.5 px-5 h-14 border-b shrink-0"
        style={{ borderColor: "var(--hive-border)" }}
      >
        <Link href="/" className="flex items-center gap-2 group">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-sm font-bold transition-transform group-hover:scale-105"
            style={{
              background: "var(--hive-primary)",
              fontFamily: "var(--font-mono)",
            }}
          >
            H
          </div>
          <span
            className="font-bold text-sm tracking-widest"
            style={{ fontFamily: "var(--font-mono)", color: "var(--hive-text)" }}
          >
            HIVE
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto px-3 py-4">
        <SidebarNav groups={navGroups} />
      </div>

      {/* User section */}
      <div
        className="px-3 py-3 border-t shrink-0"
        style={{ borderColor: "var(--hive-border)" }}
      >
        <div
          className="flex items-center gap-2.5 px-2 py-2 rounded-xl"
          style={{ background: "var(--hive-surface)" }}
        >
          <UserAvatar
            name={user.fullName}
            avatarUrl={user.avatarUrl}
            size="sm"
          />
          <div className="flex-1 min-w-0">
            <p
              className="text-xs font-semibold truncate"
              style={{
                color: "var(--hive-text)",
                fontFamily: "var(--font-sans)",
              }}
            >
              {user.fullName}
            </p>
            <p
              className="text-[10px] truncate mt-0.5"
              style={{
                color: "var(--hive-primary)",
                fontFamily: "var(--font-mono)",
              }}
            >
              {getRoleLabel(user.role)}
            </p>
          </div>

          {/* Logout */}
          <form action={logoutAction}>
            <button
              type="submit"
              className="shrink-0 p-1 rounded-lg hover:bg-white transition-colors"
              style={{ color: "var(--hive-muted)" }}
              title="Sign out"
              aria-label="Sign out"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </aside>
  );
}
