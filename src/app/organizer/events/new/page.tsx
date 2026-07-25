import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { EventForm } from "@/components/hive/event-form";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Create Event",
  description: "Schedule a new community event.",
};

export default async function CreateEventPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const dbUser = await prisma.user.findUnique({ where: { authId: user.id } });
  
  if (!dbUser || (dbUser.role !== "ORGANIZER" && dbUser.role !== "ADMIN")) {
    redirect("/member");
  }

  // Fetch communities the organizer is assigned to
  const memberships = await prisma.membership.findMany({
    where: { userId: dbUser.id, role: "ORGANIZER" },
    include: { community: true }
  });

  const communities = memberships.map(m => m.community);

  // Admins can create events for any community
  let allCommunities = communities;
  if (dbUser.role === "ADMIN") {
    allCommunities = await prisma.community.findMany();
  }

  return (
    <div className="flex flex-col gap-8 max-w-2xl">
      {/* Back */}
      <Link
        href="/organizer/events"
        className="flex items-center gap-1.5 text-xs w-fit hover:underline"
        style={{ color: "var(--hive-muted)", fontFamily: "var(--font-mono)" }}
      >
        <ArrowLeft size={13} /> BACK_TO_EVENTS
      </Link>

      {/* Header */}
      <div>
        <span
          className="hive-badge mb-1 inline-flex w-fit"
          style={{ color: "var(--hive-accent)", background: "#ffe4e4", borderColor: "#ffe4e4" }}
        >
          NEW_EVENT
        </span>
        <h2 className="text-3xl font-bold" style={{ color: "var(--hive-text)" }}>
          Create an Event
        </h2>
        <p className="text-sm mt-1" style={{ color: "var(--hive-muted)" }}>
          Fill in the details below. You can save as a draft and publish later.
        </p>
      </div>

      {/* Form card */}
      <div
        className="bg-white border rounded-2xl p-8"
        style={{ borderColor: "var(--hive-border)", boxShadow: "var(--shadow-md)" }}
      >
        <EventForm communities={allCommunities.map(c => ({ id: c.id, name: c.name }))} />
      </div>
    </div>
  );
}
