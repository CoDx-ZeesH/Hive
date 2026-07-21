import type { Metadata } from "next";
import { Pin, Radio, Plus } from "lucide-react";
import Link from "next/link";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Announcements",
  description: "Manage and post community announcements.",
};

const mockAnnouncements = [
  {
    id: "ann-001",
    title: "Welcome to Hive 🎉",
    content:
      "We're so excited to launch the Hive community platform! This is your hub for events, connections, and opportunities. Check the Events tab for upcoming sessions.",
    isPinned: true,
    createdAt: new Date("2026-07-20"),
    author: { fullName: "Hive Core Team" },
  },
  {
    id: "ann-002",
    title: "Build Night happening this Friday",
    content:
      "Don't miss our first Build Night this Friday at 6PM! We'll be exploring Web3 x AI integrations. Register via the Events tab.",
    isPinned: false,
    createdAt: new Date("2026-07-19"),
    author: { fullName: "Hive Core Team" },
  },
];

export default function AnnouncementsPage() {
  const pinned = mockAnnouncements.filter((a) => a.isPinned);
  const regular = mockAnnouncements.filter((a) => !a.isPinned);

  return (
    <div className="flex flex-col gap-8 max-w-3xl">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <span
            className="hive-badge mb-1 inline-flex w-fit"
            style={{ color: "var(--hive-accent)", background: "#ffe4e4", borderColor: "#ffe4e4" }}
          >
            COMMUNITY_BOARD
          </span>
          <h2 className="text-3xl font-bold" style={{ color: "var(--hive-text)" }}>
            Announcements
          </h2>
          <p className="text-sm mt-1" style={{ color: "var(--hive-muted)" }}>
            {pinned.length} pinned · {regular.length} recent
          </p>
        </div>
        <Link
          href="/organizer/announcements/new"
          className="hive-btn px-5 py-2.5 text-sm text-white flex items-center gap-2 shrink-0"
          style={{ background: "var(--hive-primary)" }}
          id="new-announcement-btn"
        >
          <Plus size={16} /> POST_NEW
        </Link>
      </div>

      {/* Pinned */}
      {pinned.length > 0 && (
        <div className="flex flex-col gap-3">
          <h3
            className="text-xs font-bold uppercase tracking-wider"
            style={{ fontFamily: "var(--font-mono)", color: "var(--hive-muted)" }}
          >
            PINNED
          </h3>
          {pinned.map((ann) => (
            <div
              key={ann.id}
              className="hive-card p-5 border-l-4"
              style={{ borderLeftColor: "var(--hive-primary)" }}
            >
              <div className="flex items-center gap-2 mb-2">
                <Pin size={13} style={{ color: "var(--hive-primary)" }} />
                <span
                  className="text-[10px] font-bold uppercase tracking-wider"
                  style={{ fontFamily: "var(--font-mono)", color: "var(--hive-primary)" }}
                >
                  PINNED
                </span>
              </div>
              <h4 className="text-base font-bold mb-1" style={{ color: "var(--hive-text)" }}>
                {ann.title}
              </h4>
              <p className="text-sm line-clamp-3" style={{ color: "var(--hive-muted)" }}>
                {ann.content}
              </p>
              <div
                className="flex items-center gap-3 mt-3 text-[10px]"
                style={{ color: "var(--hive-muted)", fontFamily: "var(--font-mono)" }}
              >
                <span>{ann.author.fullName}</span>
                <span>·</span>
                <span>{formatDate(ann.createdAt)}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Regular */}
      {regular.length > 0 && (
        <div className="flex flex-col gap-3">
          <h3
            className="text-xs font-bold uppercase tracking-wider"
            style={{ fontFamily: "var(--font-mono)", color: "var(--hive-muted)" }}
          >
            RECENT
          </h3>
          {regular.map((ann) => (
            <div key={ann.id} className="hive-card p-5">
              <div className="flex items-start gap-3">
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                  style={{ background: "var(--hive-primary-light)", color: "var(--hive-primary)" }}
                >
                  <Radio size={14} strokeWidth={2} />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold mb-1" style={{ color: "var(--hive-text)" }}>
                    {ann.title}
                  </h4>
                  <p className="text-sm line-clamp-3" style={{ color: "var(--hive-muted)" }}>
                    {ann.content}
                  </p>
                  <div
                    className="flex items-center gap-3 mt-2 text-[10px]"
                    style={{ color: "var(--hive-muted)", fontFamily: "var(--font-mono)" }}
                  >
                    <span>{ann.author.fullName}</span>
                    <span>·</span>
                    <span>{formatDate(ann.createdAt)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
