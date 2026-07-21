import type { Metadata } from "next";
import {
  MapPin, Globe, Code2, ExternalLink,
  CalendarDays, Trophy, Star, Edit,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { UserAvatar } from "@/components/hive/user-avatar";

export const metadata: Metadata = {
  title: "My Profile",
  description: "Your Hive member profile.",
};

// ─── Mock profile (replaced by DB in Phase 6) ────────────────────────────────

const mockProfile = {
  fullName: "Zeeshanul Haq",
  username: "zeesh_dev",
  email: "zeesh@hive.dev",
  bio: "Full-stack developer passionate about building tools that empower communities. Next.js, TypeScript, and good coffee.",
  role: "MEMBER",
  location: "Lahore, PK",
  githubUrl: "https://github.com",
  linkedinUrl: "https://linkedin.com",
  portfolioUrl: "https://example.com",
  skills: ["Next.js", "TypeScript", "Prisma", "Supabase", "Tailwind CSS", "PostgreSQL"],
  interests: ["Web3", "AI/ML", "DevTools", "Community Building"],
  joinedAt: new Date("2026-07-20"),
  stats: { eventsAttended: 0, communityScore: 0, badges: 0, streak: 0 },
};

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const displayName =
    (user.user_metadata?.full_name as string | undefined) ??
    mockProfile.fullName;

  const profile = { ...mockProfile, fullName: displayName, email: user.email ?? mockProfile.email };

  return (
    <div className="flex flex-col gap-8 max-w-3xl">
      {/* Header card */}
      <div className="hive-card p-6 flex flex-col sm:flex-row gap-5 items-start">
        <UserAvatar name={profile.fullName} size="lg" />

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div>
              <h2 className="text-2xl font-bold" style={{ color: "var(--hive-text)" }}>
                {profile.fullName}
              </h2>
              <p
                className="text-sm mt-0.5"
                style={{ color: "var(--hive-primary)", fontFamily: "var(--font-mono)" }}
              >
                @{profile.username}
              </p>
            </div>
            <button
              type="button"
              className="hive-btn px-4 py-2 text-xs flex items-center gap-1.5"
              style={{ background: "var(--hive-surface)", color: "var(--hive-muted)", border: "1px solid var(--hive-border)" }}
            >
              <Edit size={13} /> EDIT_PROFILE
            </button>
          </div>

          {profile.bio && (
            <p className="text-sm mt-3 leading-relaxed" style={{ color: "var(--hive-muted)" }}>
              {profile.bio}
            </p>
          )}

          <div
            className="flex items-center gap-4 mt-3 text-xs flex-wrap"
            style={{ color: "var(--hive-muted)", fontFamily: "var(--font-mono)" }}
          >
            {profile.location && (
              <span className="flex items-center gap-1">
                <MapPin size={12} /> {profile.location}
              </span>
            )}
            <span className="flex items-center gap-1">
              <CalendarDays size={12} />
              JOINED {profile.joinedAt.toLocaleDateString("en-US", { month: "short", year: "numeric" }).toUpperCase()}
            </span>
          </div>

          {/* Social links */}
          <div className="flex items-center gap-3 mt-3">
            {profile.githubUrl && (
              <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs hover:opacity-70 transition-opacity"
                style={{ color: "var(--hive-muted)", fontFamily: "var(--font-mono)" }}>
                <Code2 size={13} /> GITHUB
              </a>
            )}
            {profile.linkedinUrl && (
              <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs hover:opacity-70 transition-opacity"
                style={{ color: "var(--hive-muted)", fontFamily: "var(--font-mono)" }}>
                <ExternalLink size={13} /> LINKEDIN
              </a>
            )}
            {profile.portfolioUrl && (
              <a href={profile.portfolioUrl} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs hover:opacity-70 transition-opacity"
                style={{ color: "var(--hive-muted)", fontFamily: "var(--font-mono)" }}>
                <Globe size={13} /> PORTFOLIO
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "EVENTS",        value: profile.stats.eventsAttended, icon: CalendarDays, color: "var(--hive-primary)" },
          { label: "SCORE",         value: profile.stats.communityScore, icon: Star,         color: "#f59e0b" },
          { label: "BADGES",        value: profile.stats.badges,         icon: Trophy,       color: "#a855f7" },
          { label: "WK_STREAK",     value: profile.stats.streak,         icon: Star,         color: "var(--hive-accent)" },
        ].map((s) => (
          <div key={s.label} className="hive-card p-4 flex flex-col items-center gap-1 text-center">
            <s.icon size={16} style={{ color: s.color }} strokeWidth={2} />
            <p className="text-xl font-bold hive-stat" style={{ color: s.color }}>
              {s.value}
            </p>
            <p
              className="text-[9px] font-bold uppercase tracking-wider"
              style={{ color: "var(--hive-muted)", fontFamily: "var(--font-mono)" }}
            >
              {s.label}
            </p>
          </div>
        ))}
      </div>

      {/* Skills + Interests */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="hive-card p-5">
          <h3
            className="text-[10px] font-bold uppercase tracking-wider mb-3"
            style={{ fontFamily: "var(--font-mono)", color: "var(--hive-muted)" }}
          >
            SKILLS
          </h3>
          <div className="flex flex-wrap gap-2">
            {profile.skills.map((skill) => (
              <span
                key={skill}
                className="hive-badge text-xs"
                style={{ color: "var(--hive-primary)", background: "var(--hive-primary-light)", borderColor: "var(--hive-primary-light)" }}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div className="hive-card p-5">
          <h3
            className="text-[10px] font-bold uppercase tracking-wider mb-3"
            style={{ fontFamily: "var(--font-mono)", color: "var(--hive-muted)" }}
          >
            INTERESTS
          </h3>
          <div className="flex flex-wrap gap-2">
            {profile.interests.map((interest) => (
              <span
                key={interest}
                className="hive-badge text-xs"
                style={{ color: "var(--hive-text)", background: "var(--hive-surface)", borderColor: "var(--hive-border)" }}
              >
                {interest}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity placeholder */}
      <div className="hive-card p-5">
        <h3
          className="text-[10px] font-bold uppercase tracking-wider mb-4"
          style={{ fontFamily: "var(--font-mono)", color: "var(--hive-muted)" }}
        >
          ACTIVITY_FEED
        </h3>
        <div className="flex flex-col items-center gap-2 py-6">
          <CalendarDays size={28} style={{ color: "var(--hive-border)" }} />
          <p
            className="text-xs"
            style={{ color: "var(--hive-muted)", fontFamily: "var(--font-mono)" }}
          >
            NO_ACTIVITY_YET — RSVP for events to start your journey
          </p>
        </div>
      </div>
    </div>
  );
}
