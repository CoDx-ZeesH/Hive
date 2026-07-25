import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { CommunityForm } from "@/components/hive/community-form";
import { AssignOrganizerForm } from "@/components/hive/assign-organizer-form";

export default async function AdminCommunitiesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const dbUser = await prisma.user.findUnique({ where: { authId: user.id } });
  if (dbUser?.role !== "ADMIN") redirect("/member");

  const [communities, organizers] = await Promise.all([
    prisma.community.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: { select: { memberships: true, events: true } },
        memberships: {
          where: { role: "ORGANIZER" },
          include: { user: true }
        }
      }
    }),
    prisma.user.findMany({
      where: { role: { in: ["ORGANIZER", "ADMIN"] } },
      orderBy: { fullName: "asc" }
    })
  ]);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight" style={{ fontFamily: "var(--font-sans)", color: "var(--hive-text)" }}>
          Communities
        </h1>
        <p className="mt-2 text-sm text-gray-500 max-w-2xl">
          Manage all developer communities, create new chapters, and assign organizers.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: List of Communities */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <h2 className="text-sm font-bold tracking-widest text-gray-400 uppercase mb-4" style={{ fontFamily: "var(--font-mono)" }}>
              ALL_COMMUNITIES
            </h2>
            
            <div className="space-y-4">
              {communities.length === 0 ? (
                <p className="text-sm text-gray-500">No communities found.</p>
              ) : (
                communities.map(community => (
                  <div key={community.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-gray-300 transition-colors bg-gray-50/50">
                    <div>
                      <h3 className="font-semibold text-lg">{community.name}</h3>
                      <p className="text-xs text-gray-500 mt-1">{community.description || "No description provided."}</p>
                      
                      <div className="flex items-center gap-3 mt-3">
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-[#0DB4C9]/10 text-[#0DB4C9]" style={{ fontFamily: "var(--font-mono)" }}>
                          {community._count.memberships} MEMBERS
                        </span>
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-purple-100 text-purple-700" style={{ fontFamily: "var(--font-mono)" }}>
                          {community._count.events} EVENTS
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-4 sm:mt-0 flex flex-col items-start sm:items-end">
                      <span className="text-[10px] font-bold text-gray-400 mb-1" style={{ fontFamily: "var(--font-mono)" }}>ORGANIZERS</span>
                      {community.memberships.length > 0 ? (
                        <div className="flex flex-wrap gap-1 justify-end">
                          {community.memberships.map(m => (
                            <span key={m.id} className="text-[10px] bg-gray-200 text-gray-700 px-1.5 py-0.5 rounded font-mono">
                              {m.user.fullName}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400 italic">None</span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Forms */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <h2 className="text-sm font-bold tracking-widest text-gray-400 uppercase mb-4" style={{ fontFamily: "var(--font-mono)" }}>
              CREATE_NEW
            </h2>
            <CommunityForm />
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <h2 className="text-sm font-bold tracking-widest text-gray-400 uppercase mb-4" style={{ fontFamily: "var(--font-mono)" }}>
              ASSIGN_ORGANIZER
            </h2>
            <AssignOrganizerForm 
              communities={communities.map(c => ({ id: c.id, name: c.name }))} 
              organizers={organizers.map(o => ({ id: o.id, fullName: o.fullName, email: o.email }))}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
