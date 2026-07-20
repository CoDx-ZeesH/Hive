import Link from "next/link";

/**
 * Hive Landing Page — Phase 1 placeholder.
 *
 * Demonstrates the design system:
 * - Plus Jakarta Sans (General Sans substitute) for headings/body
 * - JetBrains Mono for badges, buttons, stats, labels
 * - Hive color palette: Primary #0DB4C9, Accent #FF6B6B, Surface #F8FAFC
 * - Flat cards, rounded corners, no gradients, no glassmorphism
 */

const stats = [
  { label: "COMMUNITIES", value: "01" },
  { label: "MEMBERS", value: "000" },
  { label: "EVENTS", value: "000" },
  { label: "VERSION", value: "0.1.0" },
];

const features = [
  {
    icon: "🫂",
    title: "Community First",
    tag: "PEOPLE",
    description:
      "Build engaged, thriving developer communities with tools designed for the entire community lifecycle.",
  },
  {
    icon: "📅",
    title: "Events & Attendance",
    tag: "EVENTS",
    description:
      "Create events, manage RSVPs, track attendance via QR codes, and issue certificates automatically.",
  },
  {
    icon: "🏆",
    title: "Growth & Gamification",
    tag: "GROWTH",
    description:
      "Community Score engine rewards participation. Leaderboards, badges, and streaks keep members engaged.",
  },
  {
    icon: "📊",
    title: "Analytics Dashboard",
    tag: "ANALYTICS",
    description:
      "Real-time insights into member growth, event attendance, and community health metrics.",
  },
];

