import type { Metadata } from "next";
import { Globe, Plus, Settings2, Users, Calendar } from "lucide-react";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Communities — Admin",
  description: "Manage all Hive communities.",
};

async function getCommunities() {
  try {
    return await prisma.community.findMany({
      include: { _count: { select: { memberships: true, events: true } } },
      orderBy: { createdAt: "desc" },
    });
  } catch {
    return [];
  }
}

const mockCommunities = [
  { id: "c1", name: "Hive Core",              slug: "hive-core",        description: "The founding community.", website: null, _count: { memberships: 5, events: 2 }, createdAt: new Date("2026-07-01") },
  { id: "c2", name: "GDG Campus — Lahore",    slug: "gdg-lahore",       description: "Google Developer Group.", website: "https://gdg.community", _count: { memberships: 0, events: 0 }, createdAt: new Date("2026-07-15") },
];

export default async function AdminCommunitiesPage() {
  const dbComms = await getCommunities();
  const communities = dbComms.length > 0 ? dbComms : mockCommunities;

  return (
    <div className="flex flex-col gap-8 max-w-4xl">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <span
            className="hive-badge mb-1 inline-flex w-fit"
            style={{ color: "var(--hive-accent)", background: "#ffe4e4", borderColor: "#ffe4e4" }}
          >
            ADMIN › COMMUNITIES
          </span>
          <h2 className="text-3xl font-bold" style={{ color: "var(--hive-text)" }}>
            Communities
          </h2>
          <p className="text-sm mt-1" style={{ color: "var(--hive-muted)" }}>
            {communities.length} communities on the platform
          </p>
        </div>
        <button
          type="button"
          className="hive-btn px-4 py-2.5 text-sm text-white flex items-center gap-2 shrink-0"
          style={{ background: "var(--hive-primary)" }}
        >
          <Plus size={14} /> NEW_COMMUNITY
        </button>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {communities.map((comm) => (
          <div key={comm.id} className="hive-card p-5 flex flex-col gap-4">
            <div className="flex items-start justify-between gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: "var(--hive-primary-light)" }}
              >
                <Globe size={18} style={{ color: "var(--hive-primary)" }} />
              </div>
              <button
                type="button"
                className="p-1.5 rounded-lg hover:bg-[var(--hive-surface)] transition-colors"
                style={{ color: "var(--hive-muted)" }}
              >
                <Settings2 size={14} />
              </button>
            </div>

            <div>
              <h3 className="text-sm font-bold" style={{ color: "var(--hive-text)" }}>
                {comm.name}
              </h3>
              <p
                className="text-[10px] mt-0.5"
                style={{ color: "var(--hive-primary)", fontFamily: "var(--font-mono)" }}
              >
                hive.app/{comm.slug}
              </p>
              {comm.description && (
                <p className="text-xs mt-2 line-clamp-2" style={{ color: "var(--hive-muted)" }}>
                  {comm.description}
                </p>
              )}
            </div>

            <div
              className="flex items-center gap-4 pt-3 border-t"
              style={{ borderColor: "var(--hive-border)" }}
            >
              <div className="flex items-center gap-1.5 text-xs" style={{ color: "var(--hive-muted)", fontFamily: "var(--font-mono)" }}>
                <Users size={12} />
                {comm._count.memberships} members
              </div>
              <div className="flex items-center gap-1.5 text-xs" style={{ color: "var(--hive-muted)", fontFamily: "var(--font-mono)" }}>
                <Calendar size={12} />
                {comm._count.events} events
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
