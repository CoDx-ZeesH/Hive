"use client";

import { useTransition } from "react";
import { rsvpAction, cancelRsvpAction } from "@/actions/events";
import { CalendarCheck, X } from "lucide-react";

interface RsvpButtonProps {
  eventId: string;
  isRegistered: boolean;
  isWaitlisted?: boolean;
  eventStatus: string;
}

/**
 * RsvpButton — Client Component.
 * Calls rsvpAction / cancelRsvpAction via useTransition for
 * smooth pending-state UI without useActionState.
 */
export function RsvpButton({
  eventId,
  isRegistered,
  isWaitlisted = false,
  eventStatus,
}: RsvpButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleRsvp = () => {
    startTransition(async () => {
      const res = await rsvpAction(eventId);
      if (!res.success && res.message) {
        alert(res.message);
      }
    });
  };

  const handleCancel = () => {
    if (!confirm("Cancel your RSVP for this event?")) return;
    startTransition(async () => {
      await cancelRsvpAction(eventId);
    });
  };

  if (eventStatus !== "PUBLISHED") {
    return (
      <span
        className="hive-badge text-xs px-4 py-2"
        style={{
          color: "var(--hive-muted)",
          background: "var(--hive-surface)",
          borderColor: "var(--hive-border)",
        }}
      >
        REGISTRATION_CLOSED
      </span>
    );
  }

  if (isRegistered || isWaitlisted) {
    return (
      <div className="flex items-center gap-2">
        <div
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold"
          style={{
            background: isWaitlisted ? "#fef3c7" : "#f0fdf4",
            color: isWaitlisted ? "#d97706" : "var(--hive-success)",
            fontFamily: "var(--font-mono)",
          }}
        >
          <CalendarCheck size={15} strokeWidth={2} />
          {isWaitlisted ? "WAITLISTED" : "REGISTERED"}
        </div>
        <button
          type="button"
          onClick={handleCancel}
          disabled={isPending}
          className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors hover:bg-[var(--hive-surface)]"
          style={{
            color: "var(--hive-muted)",
            fontFamily: "var(--font-mono)",
            border: "1px solid var(--hive-border)",
            cursor: isPending ? "not-allowed" : "pointer",
            opacity: isPending ? 0.6 : 1,
          }}
          aria-label="Cancel RSVP"
        >
          <X size={13} />
          CANCEL
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={handleRsvp}
      disabled={isPending}
      id="rsvp-btn"
      className="hive-btn px-6 py-3 text-sm text-white flex items-center gap-2"
      style={{
        background: isPending ? "var(--hive-primary-hover)" : "var(--hive-primary)",
        cursor: isPending ? "not-allowed" : "pointer",
        opacity: isPending ? 0.8 : 1,
      }}
    >
      <CalendarCheck size={15} strokeWidth={2} />
      {isPending ? "REGISTERING..." : "RSVP_NOW"}
    </button>
  );
}
