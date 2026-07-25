"use client";

import { useState, useTransition } from "react";
import { Check, X, Calendar, MapPin, Users, Wifi } from "lucide-react";
import { approveEventAction, rejectEventAction } from "@/actions/events";
import { formatDate, formatEventTime } from "@/lib/utils";

interface AdminApprovalCardProps {
  event: {
    id: string;
    title: string;
    description?: string | null;
    location?: string | null;
    isOnline: boolean;
    startAt: Date;
    endAt: Date;
    capacity?: number | null;
    community?: { name: string } | null;
    organizer?: { fullName: string; email: string } | null;
  };
}

export function AdminApprovalCard({ event }: AdminApprovalCardProps) {
  const [isPending, startTransition] = useTransition();
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleApprove = () => {
    setError(null);
    startTransition(async () => {
      const res = await approveEventAction(event.id);
      if (!res.success) {
        setError(res.message ?? "Failed to approve event");
      }
    });
  };

  const handleRejectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectionReason.trim()) {
      setError("Please provide a reason for rejecting this event.");
      return;
    }
    setError(null);
    startTransition(async () => {
      const res = await rejectEventAction(event.id, rejectionReason);
      if (!res.success) {
        setError(res.message ?? "Failed to reject event");
      }
    });
  };

  return (
    <div
      className="bg-white border rounded-2xl p-6 flex flex-col gap-4 transition-all"
      style={{ borderColor: "var(--hive-border)", boxShadow: "var(--shadow-sm)" }}
    >
      {/* Header info */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span
              className="hive-badge text-[10px]"
              style={{ color: "#f59e0b", background: "#fffbeb", borderColor: "#f59e0b", fontFamily: "var(--font-mono)" }}
            >
              [PENDING_APPROVAL]
            </span>
            {event.community && (
              <span
                className="hive-badge text-[10px]"
                style={{ color: "var(--hive-muted)", background: "var(--hive-surface)", borderColor: "var(--hive-border)", fontFamily: "var(--font-mono)" }}
              >
                {event.community.name}
              </span>
            )}
          </div>
          <h3 className="text-xl font-bold text-[var(--hive-text)]">{event.title}</h3>
          {event.organizer && (
            <p className="text-xs text-[var(--hive-muted)] font-mono">
              Submitted by: <span className="font-semibold text-[var(--hive-text)]">{event.organizer.fullName}</span> ({event.organizer.email})
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleApprove}
            disabled={isPending}
            className="hive-btn px-4 py-2 text-xs text-white flex items-center gap-1.5 cursor-pointer"
            style={{ background: "#22c55e", opacity: isPending ? 0.7 : 1 }}
          >
            <Check size={14} /> APPROVE
          </button>

          <button
            type="button"
            onClick={() => setShowRejectForm(!showRejectForm)}
            disabled={isPending}
            className="hive-btn px-4 py-2 text-xs flex items-center gap-1.5 cursor-pointer"
            style={{
              background: "#fef2f2",
              color: "#ef4444",
              border: "1px solid #fecaca",
              opacity: isPending ? 0.7 : 1,
            }}
          >
            <X size={14} /> REJECT
          </button>
        </div>
      </div>

      {/* Description */}
      {event.description && (
        <p className="text-xs text-[var(--hive-muted)] line-clamp-3 leading-relaxed">
          {event.description}
        </p>
      )}

      {/* Meta tags */}
      <div className="flex items-center gap-4 text-xs text-[var(--hive-muted)] font-mono flex-wrap pt-1">
        <span className="flex items-center gap-1">
          <Calendar size={12} style={{ color: "var(--hive-primary)" }} />
          {formatDate(event.startAt)} ({formatEventTime(event.startAt)} – {formatEventTime(event.endAt)})
        </span>
        <span className="flex items-center gap-1">
          {event.isOnline ? (
            <>
              <Wifi size={12} style={{ color: "var(--hive-primary)" }} /> Online
            </>
          ) : (
            <>
              <MapPin size={12} style={{ color: "var(--hive-primary)" }} /> {event.location || "In Person"}
            </>
          )}
        </span>
        {event.capacity && (
          <span className="flex items-center gap-1">
            <Users size={12} style={{ color: "var(--hive-primary)" }} /> Capacity: {event.capacity}
          </span>
        )}
      </div>

      {/* Error alert */}
      {error && (
        <div
          className="p-3 rounded-xl text-xs font-mono"
          style={{ background: "#fef2f2", color: "#dc2626", border: "1px solid #fecaca" }}
        >
          ⚠️ {error}
        </div>
      )}

      {/* Rejection reason form drawer */}
      {showRejectForm && (
        <form onSubmit={handleRejectSubmit} className="flex flex-col gap-2 pt-3 border-t border-[var(--hive-border)]">
          <label className="text-[10px] font-bold uppercase tracking-wider font-mono text-[var(--hive-muted)]">
            REJECTION_REASON (REQUIRED FOR ORGANIZER FEEDBACK)
          </label>
          <textarea
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            placeholder="Explain why this event cannot be approved (e.g. incomplete description, duplicate entry)..."
            rows={2}
            className="hive-input p-3 text-xs resize-none"
            required
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowRejectForm(false)}
              className="hive-btn px-3 py-1.5 text-xs text-[var(--hive-muted)] bg-[var(--hive-surface)] border border-[var(--hive-border)] cursor-pointer"
            >
              CANCEL
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="hive-btn px-4 py-1.5 text-xs text-white bg-[#ef4444] cursor-pointer"
            >
              {isPending ? "REJECTING..." : "CONFIRM_REJECTION"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
