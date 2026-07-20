/**
 * Organizer dashboard — Phase 3 will implement the full UI.
 */
export default function OrganizerDashboardPage() {
  return (
    <div>
      <div className="mb-6">
        <span
          className="hive-badge"
          style={{ color: "var(--hive-accent)", borderColor: "#ffe0e0", background: "#ffe0e0" }}
        >
          ORGANIZER_DASHBOARD
        </span>
        <h1 className="text-3xl font-bold mt-3" style={{ color: "var(--hive-text)" }}>
          Organizer Hub
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--hive-muted)" }}>
          Organizer dashboard UI coming in Phase 3.
        </p>
      </div>
      <div className="grid sm:grid-cols-4 gap-4">
        {["EVENTS_CREATED", "TOTAL_RSVPS", "ATTENDANCE", "ANNOUNCEMENTS"].map((label) => (
          <div key={label} className="hive-card p-5 flex flex-col gap-2">
            <span
              className="text-2xl font-bold hive-stat"
              style={{ color: "var(--hive-accent)" }}
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
