import type { Metadata } from "next";
import { UserAvatar } from "@/components/hive/user-avatar";
import { Search, ShieldCheck, UserX, UserCog, ChevronDown } from "lucide-react";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Members — Admin",
  description: "Platform-wide member management.",
};

async function getUsers() {
  try {
    return await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
    });
  } catch {
    return [];
  }
}

const mockUsers = [
  { id: "u1", fullName: "Amara Osei",      username: "amara_dev",    email: "amara@example.com",  role: "MEMBER" as const,    createdAt: new Date("2026-07-10") },
  { id: "u2", fullName: "Kwame Asante",     username: "kwame_builds", email: "kwame@example.com",  role: "ORGANIZER" as const, createdAt: new Date("2026-07-08") },
  { id: "u3", fullName: "Fatima Al-Rashid", username: "fatima_fx",   email: "fatima@example.com", role: "MEMBER" as const,    createdAt: new Date("2026-07-12") },
  { id: "u4", fullName: "Dev Kumar",        username: "devkumar_io",  email: "dev@example.com",    role: "MEMBER" as const,    createdAt: new Date("2026-07-14") },
];

const roleColors: Record<string, { color: string; bg: string }> = {
  MEMBER:    { color: "var(--hive-muted)",   bg: "var(--hive-surface)" },
  ORGANIZER: { color: "var(--hive-accent)",  bg: "#ffe4e4" },
  ADMIN:     { color: "var(--hive-primary)", bg: "var(--hive-primary-light)" },
};

export default async function AdminMembersPage() {
  const dbUsers = await getUsers();
  const users = dbUsers.length > 0 ? dbUsers : mockUsers;

  return (
    <div className="flex flex-col gap-8 max-w-5xl">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <span
            className="hive-badge mb-1 inline-flex w-fit"
            style={{ color: "var(--hive-accent)", background: "#ffe4e4", borderColor: "#ffe4e4" }}
          >
            ADMIN › MEMBERS
          </span>
          <h2 className="text-3xl font-bold" style={{ color: "var(--hive-text)" }}>
            All Members
          </h2>
          <p className="text-sm mt-1" style={{ color: "var(--hive-muted)" }}>
            {users.length} registered users across all communities
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="flex items-center gap-2 hive-input px-3 py-2.5">
        <Search size={14} style={{ color: "var(--hive-muted)" }} />
        <input
          type="search"
          placeholder="Search by name, email or username..."
          className="flex-1 bg-transparent text-sm outline-none"
          style={{ color: "var(--hive-text)" }}
        />
      </div>

      {/* Table */}
      <div className="hive-card overflow-hidden p-0">
        <div
          className="grid grid-cols-[1fr_140px_120px_100px] gap-3 px-5 py-3 border-b text-[10px] font-bold uppercase tracking-wider"
          style={{ borderColor: "var(--hive-border)", color: "var(--hive-muted)", fontFamily: "var(--font-mono)", background: "var(--hive-surface)" }}
        >
          <span>MEMBER</span>
          <span>ROLE</span>
          <span>JOINED</span>
          <span className="text-right">ACTIONS</span>
        </div>

        {users.map((user) => {
          const rc = roleColors[user.role] ?? roleColors.MEMBER;
          return (
            <div
              key={user.id}
              className="grid grid-cols-[1fr_140px_120px_100px] gap-3 items-center px-5 py-3.5 border-b last:border-b-0 hover:bg-[var(--hive-surface)] transition-colors"
              style={{ borderColor: "var(--hive-border)" }}
            >
              <div className="flex items-center gap-3 min-w-0">
                <UserAvatar name={user.fullName} size="sm" />
                <div className="min-w-0">
                  <p className="text-xs font-semibold truncate" style={{ color: "var(--hive-text)" }}>{user.fullName}</p>
                  <p className="text-[10px] truncate" style={{ color: "var(--hive-muted)", fontFamily: "var(--font-mono)" }}>{user.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <span
                  className="hive-badge text-[10px]"
                  style={{ color: rc.color, background: rc.bg, borderColor: rc.bg }}
                >
                  {user.role}
                </span>
                <ChevronDown size={11} style={{ color: "var(--hive-muted)" }} />
              </div>

              <p
                className="text-[10px]"
                style={{ color: "var(--hive-muted)", fontFamily: "var(--font-mono)" }}
              >
                {user.createdAt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </p>

              <div className="flex justify-end gap-1.5">
                <button
                  type="button"
                  className="p-1.5 rounded-lg hover:bg-[var(--hive-primary-light)] transition-colors"
                  title="Promote to Organizer"
                  style={{ color: "var(--hive-primary)" }}
                >
                  <ShieldCheck size={13} />
                </button>
                <button
                  type="button"
                  className="p-1.5 rounded-lg hover:bg-[#ffe4e4] transition-colors"
                  title="Ban member"
                  style={{ color: "var(--hive-accent)" }}
                >
                  <UserX size={13} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
