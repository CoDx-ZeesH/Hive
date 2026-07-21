import type { Metadata } from "next";
import {
  ExternalLink,
  Calendar,
  Globe,
  Code2,
  Users,
  Briefcase,
  BookOpen,
  HeartHandshake,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Opportunities",
  description: "Discover hackathons, internships, open source projects and volunteer opportunities.",
};

const opportunityTypes = [
  { key: "ALL",         label: "ALL_OPPS",     icon: Globe },
  { key: "HACKATHON",   label: "HACKATHONS",   icon: Code2 },
  { key: "INTERNSHIP",  label: "INTERNSHIPS",  icon: Briefcase },
  { key: "OPEN_SOURCE", label: "OPEN_SOURCE",  icon: BookOpen },
  { key: "VOLUNTEER",   label: "VOLUNTEER",    icon: HeartHandshake },
];

const mockOpportunities = [
  {
    id: "opp-001",
    title: "Google Summer of Code 2026",
    org: "Google",
    type: "OPEN_SOURCE",
    description: "Contribute to open-source projects mentored by Google engineers. 12-week paid remote program for students and beginners.",
    tags: ["Python", "JavaScript", "Go", "Remote"],
    deadline: "Apr 2, 2027",
    link: "https://summerofcode.withgoogle.com",
    featured: true,
  },
  {
    id: "opp-002",
    title: "HackMIT 2026",
    org: "MIT",
    type: "HACKATHON",
    description: "One of the world's premier collegiate hackathons. 24 hours, $50k+ in prizes, 1000+ hackers.",
    tags: ["All Skills", "In-Person", "Travel Reimbursed"],
    deadline: "Aug 15, 2026",
    link: "https://hackmit.org",
    featured: true,
  },
  {
    id: "opp-003",
    title: "Frontend Engineer Intern — Vercel",
    org: "Vercel",
    type: "INTERNSHIP",
    description: "Work on the Next.js ecosystem and Vercel platform. 6-month remote internship for university students.",
    tags: ["React", "TypeScript", "Remote", "Paid"],
    deadline: "Sep 30, 2026",
    link: "https://vercel.com/careers",
    featured: false,
  },
  {
    id: "opp-004",
    title: "MLH Fellowship — Explorer Track",
    org: "Major League Hacking",
    type: "OPEN_SOURCE",
    description: "12-week fellowship building open source projects with a team of 3. Stipend provided.",
    tags: ["Any Stack", "Remote", "Stipend"],
    deadline: "Rolling",
    link: "https://fellowship.mlh.io",
    featured: false,
  },
  {
    id: "opp-005",
    title: "Devfolio Open Source Weekend",
    org: "Devfolio",
    type: "HACKATHON",
    description: "48-hour virtual hackathon for contributing to open source projects. Prizes for top contributors.",
    tags: ["Open Source", "Virtual", "Beginner Friendly"],
    deadline: "Aug 1, 2026",
    link: "https://devfolio.co",
    featured: false,
  },
  {
    id: "opp-006",
    title: "Community Mentor — Code Your Future",
    org: "Code Your Future",
    type: "VOLUNTEER",
    description: "Mentor refugees and disadvantaged adults learning to code. 2-4 hrs/week, fully remote, rewarding.",
    tags: ["Mentoring", "Remote", "Any Skill Level"],
    deadline: "Open",
    link: "https://codeyourfuture.io",
    featured: false,
  },
];

const typeConfig: Record<string, { bg: string; color: string; label: string }> = {
  HACKATHON:   { bg: "var(--hive-primary-light)", color: "var(--hive-primary)", label: "HACKATHON"   },
  INTERNSHIP:  { bg: "#f3e8ff",                   color: "#a855f7",              label: "INTERNSHIP"  },
  OPEN_SOURCE: { bg: "#f0fdf4",                   color: "var(--hive-success)",  label: "OPEN_SOURCE" },
  VOLUNTEER:   { bg: "#ffe4e4",                   color: "var(--hive-accent)",   label: "VOLUNTEER"   },
};

