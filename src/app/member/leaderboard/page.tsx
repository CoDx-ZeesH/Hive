import type { Metadata } from "next";
import { Trophy, Medal, Star, TrendingUp, Crown } from "lucide-react";
import { UserAvatar } from "@/components/hive/user-avatar";

export const metadata: Metadata = {
  title: "Leaderboard",
  description: "Community score rankings — see who's leading the pack.",
};

// ─── Mock data (Phase 5 DB wiring done inline below) ─────────────────────────

const mockLeaderboard = [
  { rank: 1,  fullName: "Kwame Asante",     username: "kwame_builds",  score: 1840, eventsAttended: 12, badges: 5,  role: "ORGANIZER", streak: 8 },
  { rank: 2,  fullName: "Fatima Al-Rashid", username: "fatima_fx",     score: 1620, eventsAttended: 10, badges: 4,  role: "MEMBER",    streak: 5 },
  { rank: 3,  fullName: "Amara Osei",       username: "amara_dev",     score: 1480, eventsAttended: 9,  badges: 3,  role: "MEMBER",    streak: 6 },
  { rank: 4,  fullName: "Dev Kumar",        username: "devkumar_io",   score: 1210, eventsAttended: 8,  badges: 3,  role: "MEMBER",    streak: 3 },
  { rank: 5,  fullName: "Yemi Okonkwo",     username: "yemi_codes",    score: 980,  eventsAttended: 6,  badges: 2,  role: "MEMBER",    streak: 2 },
  { rank: 6,  fullName: "Priya Sharma",     username: "priya_builds",  score: 860,  eventsAttended: 5,  badges: 2,  role: "MEMBER",    streak: 4 },
  { rank: 7,  fullName: "Marcus Johnson",   username: "marcus_dev",    score: 720,  eventsAttended: 4,  badges: 1,  role: "MEMBER",    streak: 1 },
  { rank: 8,  fullName: "Lena Fischer",     username: "lena_fx",       score: 640,  eventsAttended: 4,  badges: 1,  role: "MEMBER",    streak: 2 },
  { rank: 9,  fullName: "Rafi Hassan",      username: "rafi_hacks",    score: 540,  eventsAttended: 3,  badges: 1,  role: "MEMBER",    streak: 1 },
  { rank: 10, fullName: "Ada Chen",         username: "ada_codes",     score: 420,  eventsAttended: 2,  badges: 0,  role: "MEMBER",    streak: 0 },
];

const rankStyles = [
  { bg: "linear-gradient(135deg, #fbbf24, #f59e0b)", color: "#fff", icon: Crown },
  { bg: "linear-gradient(135deg, #94a3b8, #64748b)", color: "#fff", icon: Medal },
  { bg: "linear-gradient(135deg, #cd7c2f, #a16207)", color: "#fff", icon: Medal },
];

