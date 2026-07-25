import type { Metadata } from "next";
import { Search } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { UserAvatar } from "@/components/hive/user-avatar";
import { RoleSelector } from "@/components/hive/role-selector";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Role Management — Admin",
  description: "Platform-wide user role and permissions management.",
};

export default async function AdminMembersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      fullName: true,
      username: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });

  return (
    <div className="flex flex-col gap-8 max-w-5xl">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <span
            className="hive-badge mb-1 inline-flex w-fit"
            style={{ color: "var(--hive-accent)", background: "#ffe4e4", borderColor: "#ffe4e4" }}
          >
            ADMIN › ROLE_MANAGEMENT
          </span>
          <h2 className="text-3xl font-bold" style={{ color: "var(--hive-text)" }}>
            Platform Users & Roles
          </h2>
          <p className="text-sm mt-1" style={{ color: "var(--hive-muted)" }}>
            {users.length} registered user{users.length !== 1 ? "s" : ""} — modify permissions in real-time.
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-2 hive-input px-3 py-2.5">
        <Search size={14} style={{ color: "var(--hive-muted)" }} />
        <input
          type="search"
          placeholder="Search by name, email or username..."
          className="flex-1 bg-transparent text-sm outline-none"
          style={{ color: "var(--hive-text)" }}
          aria-label="Search users"
        />
      </div>

      {/* Users Table */}
      <div className="hive-card overflow-hidden p-0 border border-gray-200">
        <div
          className="grid grid-cols-[1fr_200px_140px_160px] gap-3 px-5 py-3 border-b text-[10px] font-bold uppercase tracking-wider"
          style={{
            borderColor: "var(--hive-border)",
            color: "var(--hive-muted)",
            fontFamily: "var(--font-mono)",
            background: "var(--hive-surface)",
          }}
        >
          <span>MEMBER</span>
          <span>EMAIL</span>
          <span>JOINED</span>
          <span className="text-right">ASSIGN_ROLE</span>
        </div>

        {users.length === 0 ? (
          <div className="p-8 text-center text-xs font-mono text-[var(--hive-muted)]">
            NO_USERS_FOUND
          </div>
        ) : (
          users.map((user) => (
            <div
              key={user.id}
              className="grid grid-cols-[1fr_200px_140px_160px] gap-3 items-center px-5 py-3.5 border-b last:border-b-0 hover:bg-[var(--hive-surface)] transition-colors"
              style={{ borderColor: "var(--hive-border)" }}
            >
              {/* Member Name + Avatar */}
              <div className="flex items-center gap-3 min-w-0">
                <UserAvatar name={user.fullName} size="sm" />
                <div className="min-w-0">
                  <p className="text-xs font-semibold truncate text-[var(--hive-text)]">
                    {user.fullName}
                  </p>
                  <p className="text-[10px] font-mono text-[var(--hive-muted)] truncate">
                    @{user.username}
                  </p>
                </div>
              </div>

              {/* Email */}
              <p className="text-xs font-mono text-[var(--hive-muted)] truncate">
                {user.email}
              </p>

              {/* Joined Date */}
              <p className="text-[10px] font-mono text-[var(--hive-muted)]">
                {formatDate(user.createdAt)}
              </p>

              {/* Interactive Role Selector Client Component */}
              <div className="flex justify-end">
                <RoleSelector userId={user.id} currentRole={user.role} />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