export default function OpportunitiesPage() {
  const featured = mockOpportunities.filter((o) => o.featured);
  const regular = mockOpportunities.filter((o) => !o.featured);

  return (
    <div className="flex flex-col gap-8 max-w-3xl">
      {/* Header */}
      <div>
        <span
          className="hive-badge mb-1 inline-flex w-fit"
          style={{ color: "#a855f7", background: "#f3e8ff", borderColor: "#f3e8ff" }}
        >
          OPPORTUNITIES_BOARD
        </span>
        <h2 className="text-3xl font-bold" style={{ color: "var(--hive-text)" }}>
          Opportunities 🚀
        </h2>
        <p className="text-sm mt-1" style={{ color: "var(--hive-muted)" }}>
          Hackathons, internships, open source & volunteer roles curated for your community.
        </p>
      </div>

      {/* Type filter */}
      <div className="flex gap-2 flex-wrap">
        {opportunityTypes.map((t, i) => (
          <button
            key={t.key}
            type="button"
            className="hive-badge flex items-center gap-1.5 cursor-pointer"
            style={{
              color: i === 0 ? "#fff" : "var(--hive-muted)",
              background: i === 0 ? "var(--hive-primary)" : "var(--hive-surface)",
              borderColor: i === 0 ? "var(--hive-primary)" : "var(--hive-border)",
            }}
          >
            <t.icon size={11} />
            {t.label}
          </button>
        ))}
      </div>

      {/* Featured */}
      {featured.length > 0 && (
        <div className="flex flex-col gap-3">
          <h3
            className="text-xs font-bold uppercase tracking-wider"
            style={{ fontFamily: "var(--font-mono)", color: "var(--hive-muted)" }}
          >
            ⭐ FEATURED
          </h3>
          {featured.map((opp) => (
            <OpportunityCard key={opp.id} opp={opp} featured />
          ))}
        </div>
      )}

      {/* All opportunities */}
      <div className="flex flex-col gap-3">
        <h3
          className="text-xs font-bold uppercase tracking-wider"
          style={{ fontFamily: "var(--font-mono)", color: "var(--hive-muted)" }}
        >
          ALL_OPPORTUNITIES ({mockOpportunities.length})
        </h3>
        {regular.map((opp) => (
          <OpportunityCard key={opp.id} opp={opp} />
        ))}
      </div>
    </div>
  );
}

// ─── Card ──────────────────────────────────────────────────────────────────────

function OpportunityCard({
  opp,
  featured = false,
}: {
  opp: (typeof mockOpportunities)[0];
  featured?: boolean;
}) {
  const tc = typeConfig[opp.type] ?? typeConfig.HACKATHON;

  return (
    <div
      className={`hive-card p-5 flex flex-col gap-3 ${featured ? "ring-1 ring-[var(--hive-primary)]" : ""}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1.5">
            <span
              className="hive-badge text-[10px]"
              style={{ color: tc.color, background: tc.bg, borderColor: tc.bg }}
            >
              {tc.label}
            </span>
            {featured && (
              <span
                className="hive-badge text-[10px]"
                style={{ color: "#f59e0b", background: "#fef3c7", borderColor: "#fef3c7" }}
              >
                FEATURED
              </span>
            )}
          </div>
          <h3 className="text-sm font-bold" style={{ color: "var(--hive-text)" }}>
            {opp.title}
          </h3>
          <p
            className="text-[10px] mt-0.5 font-semibold"
            style={{ color: "var(--hive-primary)", fontFamily: "var(--font-mono)" }}
          >
            {opp.org}
          </p>
        </div>

        <a
          href={opp.link}
          target="_blank"
          rel="noopener noreferrer"
          className="hive-btn px-3 py-1.5 text-[11px] text-white flex items-center gap-1.5 shrink-0"
          style={{ background: "var(--hive-primary)" }}
          aria-label={`Apply to ${opp.title}`}
        >
          APPLY <ExternalLink size={11} />
        </a>
      </div>

      <p className="text-xs leading-relaxed" style={{ color: "var(--hive-muted)" }}>
        {opp.description}
      </p>

      <div className="flex items-center justify-between gap-3 flex-wrap">
        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {opp.tags.map((tag) => (
            <span
              key={tag}
              className="hive-badge text-[10px]"
              style={{ color: "var(--hive-text)", background: "var(--hive-surface)", borderColor: "var(--hive-border)" }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Deadline */}
        <div
          className="flex items-center gap-1 text-[10px] shrink-0"
          style={{ color: "var(--hive-muted)", fontFamily: "var(--font-mono)" }}
        >
          <Calendar size={11} />
          DEADLINE: {opp.deadline}
        </div>
      </div>
    </div>
  );
}
