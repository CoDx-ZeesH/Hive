"use client";

import { useActionState } from "react";
import { createAnnouncementAction } from "@/actions/announcements";
import type { AnnouncementFormState } from "@/lib/validations/announcement";
import { Pin } from "lucide-react";

export function CreateAnnouncementForm() {
  const [state, action, isPending] = useActionState<AnnouncementFormState, FormData>(
    createAnnouncementAction,
    undefined
  );

  return (
    <form action={action} className="flex flex-col gap-5" noValidate>
      {state?.success && (
        <div
          className="px-4 py-3 rounded-xl border text-sm"
          style={{ background: "#f0fdf4", borderColor: "#86efac", color: "#16a34a" }}
        >
          ✓ {state.message}
        </div>
      )}
      {state?.message && !state.success && (
        <div
          className="px-4 py-3 rounded-xl border text-sm"
          style={{ background: "#fef2f2", borderColor: "#fecaca", color: "#dc2626" }}
        >
          ⚠ {state.message}
        </div>
      )}

      {/* Title */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="ann-title"
          className="text-[10px] font-semibold uppercase tracking-wider"
          style={{ fontFamily: "var(--font-mono)", color: "var(--hive-muted)" }}
        >
          TITLE <span style={{ color: "var(--hive-primary)" }}>*</span>
        </label>
        <input
          id="ann-title"
          name="title"
          type="text"
          required
          placeholder="Announcement title"
          className="hive-input w-full px-4 py-3 text-sm"
          style={{ color: "var(--hive-text)" }}
        />
        {state?.errors?.title && (
          <p className="text-xs" style={{ color: "var(--hive-error)", fontFamily: "var(--font-mono)" }}>
            {state.errors.title[0]}
          </p>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="ann-content"
          className="text-[10px] font-semibold uppercase tracking-wider"
          style={{ fontFamily: "var(--font-mono)", color: "var(--hive-muted)" }}
        >
          CONTENT <span style={{ color: "var(--hive-primary)" }}>*</span>
        </label>
        <textarea
          id="ann-content"
          name="content"
          rows={6}
          required
          placeholder="What do you want to share with your community?"
          className="hive-input w-full px-4 py-3 text-sm resize-none"
          style={{ color: "var(--hive-text)" }}
        />
        {state?.errors?.content && (
          <p className="text-xs" style={{ color: "var(--hive-error)", fontFamily: "var(--font-mono)" }}>
            {state.errors.content[0]}
          </p>
        )}
      </div>

      {/* Pin toggle */}
      <label className="flex items-center gap-3 cursor-pointer select-none">
        <input type="hidden" name="isPinned" value="false" />
        <input
          type="checkbox"
          name="isPinned"
          value="true"
          className="accent-[var(--hive-primary)] w-4 h-4"
        />
        <Pin size={14} style={{ color: "var(--hive-primary)" }} />
        <span className="text-xs font-semibold" style={{ fontFamily: "var(--font-mono)", color: "var(--hive-text)" }}>
          PIN_TO_COMMUNITY_BOARD
        </span>
      </label>

      <button
        type="submit"
        disabled={isPending || state?.success === true}
        id="post-announcement"
        className="hive-btn w-full py-3.5 text-sm text-white"
        style={{
          background: "var(--hive-primary)",
          opacity: isPending ? 0.8 : 1,
          cursor: isPending ? "not-allowed" : "pointer",
        }}
      >
        {isPending ? "POSTING..." : "POST_ANNOUNCEMENT"}
      </button>
    </form>
  );
}
