"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
  UserCircle,
  type LucideIcon,
} from "lucide-react";

// ─── Types (plain-data safe, no function values) ───────────────────────────────

export interface NavItem {
  label: string;
  href: string;
  iconName: keyof typeof iconMap; // string key — safe to serialize across RSC boundary
  badge?: string;
}

export interface NavGroup {
  title?: string;
  items: NavItem[];
}

// ─── Icon resolution lives CLIENT-SIDE only ────────────────────────────────────

const iconMap = {
  dashboard:   LayoutDashboard,
  calendar:    CalendarDays,
  users:       Users,
  trophy:      Trophy,
  megaphone:   Megaphone,
  briefcase:   Briefcase,
  analytics:   BarChart2,
  settings:    Settings,
  shieldCheck: ShieldCheck,
  userCog:     UserCog,
  profile:     UserCircle,
} satisfies Record<string, LucideIcon>;

// ─── Per-role nav definitions (live here in the client component) ───────────────

const memberNav: NavGroup[] = [
  {
    items: [
      { label: "Dashboard",     href: "/member",               iconName: "dashboard"  },
      { label: "Events",        href: "/member/events",        iconName: "calendar"   },
      { label: "Community",     href: "/member/community",     iconName: "users"      },
      { label: "Opportunities", href: "/member/opportunities", iconName: "briefcase"  },
      { label: "Leaderboard",   href: "/member/leaderboard",   iconName: "trophy"     },
      { label: "Profile",       href: "/member/profile",       iconName: "profile"    },
    ],
  },
];

const organizerNav: NavGroup[] = [
  {
    title: "OVERVIEW",
    items: [
      { label: "Dashboard",     href: "/organizer",               iconName: "dashboard" },
      { label: "Events",        href: "/organizer/events",        iconName: "calendar"  },
      { label: "Members",       href: "/organizer/members",       iconName: "users"     },
      { label: "Announcements", href: "/organizer/announcements", iconName: "megaphone" },
    ],
  },
  {
    title: "INSIGHTS",
    items: [
      { label: "Analytics", href: "/organizer/analytics", iconName: "analytics" },
    ],
  },
];

const adminNav: NavGroup[] = [
  {
    title: "MANAGEMENT",
    items: [
      { label: "Dashboard",   href: "/admin",             iconName: "dashboard"   },
      { label: "Members",     href: "/admin/members",     iconName: "userCog"     },
      { label: "Communities", href: "/admin/communities", iconName: "shieldCheck" },
      { label: "Events",      href: "/admin/events",      iconName: "calendar"    },
    ],
  },
  {
    title: "SYSTEM",
    items: [
      { label: "Analytics", href: "/admin/analytics", iconName: "analytics" },
      { label: "Settings",  href: "/admin/settings",  iconName: "settings"  },
    ],
  },
];

export function getNavGroupsForRole(role: string): NavGroup[] {
  if (role === "ADMIN") return adminNav;
  if (role === "ORGANIZER") return organizerNav;
  return memberNav;
}

// ─── Component ─────────────────────────────────────────────────────────────────

interface SidebarNavProps {
  role: string;
}

/**
 * SidebarNav — Client Component.
 *
 * Receives only a plain `role` string from the Server Component parent
 * (safe to serialize). Icon components are resolved CLIENT-SIDE from the
 * `iconMap` — they never cross the RSC serialization boundary.
 */
export function SidebarNav({ role }: SidebarNavProps) {
  const pathname = usePathname();
  const groups = getNavGroupsForRole(role);

  return (
    <nav className="flex flex-col gap-5" aria-label="Main navigation">
      {groups.map((group, gi) => (
        <div key={gi} className="flex flex-col gap-0.5">
          {group.title && (
            <p
              className="px-3 mb-1 text-[9px] font-bold uppercase tracking-widest"
              style={{ fontFamily: "var(--font-mono)", color: "var(--hive-muted)" }}
            >
              {group.title}
            </p>
          )}
          {group.items.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname === item.href || pathname.startsWith(item.href + "/");

            const Icon = iconMap[item.iconName];

            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors relative group"
                style={{
                  background: isActive ? "var(--hive-primary-light)" : "transparent",
                  color: isActive ? "var(--hive-primary)" : "var(--hive-muted)",
                  fontFamily: "var(--font-mono)",
                }}
                aria-current={isActive ? "page" : undefined}
              >
                {/* Active indicator bar */}
                {isActive && (
                  <span
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 rounded-full"
                    style={{ background: "var(--hive-primary)" }}
                  />
                )}

                <Icon
                  size={15}
                  strokeWidth={isActive ? 2.5 : 2}
                  className="shrink-0 transition-transform group-hover:scale-105"
                />

                <span className="flex-1 uppercase tracking-wide text-[10px]">
                  {item.label}
                </span>

                {item.badge && (
                  <span
                    className="ml-auto text-[9px] font-bold px-1.5 py-0.5 rounded-md"
                    style={{
                      background: "var(--hive-primary)",
                      color: "#fff",
                      fontFamily: "var(--font-mono)",
                    }}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      ))}
    </nav>
  );
}