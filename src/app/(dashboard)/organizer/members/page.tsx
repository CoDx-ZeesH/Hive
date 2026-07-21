import type { Metadata } from "next";
import { UserAvatar } from "@/components/hive/user-avatar";
import { Search, Filter, UserCheck, UserX, Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "Members",
  description: "View and manage your community members.",
};

const mockMembers = [
  { id: "u1", fullName: "Amara Osei",       username: "amara_dev",    email: "amara@example.com",  role: "MEMBER",    status: "ACTIVE",   joinedAt: "Jul 10, 2026", eventsAttended: 9,  score: 1480 },
  { id: "u2", fullName: "Kwame Asante",      username: "kwame_builds", email: "kwame@example.com",  role: "ORGANIZER", status: "ACTIVE",   joinedAt: "Jul 08, 2026", eventsAttended: 12, score: 1840 },
  { id: "u3", fullName: "Fatima Al-Rashid",  username: "fatima_fx",    email: "fatima@example.com", role: "MEMBER",    status: "ACTIVE",   joinedAt: "Jul 12, 2026", eventsAttended: 10, score: 1620 },
  { id: "u4", fullName: "Dev Kumar",         username: "devkumar_io",  email: "dev@example.com",    role: "MEMBER",    status: "ACTIVE",   joinedAt: "Jul 14, 2026", eventsAttended: 8,  score: 1210 },
  { id: "u5", fullName: "Yemi Okonkwo",      username: "yemi_codes",   email: "yemi@example.com",   role: "MEMBER",    status: "INACTIVE", joinedAt: "Jul 16, 2026", eventsAttended: 6,  score: 980  },
];

const roleColors: Record<string, { color: string; bg: string }> = {
  MEMBER:    { color: "var(--hive-muted)",   bg: "var(--hive-surface)" },
  ORGANIZER: { color: "var(--hive-accent)",  bg: "#ffe4e4" },
  ADMIN:     { color: "var(--hive-primary)", bg: "var(--hive-primary-light)" },
};

const statusColors: Record<string, { color: string; bg: string }> = {
  ACTIVE:   { color: "var(--hive-success)", bg: "#f0fdf4" },
  INACTIVE: { color: "var(--hive-muted)",   bg: "var(--hive-surface)" },
  BANNED:   { color: "var(--hive-accent)",  bg: "#ffe4e4" },
};

export default function OrganizerMembersPage() {
  return (
    <div className="flex flex-col gap-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <span
            className="hive-badge mb-1 inline-flex w-fit"
            style={{ color: "var(--hive-primary)", background: "var(--hive-primary-light)", borderColor: "var(--hive-primary-light)" }}
          >
            COMMUNITY_MEMBERS
          </span>
          <h2 className="text-3xl font-bold" style={{ color: "var(--hive-text)" }}>
            Members
          </h2>
          <p className="text-sm mt-1" style={{ color: "var(--hive-muted)" }}>
            {mockMembers.length} members · {mockMembers.filter(m => m.status === "ACTIVE").length} active
          </p>
        </div>
      </div>

      {/* Search + filter */}
      <div className="flex gap-3 flex-wrap">
        <div className="flex items-center gap-2 hive-input px-3 py-2.5 flex-1 min-w-[200px]">
          <Search size={14} style={{ color: "var(--hive-muted)" }} />
          <input
            type="search"
            placeholder="Search by name, email, or username..."
            className="flex-1 bg-transparent text-sm outline-none"
            style={{ color: "var(--hive-text)" }}
          />
        </div>
        <button
          type="button"
          className="hive-btn px-4 py-2.5 text-xs flex items-center gap-1.5"
          style={{ background: "var(--hive-surface)", color: "var(--hive-muted)", border: "1px solid var(--hive-border)" }}
        >
          <Filter size={13} /> FILTER
        </button>
      </div>

      {/* Table */}
      <div className="hive-card overflow-hidden p-0">
        {/* Header row */}
        <div
          className="grid grid-cols-[1fr_120px_80px_80px_100px] gap-3 px-5 py-3 border-b text-[10px] font-bold uppercase tracking-wider"
          style={{ borderColor: "var(--hive-border)", color: "var(--hive-muted)", fontFamily: "var(--font-mono)", background: "var(--hive-surface)" }}
        >
          <span>MEMBER</span>
          <span>ROLE</span>
          <span className="text-right">EVENTS</span>
          <span className="text-right">SCORE</span>
          <span className="text-right">STATUS</span>
        </div>

        {mockMembers.map((member) => {
          const rc = roleColors[member.role] ?? roleColors.MEMBER;
          const sc = statusColors[member.status] ?? statusColors.ACTIVE;
          return (
            <div
              key={member.id}
              className="grid grid-cols-[1fr_120px_80px_80px_100px] gap-3 items-center px-5 py-3.5 border-b last:border-b-0 hover:bg-[var(--hive-surface)] transition-colors"
              style={{ borderColor: "var(--hive-border)" }}
            >
              {/* Member info */}
              <div className="flex items-center gap-3 min-w-0">
                <UserAvatar name={member.fullName} size="sm" />
                <div className="min-w-0">
                  <p className="text-xs font-semibold truncate" style={{ color: "var(--hive-text)" }}>{member.fullName}</p>
                  <p className="text-[10px] truncate" style={{ color: "var(--hive-muted)", fontFamily: "var(--font-mono)" }}>@{member.username}</p>
                </div>
              </div>

              {/* Role */}
              <span
                className="hive-badge text-[10px] w-fit"
                style={{ color: rc.color, background: rc.bg, borderColor: rc.bg }}
              >
                {member.role}
              </span>

              {/* Events */}
              <p className="text-xs font-semibold text-right" style={{ color: "var(--hive-muted)", fontFamily: "var(--font-mono)" }}>
                {member.eventsAttended}
              </p>

              {/* Score */}
              <p className="text-xs font-bold text-right" style={{ color: "var(--hive-primary)", fontFamily: "var(--font-mono)" }}>
                {member.score.toLocaleString()}
              </p>

              {/* Status */}
              <div className="flex justify-end">
                <span
                  className="hive-badge text-[10px]"
                  style={{ color: sc.color, background: sc.bg, borderColor: sc.bg }}
                >
                  {member.status}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
