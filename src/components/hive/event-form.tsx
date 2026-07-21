"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createEventAction } from "@/actions/events";
import type { EventFormState } from "@/lib/validations/event";

/**
 * EventForm — Client Component
 * Full create-event form with all fields, Zod validation, useActionState.
 */
export function EventForm() {
  const router = useRouter();
  const [state, action, isPending] = useActionState<EventFormState, FormData>(
    createEventAction,
    undefined
  );

  // Redirect on success
  useEffect(() => {
    if (state?.success && state.eventId) {
      router.push(`/organizer/events/${state.eventId}`);
    }
  }, [state, router]);

  return (
    <form action={action} className="flex flex-col gap-6" noValidate>
      {/* Global error */}
      {state?.message && !state.success && (
        <div
          className="flex items-start gap-2.5 px-4 py-3 rounded-xl border text-sm"
          style={{ background: "#fef2f2", borderColor: "#fecaca", color: "#dc2626" }}
          role="alert"
        >
          <span>⚠ {state.message}</span>
        </div>
      )}

      {/* Title */}
      <Field label="EVENT_TITLE" id="title" error={state?.errors?.title?.[0]} required>
        <input
          id="title"
          name="title"
          type="text"
          required
          placeholder="e.g. Build Night: Web3 x AI"
          className="hive-input w-full px-4 py-3 text-sm"
          style={{ color: "var(--hive-text)" }}
        />
      </Field>

      {/* Description */}
      <Field label="DESCRIPTION" id="description" error={state?.errors?.description?.[0]}>
        <textarea
          id="description"
          name="description"
          rows={4}
          placeholder="What will happen at this event? Who should attend?"
          className="hive-input w-full px-4 py-3 text-sm resize-none"
          style={{ color: "var(--hive-text)" }}
        />
      </Field>

      {/* Online / In-person toggle */}
      <div className="flex flex-col gap-2">
        <Label>FORMAT</Label>
        <div className="flex gap-3">
          {[
            { value: "false", label: "IN_PERSON" },
            { value: "true", label: "ONLINE" },
          ].map((opt) => (
            <label
              key={opt.value}
              className="flex items-center gap-2 cursor-pointer"
            >
              <input
                type="radio"
                name="isOnline"
                value={opt.value}
                defaultChecked={opt.value === "false"}
                className="accent-[var(--hive-primary)]"
              />
              <span
                className="text-xs font-semibold"
                style={{ fontFamily: "var(--font-mono)", color: "var(--hive-text)" }}
              >
                {opt.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Location */}
      <Field label="LOCATION" id="location" error={state?.errors?.location?.[0]}>
        <input
          id="location"
          name="location"
          type="text"
          placeholder="e.g. Innovation Hub, Room 204"
          className="hive-input w-full px-4 py-3 text-sm"
          style={{ color: "var(--hive-text)" }}
        />
      </Field>

      {/* Meet link */}
      <Field label="MEET_LINK" id="meetLink" error={state?.errors?.meetLink?.[0]}>
        <input
          id="meetLink"
          name="meetLink"
          type="url"
          placeholder="https://meet.google.com/..."
          className="hive-input w-full px-4 py-3 text-sm"
          style={{ color: "var(--hive-text)" }}
        />
      </Field>

      {/* Date/time row */}
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="START_DATE_TIME" id="startAt" error={state?.errors?.startAt?.[0]} required>
          <input
            id="startAt"
            name="startAt"
            type="datetime-local"
            required
            className="hive-input w-full px-4 py-3 text-sm"
            style={{ color: "var(--hive-text)" }}
          />
        </Field>
        <Field label="END_DATE_TIME" id="endAt" error={state?.errors?.endAt?.[0]} required>
          <input
            id="endAt"
            name="endAt"
            type="datetime-local"
            required
            className="hive-input w-full px-4 py-3 text-sm"
            style={{ color: "var(--hive-text)" }}
          />
        </Field>
      </div>

      {/* Capacity */}
      <Field label="CAPACITY_(OPTIONAL)" id="capacity" error={state?.errors?.capacity?.[0]}>
        <input
          id="capacity"
          name="capacity"
          type="number"
          min="1"
          max="10000"
          placeholder="Leave empty for unlimited"
          className="hive-input w-full px-4 py-3 text-sm"
          style={{ color: "var(--hive-text)" }}
        />
      </Field>

      {/* Publish / Draft buttons */}
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          name="status"
          value="PUBLISHED"
          disabled={isPending}
          id="publish-event"
          className="hive-btn flex-1 py-3.5 text-white text-sm"
          style={{
            background: "var(--hive-primary)",
            opacity: isPending ? 0.8 : 1,
            cursor: isPending ? "not-allowed" : "pointer",
          }}
        >
          {isPending ? "SAVING..." : "PUBLISH_EVENT"}
        </button>
        <button
          type="submit"
          name="status"
          value="DRAFT"
          disabled={isPending}
          id="save-draft"
          className="hive-btn px-6 py-3.5 text-sm"
          style={{
            background: "var(--hive-surface)",
            color: "var(--hive-muted)",
            border: "1px solid var(--hive-border)",
            opacity: isPending ? 0.8 : 1,
            cursor: isPending ? "not-allowed" : "pointer",
          }}
        >
          SAVE_DRAFT
        </button>
      </div>
    </form>
  );
}

/* ─── Primitives ─────────────────────────────────────────────────────────── */

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="text-[10px] font-semibold uppercase tracking-wider mb-1.5"
      style={{ fontFamily: "var(--font-mono)", color: "var(--hive-muted)" }}
    >
      {children}
    </p>
  );
}

function Field({
  label,
  id,
  error,
  required,
  children,
}: {
  label: string;
  id: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="text-[10px] font-semibold uppercase tracking-wider"
        style={{ fontFamily: "var(--font-mono)", color: "var(--hive-muted)" }}
      >
        {label}
        {required && (
          <span style={{ color: "var(--hive-primary)" }}> *</span>
        )}
      </label>
      {children}
      {error && (
        <p
          className="text-xs"
          style={{ color: "var(--hive-error)", fontFamily: "var(--font-mono)" }}
        >
          {error}
        </p>
      )}
    </div>
  );
}
