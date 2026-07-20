/**
 * Auth route group layout.
 * Clean, centered layout for login/register pages.
 * Actual auth UI built in Phase 2.
 */
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="min-h-dvh flex flex-col items-center justify-center px-4"
      style={{ background: "var(--hive-surface)" }}
    >
      {children}
    </div>
  );
}
