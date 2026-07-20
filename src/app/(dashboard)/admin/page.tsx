/**
 * Admin dashboard — Phase 3 will implement the full UI.
 */
export default function AdminDashboardPage() {
  return (
    <div>
      <div className="mb-6">
        <span
          className="hive-badge"
          style={{ color: "var(--hive-text)", borderColor: "var(--hive-border)", background: "var(--hive-surface)" }}
        >
          ADMIN_DASHBOARD
        </span>
        <h1 className="text-3xl font-bold mt-3" style={{ color: "var(--hive-text)" }}>
          Admin Control Panel
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--hive-muted)" }}>
          Admin dashboard UI coming in Phase 3.
        </p>
      </div>
      <div className="grid sm:grid-cols-4 gap-4">
        {["TOTAL_MEMBERS", "COMMUNITIES", "ACTIVE_EVENTS", "SYSTEM_HEALTH"].map((label) => (
          <div key={label} className="hive-card p-5 flex flex-col gap-2">
            <span
              className="text-2xl font-bold hive-stat"
              style={{ color: "var(--hive-text)" }}
            >
              ---
            </span>
            <span
              className="text-xs"
              style={{ fontFamily: "var(--font-mono)", color: "var(--hive-muted)" }}
            >
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
