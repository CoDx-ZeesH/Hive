import Link from "next/link";
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

function getRoleLabel(role: UserRole) {
  if (role === "ADMIN") return "ADMIN";
  if (role === "ORGANIZER") return "ORGANIZER";
  return "MEMBER";
}

/**
 * Sidebar — Server Component.
 *
 * Passes only a plain `role` string to SidebarNav (Client Component).
 * LucideIcon components are resolved entirely client-side — they never
 * cross the RSC serialization boundary (which caused the runtime crash).
 */
export function Sidebar({ user }: SidebarProps) {
  return (
    <aside
      className="hidden md:flex flex-col w-56 shrink-0 border-r h-screen sticky top-0 overflow-hidden"
      style={{ background: "#ffffff", borderColor: "var(--hive-border)" }}
    >
      {/* Logo */}
      <div
        className="flex items-center gap-2.5 px-5 h-14 border-b shrink-0"
        style={{ borderColor: "var(--hive-border)" }}
      >
        <Link href="/" className="flex items-center gap-2 group">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-sm font-bold transition-transform group-hover:scale-105"
            style={{ background: "var(--hive-primary)", fontFamily: "var(--font-mono)" }}
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

      {/* Navigation — role string is the only prop, icons resolved client-side */}
      <div className="flex-1 overflow-y-auto px-3 py-4">
        <SidebarNav role={user.role} />
      </div>

      {/* User footer */}
      <div
        className="px-3 py-3 border-t shrink-0"
        style={{ borderColor: "var(--hive-border)" }}
      >
        <div
          className="flex items-center gap-2.5 px-2 py-2 rounded-xl"
          style={{ background: "var(--hive-surface)" }}
        >
          <UserAvatar name={user.fullName} avatarUrl={user.avatarUrl} size="sm" />
          <div className="flex-1 min-w-0">
            <p
              className="text-xs font-semibold truncate"
              style={{ color: "var(--hive-text)", fontFamily: "var(--font-sans)" }}
            >
              {user.fullName}
            </p>
            <p
              className="text-[10px] truncate mt-0.5"
              style={{ color: "var(--hive-primary)", fontFamily: "var(--font-mono)" }}
            >
              {getRoleLabel(user.role)}
            </p>
          </div>

          {/* Logout form action */}
          <form action={logoutAction}>
            <button
              type="submit"
              className="shrink-0 p-1 rounded-lg hover:bg-white transition-colors"
              style={{ color: "var(--hive-muted)" }}
              title="Sign out"
              aria-label="Sign out"
            >
              <svg
                width="14" height="14" viewBox="0 0 24 24"
                fill="none" stroke="currentColor"
                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
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
