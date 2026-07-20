"use client";

import { useState, useTransition } from "react";
import { rsvpForEvent } from "@/actions/events";
import type { RegistrationStatus } from "@/generated/prisma/client";

interface RsvpButtonProps {
  eventId: string;
  registrationStatus: RegistrationStatus | null;
  disabled?: boolean;
}

/**
 * RsvpButton — client component for event registration.
 */
export function RsvpButton({
  eventId,
  registrationStatus,
  disabled = false,
}: RsvpButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  const isRegistered = registrationStatus === "REGISTERED";
  const isWaitlisted = registrationStatus === "WAITLISTED";

  function handleRsvp() {
    startTransition(async () => {
      const result = await rsvpForEvent(eventId);
      if (result.success) {
        setMessage(result.message ?? "Registered!");
      } else {
        setMessage(result.error);
      }
    });
  }

  if (isRegistered) {
    return (
      <div className="flex flex-col gap-2">
        <button
          type="button"
          disabled
          className="hive-btn w-full py-4 text-sm cursor-default"
          style={{
            background: "var(--hive-success)",
            color: "#fff",
            opacity: 0.9,
          }}
        >
          REGISTERED ✓
        </button>
        {message && <StatusMessage message={message} />}
      </div>
    );
  }

  if (isWaitlisted) {
    return (
      <div className="flex flex-col gap-2">
        <button
          type="button"
          disabled
          className="hive-btn w-full py-4 text-sm cursor-default"
          style={{
            background: "var(--hive-warning)",
            color: "#fff",
            opacity: 0.9,
          }}
        >
          WAITLISTED
        </button>
        {message && <StatusMessage message={message} />}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={handleRsvp}
        disabled={disabled || isPending}
        className="hive-btn w-full py-4 text-sm text-white"
        style={{
          background: disabled
            ? "var(--hive-muted)"
            : isPending
              ? "var(--hive-primary-hover)"
              : "var(--hive-primary)",
          cursor: disabled || isPending ? "not-allowed" : "pointer",
          opacity: disabled ? 0.6 : isPending ? 0.85 : 1,
        }}
      >
        {isPending ? "REGISTERING..." : "RSVP_NOW"}
      </button>
      {message && <StatusMessage message={message} />}
    </div>
  );
}

function StatusMessage({ message }: { message: string }) {
  return (
    <p
      className="text-xs text-center"
      style={{ color: "var(--hive-muted)", fontFamily: "var(--font-mono)" }}
    >
      {message}
    </p>
  );
}
