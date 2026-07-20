import Link from "next/link";

/**
 * AuthCard — Shared layout shell for auth pages (login, register).
 *
 * Design: White card on surface background, rounded corners,
 * subtle border + soft shadow. Hive hexagon logo at top.
 * No gradients, no glassmorphism.
 */
interface AuthCardProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

export function AuthCard({ title, subtitle, children }: AuthCardProps) {
  return (
    <div className="w-full max-w-sm animate-slide-up">
      {/* Logo / Brand */}
      <div className="flex flex-col items-center mb-8">
        <Link href="/" className="flex items-center gap-2 mb-6 group">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-base transition-transform group-hover:scale-105"
            style={{
              background: "var(--hive-primary)",
              fontFamily: "var(--font-mono)",
            }}
          >
            H
          </div>
          <span
            className="font-bold text-base tracking-widest"
            style={{
              fontFamily: "var(--font-mono)",
              color: "var(--hive-text)",
            }}
          >
            HIVE
          </span>
        </Link>

        <h1
          className="text-2xl font-bold text-center"
          style={{ color: "var(--hive-text)" }}
        >
          {title}
        </h1>
        <p
          className="text-sm text-center mt-1.5"
          style={{ color: "var(--hive-muted)", fontFamily: "var(--font-sans)" }}
        >
          {subtitle}
        </p>
      </div>

      {/* Card */}
      <div
        className="bg-white border rounded-2xl p-8"
        style={{
          borderColor: "var(--hive-border)",
          boxShadow: "var(--shadow-md)",
        }}
      >
        {children}
      </div>

      {/* Footer */}
      <p
        className="text-center text-xs mt-6"
        style={{
          color: "var(--hive-muted)",
          fontFamily: "var(--font-mono)",
        }}
      >
        HIVE · COMMUNITY_OS · v0.1.0
      </p>
    </div>
  );
}
