import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { CreateAnnouncementForm } from "@/components/hive/create-announcement-form";

export const metadata: Metadata = {
  title: "Post Announcement",
  description: "Broadcast a message to your entire community.",
};

export default function NewAnnouncementPage() {
  return (
    <div className="flex flex-col gap-8 max-w-2xl">
      <Link
        href="/organizer/announcements"
        className="flex items-center gap-1.5 text-xs w-fit hover:underline"
        style={{ color: "var(--hive-muted)", fontFamily: "var(--font-mono)" }}
      >
        <ArrowLeft size={13} /> BACK_TO_ANNOUNCEMENTS
      </Link>

      <div>
        <span
          className="hive-badge mb-1 inline-flex w-fit"
          style={{ color: "var(--hive-accent)", background: "#ffe4e4", borderColor: "#ffe4e4" }}
        >
          NEW_ANNOUNCEMENT
        </span>
        <h2 className="text-3xl font-bold" style={{ color: "var(--hive-text)" }}>
          Post to Community
        </h2>
        <p className="text-sm mt-1" style={{ color: "var(--hive-muted)" }}>
          All community members will see this on their dashboard.
        </p>
      </div>

      <div
        className="bg-white border rounded-2xl p-8"
        style={{ borderColor: "var(--hive-border)", boxShadow: "var(--shadow-md)" }}
      >
        <CreateAnnouncementForm />
      </div>
    </div>
  );
}
