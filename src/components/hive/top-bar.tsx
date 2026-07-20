"use client";

import { usePathname } from "next/navigation";
import { logoutAction } from "@/actions/auth";
import { UserAvatar } from "@/components/hive/user-avatar";

interface TopBarUser {
  fullName: string;
  email: string;
  avatarUrl?: string | null;
}

interface TopBarProps {
  user: TopBarUser;
}

// Map pathname prefixes → human-readable page titles
const pageTitles: Record<string, string> = {
  "/member/events": "Events",
  "/member/community": "Community",
  "/member/opportunities": "Opportunities",
  "/member/leaderboard": "Leaderboard",
  "/member": "Dashboard",
  "/organizer/events": "Manage Events",
  "/organizer/members": "Members",
  "/organizer/announcements": "Announcements",
  "/organizer/analytics": "Analytics",
  "/organizer": "Organizer Hub",
  "/admin/members": "Member Management",
  "/admin/communities": "Communities",
  "/admin/events": "Event Management",
  "/admin/analytics": "System Analytics",
  "/admin/settings": "Settings",
  "/admin": "Admin Control Panel",
};

function getPageTitle(pathname: string): string {
  // Match longest prefix first
  const match = Object.keys(pageTitles)
    .sort((a, b) => b.length - a.length)
    .find((key) => pathname.startsWith(key));
  return match ? pageTitles[match] : "Hive";
}

/**
 * TopBar — Client Component (needs usePathname for dynamic title).
 * Sticky header with page title (Plus Jakarta Sans) and user info.
 */
export function TopBar({ user }: TopBarProps) {
  const pathname = usePathname();
  const title = getPageTitle(pathname);

  return (
    <header
      className="sticky top-0 z-30 flex items-center justify-between px-6 h-14 border-b shrink-0"
      style={{
        background: "rgba(255,255,255,0.92)",
        backdropFilter: "blur(8px)",
        borderColor: "var(--hive-border)",
      }}
    >
      {/* Page title */}
      <h1
        className="text-base font-bold"
        style={{ color: "var(--hive-text)", fontFamily: "var(--font-sans)" }}
      >
        {title}
      </h1>

      {/* Right side: user */}
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex flex-col items-end">
          <span
            className="text-xs font-semibold"
            style={{ color: "var(--hive-text)", fontFamily: "var(--font-sans)" }}
          >
            {user.fullName}
          </span>
          <span
            className="text-[10px]"
            style={{ color: "var(--hive-muted)", fontFamily: "var(--font-mono)" }}
          >
            {user.email}
          </span>
        </div>
        <UserAvatar name={user.fullName} avatarUrl={user.avatarUrl} size="sm" />

        {/* Mobile logout */}
        <form action={logoutAction} className="md:hidden">
          <button
            type="submit"
            className="p-2 rounded-lg hover:bg-[var(--hive-surface)] transition-colors"
            style={{ color: "var(--hive-muted)" }}
            aria-label="Sign out"
          >
            <svg
              width="16"
              height="16"
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
    </header>
  );
}
