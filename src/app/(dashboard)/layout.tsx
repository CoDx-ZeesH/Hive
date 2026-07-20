/**
 * Dashboard route group layout.
 * Sidebar + main content shell — Phase 3 will implement the full layout.
 */
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-dvh flex" style={{ background: "var(--hive-surface)" }}>
      {/* Sidebar placeholder */}
      <aside
        className="w-60 border-r flex-shrink-0 p-4 hidden md:flex flex-col"
        style={{ background: "#fff", borderColor: "var(--hive-border)" }}
      >
        <div
          className="flex items-center gap-2 mb-8 px-2"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          <div
            className="w-6 h-6 rounded flex items-center justify-center text-white text-xs font-bold"
            style={{ background: "var(--hive-primary)" }}
          >
            H
          </div>
          <span className="text-sm font-bold" style={{ color: "var(--hive-text)" }}>
            HIVE
          </span>
        </div>
        <p
          className="text-xs px-2"
          style={{ fontFamily: "var(--font-mono)", color: "var(--hive-muted)" }}
        >
          SIDEBAR_PHASE_3
        </p>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto p-6 md:p-8">{children}</main>
    </div>
  );
}
