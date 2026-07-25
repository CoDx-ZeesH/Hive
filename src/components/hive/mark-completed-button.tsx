"use client";

import { useState, useTransition } from "react";
import { CheckCircle2, Award } from "lucide-react";
import { completeEventAction } from "@/actions/events";

interface MarkCompletedButtonProps {
  eventId: string;
  eventStatus: string;
  attendedCount: number;
}

export function MarkCompletedButton({
  eventId,
  eventStatus,
  attendedCount,
}: MarkCompletedButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{ success: boolean; message: string } | null>(null);

  if (eventStatus === "COMPLETED") {
    return (
      <div
        className="hive-badge text-xs px-4 py-2 flex items-center gap-1.5 w-fit"
        style={{ color: "var(--hive-primary)", background: "#ecfeff", borderColor: "var(--hive-primary)", fontFamily: "var(--font-mono)" }}
      >
        <CheckCircle2 size={14} /> [EVENT_COMPLETED_&_SCORED]
      </div>
    );
  }

  // Only allow completing published or draft/past events
  if (eventStatus === "CANCELLED" || eventStatus === "REJECTED") {
    return null;
  }

  const handleComplete = () => {
    if (!confirm(`Are you sure you want to mark this event as COMPLETED? This will trigger the Community Score engine and award 50 points to all ${attendedCount} attendee(s).`)) {
      return;
    }
    setFeedback(null);
    startTransition(async () => {
      const res = await completeEventAction(eventId);
      if (res.success) {
        setFeedback({ success: true, message: res.message ?? "Event completed!" });
      } else {
        setFeedback({ success: false, message: res.message ?? "Failed to complete event." });
      }
    });
  };

  return (
    <div className="flex flex-col gap-2">
      {feedback && (
        <div
          className="p-3 rounded-xl text-xs font-mono border"
          style={{
            background: feedback.success ? "#f0fdf4" : "#fef2f2",
            color: feedback.success ? "#166534" : "#dc2626",
            borderColor: feedback.success ? "#bbf7d0" : "#fecaca",
          }}
        >
          {feedback.message}
        </div>
      )}

      <button
        type="button"
        onClick={handleComplete}
        disabled={isPending}
        className="hive-btn px-4 py-2.5 text-xs text-white flex items-center gap-2 cursor-pointer"
        style={{
          background: "var(--hive-primary)",
          opacity: isPending ? 0.7 : 1,
        }}
      >
        <Award size={15} />
        {isPending ? "PROCESSING_POINTS..." : "MARK_COMPLETED"}
      </button>
    </div>
  );
}