export default function LeaderboardPage() {
  const top3 = mockLeaderboard.slice(0, 3);
  const rest = mockLeaderboard.slice(3);

  return (
    <div className="flex flex-col gap-8 max-w-3xl">
      {/* Header */}
      <div>
        <span
          className="hive-badge mb-1 inline-flex w-fit"
          style={{ color: "var(--hive-primary)", background: "var(--hive-primary-light)", borderColor: "var(--hive-primary-light)" }}
        >
          COMMUNITY_LEADERBOARD
        </span>
        <h2 className="text-3xl font-bold" style={{ color: "var(--hive-text)" }}>
          Leaderboard 🏆
        </h2>
        <p className="text-sm mt-1" style={{ color: "var(--hive-muted)" }}>
          Ranked by community score · updated in real-time
        </p>
      </div>

      {/* Top 3 podium */}
      <div className="grid grid-cols-3 gap-3">
        {/* Reorder: 2nd, 1st, 3rd for podium effect */}
        {[top3[1], top3[0], top3[2]].map((member, i) => {
          if (!member) return null;
          const podiumRank = i === 1 ? 1 : i === 0 ? 2 : 3;
          const actualMember = top3[podiumRank - 1];
          const style = rankStyles[podiumRank - 1];
          const RankIcon = style.icon;
          const isFirst = podiumRank === 1;

          return (
            <div
              key={actualMember.username}
              className={`hive-card flex flex-col items-center gap-2 p-4 text-center ${isFirst ? "ring-2 ring-[var(--hive-primary)]" : ""}`}
              style={{ order: isFirst ? -1 : undefined }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-1"
                style={{ background: style.bg }}
              >
                <RankIcon size={18} style={{ color: style.color }} strokeWidth={2.5} />
              </div>
              <UserAvatar name={actualMember.fullName} size={isFirst ? "md" : "sm"} />
              <div>
                <p className="text-xs font-bold truncate max-w-[100px]" style={{ color: "var(--hive-text)" }}>
                  {actualMember.fullName.split(" ")[0]}
                </p>
                <p className="text-[10px]" style={{ color: "var(--hive-muted)", fontFamily: "var(--font-mono)" }}>
                  @{actualMember.username}
                </p>
              </div>
              <div
                className="text-lg font-bold hive-stat"
                style={{ color: podiumRank === 1 ? "#f59e0b" : "var(--hive-primary)" }}
              >
                {actualMember.score.toLocaleString()}
              </div>
              <p
                className="text-[10px] uppercase tracking-wide"
                style={{ fontFamily: "var(--font-mono)", color: "var(--hive-muted)" }}
              >
                PTS
              </p>
            </div>
          );
        })}
      </div>

      {/* Full table */}
      <div className="hive-card overflow-hidden p-0">
        {/* Table header */}
        <div
          className="grid grid-cols-[40px_1fr_80px_80px_60px] gap-3 px-5 py-3 border-b text-[10px] font-bold uppercase tracking-wider"
          style={{ borderColor: "var(--hive-border)", color: "var(--hive-muted)", fontFamily: "var(--font-mono)", background: "var(--hive-surface)" }}
        >
          <span>#</span>
          <span>MEMBER</span>
          <span className="text-right">SCORE</span>
          <span className="text-right">EVENTS</span>
          <span className="text-right">BADGES</span>
        </div>

        {/* Top 3 in table */}
        {top3.map((member) => (
          <LeaderRow key={member.username} member={member} isTop3 />
        ))}

        {/* Divider */}
        <div
          className="flex items-center gap-3 px-5 py-2 border-y"
          style={{ borderColor: "var(--hive-border)", background: "var(--hive-surface)" }}
        >
          <div className="flex-1 h-px" style={{ background: "var(--hive-border)" }} />
          <span className="text-[10px] uppercase tracking-widest" style={{ color: "var(--hive-muted)", fontFamily: "var(--font-mono)" }}>
            TOP_10
          </span>
          <div className="flex-1 h-px" style={{ background: "var(--hive-border)" }} />
        </div>

        {/* Ranks 4–10 */}
        {rest.map((member) => (
          <LeaderRow key={member.username} member={member} />
        ))}
      </div>
    </div>
  );
}

// ─── Row component ─────────────────────────────────────────────────────────────

function LeaderRow({
  member,
  isTop3 = false,
}: {
  member: (typeof mockLeaderboard)[0];
  isTop3?: boolean;
}) {
  const rankColor =
    member.rank === 1 ? "#f59e0b" :
    member.rank === 2 ? "#94a3b8" :
    member.rank === 3 ? "#cd7c2f" :
    "var(--hive-muted)";

  return (
    <div
      className="grid grid-cols-[40px_1fr_80px_80px_60px] gap-3 items-center px-5 py-3 border-b last:border-b-0 transition-colors hover:bg-[var(--hive-surface)]"
      style={{ borderColor: "var(--hive-border)", background: isTop3 && member.rank === 1 ? "rgba(13,180,201,0.04)" : undefined }}
    >
      {/* Rank */}
      <span
        className="text-sm font-bold w-7 h-7 flex items-center justify-center rounded-lg"
        style={{
          fontFamily: "var(--font-mono)",
          color: rankColor,
          background: isTop3 ? `${rankColor}18` : "transparent",
        }}
      >
        {member.rank}
      </span>

      {/* Member */}
      <div className="flex items-center gap-2.5 min-w-0">
        <UserAvatar name={member.fullName} size="sm" />
        <div className="min-w-0">
          <p className="text-xs font-semibold truncate" style={{ color: "var(--hive-text)" }}>
            {member.fullName}
          </p>
          <div className="flex items-center gap-1.5">
            <p className="text-[10px] truncate" style={{ color: "var(--hive-muted)", fontFamily: "var(--font-mono)" }}>
              @{member.username}
            </p>
            {member.streak > 0 && (
              <span className="text-[10px]" title={`${member.streak} week streak`}>
                🔥{member.streak}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Score */}
      <div className="text-right">
        <span
          className="text-sm font-bold hive-stat"
          style={{ color: isTop3 ? rankColor : "var(--hive-text)" }}
        >
          {member.score.toLocaleString()}
        </span>
      </div>

      {/* Events */}
      <div className="text-right">
        <span className="text-xs font-semibold" style={{ color: "var(--hive-muted)", fontFamily: "var(--font-mono)" }}>
          {member.eventsAttended}
        </span>
      </div>

      {/* Badges */}
      <div className="text-right flex items-center justify-end gap-0.5">
        {member.badges > 0 && <Star size={11} style={{ color: "#f59e0b" }} />}
        <span className="text-xs font-semibold" style={{ color: "var(--hive-muted)", fontFamily: "var(--font-mono)" }}>
          {member.badges}
        </span>
      </div>
    </div>
  );
}
