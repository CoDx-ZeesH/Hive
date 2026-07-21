import type { Metadata } from "next";
import { UserAvatar } from "@/components/hive/user-avatar";
import { Code2, ExternalLink, Globe, Search } from "lucide-react";

export const metadata: Metadata = {
  title: "Community",
  description: "Browse member profiles in your developer community.",
};

const mockMembers = [
  {
    id: "usr-001",
    fullName: "Amara Osei",
    username: "amara_dev",
    bio: "Full-stack dev passionate about accessibility and open source. Building with Next.js and Rust.",
    role: "MEMBER",
    skills: ["Next.js", "TypeScript", "Rust", "Figma"],
    githubUrl: "https://github.com",
    linkedinUrl: null,
    portfolioUrl: "https://example.com",
  },
  {
    id: "usr-002",
    fullName: "Kwame Asante",
    username: "kwame_builds",
    bio: "ML engineer turned community builder. If it involves GPUs and people, I'm in.",
    role: "ORGANIZER",
    skills: ["Python", "PyTorch", "FastAPI", "Community"],
    githubUrl: "https://github.com",
    linkedinUrl: "https://linkedin.com",
    portfolioUrl: null,
  },
  {
    id: "usr-003",
    fullName: "Fatima Al-Rashid",
    username: "fatima_fx",
    bio: "Frontend engineer with a design soul. I obsess over micro-interactions and smooth UX.",
    role: "MEMBER",
    skills: ["React", "Framer Motion", "CSS", "Three.js"],
    githubUrl: "https://github.com",
    linkedinUrl: null,
    portfolioUrl: "https://example.com",
  },
  {
    id: "usr-004",
    fullName: "Dev Kumar",
    username: "devkumar_io",
    bio: "Backend systems and DevOps. I make the servers go brrr.",
    role: "MEMBER",
    skills: ["Go", "Kubernetes", "PostgreSQL", "Redis"],
    githubUrl: "https://github.com",
    linkedinUrl: "https://linkedin.com",
    portfolioUrl: null,
  },
];

const roleColors: Record<string, { bg: string; color: string }> = {
  MEMBER:    { bg: "var(--hive-surface)",     color: "var(--hive-muted)" },
  ORGANIZER: { bg: "#ffe4e4",                color: "var(--hive-accent)" },
  ADMIN:     { bg: "var(--hive-primary-light)", color: "var(--hive-primary)" },
};

export default function CommunityPage() {
  return (
    <div className="flex flex-col gap-8 max-w-4xl">
      {/* Header */}
      <div>
        <span
          className="hive-badge mb-1 inline-flex w-fit"
          style={{ color: "var(--hive-primary)", background: "var(--hive-primary-light)", borderColor: "var(--hive-primary-light)" }}
        >
          MEMBER_DIRECTORY
        </span>
        <h2 className="text-3xl font-bold" style={{ color: "var(--hive-text)" }}>
          Community
        </h2>
        <p className="text-sm mt-1" style={{ color: "var(--hive-muted)" }}>
          {mockMembers.length} builders in your community.
        </p>
      </div>

      {/* Search */}
      <div className="flex items-center gap-3 hive-input px-4 py-3">
        <Search size={16} style={{ color: "var(--hive-muted)" }} />
        <input
          type="search"
          placeholder="Search by name, skill, or username..."
          className="flex-1 bg-transparent text-sm outline-none"
          style={{ color: "var(--hive-text)" }}
          aria-label="Search members"
        />
      </div>

      {/* Member grid */}
      <div className="grid sm:grid-cols-2 gap-4">
        {mockMembers.map((member) => {
          const rc = roleColors[member.role] ?? roleColors.MEMBER;
          return (
            <div key={member.id} className="hive-card p-5 flex flex-col gap-4">
              {/* Profile row */}
              <div className="flex items-start gap-3">
                <UserAvatar name={member.fullName} size="md" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3
                      className="text-sm font-bold truncate"
                      style={{ color: "var(--hive-text)" }}
                    >
                      {member.fullName}
                    </h3>
                    <span
                      className="hive-badge text-[9px] shrink-0"
                      style={{ color: rc.color, background: rc.bg, borderColor: rc.bg }}
                    >
                      {member.role}
                    </span>
                  </div>
                  <p
                    className="text-[10px] mt-0.5"
                    style={{ fontFamily: "var(--font-mono)", color: "var(--hive-muted)" }}
                  >
                    @{member.username}
                  </p>
                </div>
              </div>

              {/* Bio */}
              {member.bio && (
                <p className="text-xs line-clamp-2" style={{ color: "var(--hive-muted)" }}>
                  {member.bio}
                </p>
              )}

              {/* Skills */}
              <div className="flex flex-wrap gap-1.5">
                {member.skills.map((skill) => (
                  <span
                    key={skill}
                    className="hive-badge text-[10px]"
                    style={{
                      color: "var(--hive-text)",
                      background: "var(--hive-surface)",
                      borderColor: "var(--hive-border)",
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>

              {/* Social links */}
              <div
                className="flex items-center gap-3 pt-1 border-t"
                style={{ borderColor: "var(--hive-border)" }}
              >
                {member.githubUrl && (
                  <a
                    href={member.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:opacity-70 transition-opacity"
                    aria-label="GitHub"
                    style={{ color: "var(--hive-muted)" }}
                  >
                    <Code2 size={15} strokeWidth={2} />
                  </a>
                )}
                {member.linkedinUrl && (
                  <a
                    href={member.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:opacity-70 transition-opacity"
                    aria-label="LinkedIn"
                    style={{ color: "var(--hive-muted)" }}
                  >
                    <ExternalLink size={15} strokeWidth={2} />
                  </a>
                )}
                {member.portfolioUrl && (
                  <a
                    href={member.portfolioUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:opacity-70 transition-opacity"
                    aria-label="Portfolio"
                    style={{ color: "var(--hive-muted)" }}
                  >
                    <Globe size={15} strokeWidth={2} />
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
