/**
 * Member dashboard — Phase 3 will implement the full UI.
 */
export default function MemberDashboardPage() {
  return (
    <div>
      <div className="mb-6">
        <span
          className="hive-badge"
          style={{ color: "var(--hive-primary)", borderColor: "var(--hive-primary-light)", background: "var(--hive-primary-light)" }}
        >
          MEMBER_DASHBOARD
        </span>
        <h1 className="text-3xl font-bold mt-3" style={{ color: "var(--hive-text)" }}>
          Welcome back 👋
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--hive-muted)" }}>
          Member dashboard UI coming in Phase 3.
        </p>
      </div>
      <div className="grid sm:grid-cols-3 gap-4">
        {["EVENTS", "SCORE", "BADGES"].map((label) => (
          <div
            key={label}
            className="hive-card p-5 flex flex-col gap-2"
          >
            <span
              className="text-2xl font-bold hive-stat"
              style={{ color: "var(--hive-primary)" }}
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
