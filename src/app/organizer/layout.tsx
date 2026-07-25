import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Sidebar } from "@/components/hive/sidebar";
import { TopBar } from "@/components/hive/top-bar";
import type { UserRole } from "@/types";

/**
 * Dashboard Layout — Server Component.
 *
 * Fetches the authenticated user from Supabase on the server,
 * then renders the sidebar and topbar shells around the page content.
 * The proxy (middleware) already guards this route — this is a second
 * server-side check as a defence-in-depth measure.
 */
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Build a safe user object from Supabase metadata
  const dashboardUser = {
    fullName:
      (user.user_metadata?.full_name as string | undefined) ??
      user.email?.split("@")[0] ??
      "Member",
    email: user.email ?? "",
    role: ((user.user_metadata?.role as string | undefined) ??
      "MEMBER") as UserRole,
    avatarUrl:
      (user.user_metadata?.avatar_url as string | undefined) ?? null,
  };

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "var(--hive-surface)" }}>
      {/* Sidebar — hidden on mobile, visible md+ */}
      <Sidebar user={dashboardUser} />

      {/* Main area */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <TopBar user={dashboardUser} />

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  );
}