export default function HomePage() {
  return (
    <main className="flex flex-col min-h-dvh">
      {/* ─── Navigation ──────────────────────────────────────────── */}
      <nav
        className="sticky top-0 z-50 border-b"
        style={{
          background: "rgba(255,255,255,0.92)",
          backdropFilter: "blur(8px)",
          borderColor: "var(--hive-border)",
        }}
      >
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-sm font-bold"
              style={{ background: "var(--hive-primary)", fontFamily: "var(--font-mono)" }}
            >
              H
            </div>
            <span
              className="font-bold text-sm tracking-wide"
              style={{
                fontFamily: "var(--font-mono)",
                color: "var(--hive-text)",
              }}
            >
              HIVE
            </span>
            <span
              className="hive-badge ml-1"
              style={{ background: "var(--hive-primary-light)", color: "var(--hive-primary)", borderColor: "var(--hive-primary-light)" }}
            >
              ALPHA
            </span>
          </div>

          {/* Nav links */}
          <div
            className="hidden md:flex items-center gap-6 text-xs font-medium tracking-wide"
            style={{ fontFamily: "var(--font-mono)", color: "var(--hive-muted)" }}
          >
            <Link href="#features" className="hover:text-[var(--hive-text)] transition-colors">
              FEATURES
            </Link>
            <Link href="#about" className="hover:text-[var(--hive-text)] transition-colors">
              ABOUT
            </Link>
          </div>

          {/* CTA */}
          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="hive-btn px-4 py-2 text-xs border hover:bg-[var(--hive-surface)]"
              style={{
                fontFamily: "var(--font-mono)",
                color: "var(--hive-text)",
                borderColor: "var(--hive-border)",
                borderRadius: "var(--radius-md)",
                transition: "all var(--transition-fast)",
              }}
            >
              SIGN_IN
            </Link>
            <Link
              href="/register"
              className="hive-btn px-4 py-2 text-xs text-white"
              style={{
                fontFamily: "var(--font-mono)",
                background: "var(--hive-primary)",
                borderRadius: "var(--radius-md)",
                transition: "all var(--transition-fast)",
              }}
            >
              JOIN_NOW
            </Link>
          </div>
        </div>
      </nav>

      {/* ─── Hero ─────────────────────────────────────────────────── */}
      <section
        className="flex-1 flex flex-col items-center justify-center px-6 py-24 text-center"
        style={{ background: "var(--hive-surface)" }}
      >
        {/* Status badge */}
        <div
          className="hive-badge mb-6 px-4 py-1.5"
          style={{
            background: "var(--hive-primary-light)",
            color: "var(--hive-primary)",
            borderColor: "var(--hive-primary-light)",
          }}
        >
          🚧 MVP_IN_PROGRESS · PHASE_01
        </div>

        {/* Heading */}
        <h1
          className="text-5xl md:text-7xl font-bold tracking-tight mb-6 max-w-3xl"
          style={{ color: "var(--hive-text)", letterSpacing: "-0.03em" }}
        >
          The Community
          <br />
          <span style={{ color: "var(--hive-primary)" }}>Operating System</span>
        </h1>

        {/* Subheading */}
        <p
          className="text-lg md:text-xl max-w-xl mb-10 leading-relaxed"
          style={{ color: "var(--hive-muted)" }}
        >
          Build communities, not just events. Hive is a unified platform for
          student developer communities to grow, engage, and thrive together.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 mb-16">
          <Link
            href="/register"
            className="hive-btn px-8 py-3.5 text-sm text-white"
            style={{
              fontFamily: "var(--font-mono)",
              background: "var(--hive-primary)",
              borderRadius: "var(--radius-md)",
            }}
          >
            GET_STARTED
          </Link>
          <Link
            href="#features"
            className="hive-btn px-8 py-3.5 text-sm border"
            style={{
              fontFamily: "var(--font-mono)",
              color: "var(--hive-text)",
              borderColor: "var(--hive-border)",
              borderRadius: "var(--radius-md)",
              background: "#fff",
            }}
          >
            LEARN_MORE
          </Link>
        </div>

        {/* Stats bar */}
        <div
          className="flex flex-wrap justify-center gap-8 px-8 py-5 border rounded-2xl"
          style={{
            background: "#fff",
            borderColor: "var(--hive-border)",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center gap-1">
              <span
                className="text-3xl font-bold hive-stat"
                style={{ color: "var(--hive-primary)" }}
              >
                {stat.value}
              </span>
              <span
                className="text-xs font-medium"
                style={{
                  fontFamily: "var(--font-mono)",
                  color: "var(--hive-muted)",
                  letterSpacing: "0.08em",
                }}
              >
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Features ─────────────────────────────────────────────── */}
      <section id="features" className="px-6 py-20" style={{ background: "#fff" }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <span
              className="hive-badge mb-4 inline-flex"
              style={{
                background: "var(--hive-surface)",
                color: "var(--hive-muted)",
              }}
            >
              FEATURES
            </span>
            <h2
              className="text-4xl font-bold"
              style={{ color: "var(--hive-text)" }}
            >
              Everything your community needs
            </h2>
            <p
              className="mt-3 text-lg max-w-xl mx-auto"
              style={{ color: "var(--hive-muted)" }}
            >
              Six core modules designed to support every stage of your
              community&apos;s growth.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((feature) => (
              <div key={feature.tag} className="hive-card p-6 flex flex-col gap-4">
                <span className="text-3xl">{feature.icon}</span>
                <div>
                  <span
                    className="hive-badge mb-2"
                    style={{
                      color: "var(--hive-primary)",
                      borderColor: "var(--hive-primary-light)",
                      background: "var(--hive-primary-light)",
                    }}
                  >
                    {feature.tag}
                  </span>
                  <h3
                    className="text-base font-bold mt-2"
                    style={{ color: "var(--hive-text)" }}
                  >
                    {feature.title}
                  </h3>
                  <p
                    className="text-sm mt-1.5 leading-relaxed"
                    style={{ color: "var(--hive-muted)" }}
                  >
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Footer ───────────────────────────────────────────────── */}
      <footer
        className="border-t px-6 py-8"
        style={{ borderColor: "var(--hive-border)", background: "var(--hive-surface)" }}
      >
        <div
          className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <div
            className="flex items-center gap-2 text-xs font-medium"
            style={{ fontFamily: "var(--font-mono)", color: "var(--hive-muted)" }}
          >
            <span
              className="w-5 h-5 rounded flex items-center justify-center text-white text-xs font-bold"
              style={{ background: "var(--hive-primary)" }}
            >
              H
            </span>
            HIVE · COMMUNITY_OS · v0.1.0
          </div>
          <p
            className="text-xs"
            style={{ fontFamily: "var(--font-mono)", color: "var(--hive-muted)" }}
          >
            BUILD_FOR_BUILDERS · PHASE_01_COMPLETE
          </p>
        </div>
      </footer>
    </main>
  );
}
