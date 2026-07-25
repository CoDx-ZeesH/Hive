"use client";

import { useState, useTransition } from "react";
import { User, Check, X, ShieldAlert, Clock } from "lucide-react";
import { updateRsvpStatusAction } from "@/actions/events";
import { formatDate } from "@/lib/utils";

interface RegistrationItem {
  id: string;
  status: "APPROVED" | "WAITLISTED" | "CANCELLED" | "ATTENDED";
  registeredAt: Date;
  user: {
    id: string;
    fullName: string;
    email: string;
    username: string;
    avatarUrl?: string | null;
  };
}

interface OrganizerRosterTableProps {
  eventId: string;
  registrations: RegistrationItem[];
}

const statusBadges: Record<string, { label: string; color: string; bg: string }> = {
  APPROVED:   { label: "[APPROVED]",   color: "#22c55e", bg: "#f0fdf4" },
  WAITLISTED: { label: "[WAITLISTED]", color: "#f59e0b", bg: "#fffbeb" },
  ATTENDED:   { label: "[ATTENDED]",   color: "var(--hive-primary)", bg: "#ecfeff" },
  CANCELLED:  { label: "[CANCELLED]",  color: "#ef4444", bg: "#fef2f2" },
};

export function OrganizerRosterTable({ eventId, registrations }: OrganizerRosterTableProps) {
  const [isPending, startTransition] = useTransition();
  const [activeTab, setActiveTab] = useState<string>("ALL");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const filteredRegistrations = registrations.filter((r) => {
    if (activeTab === "ALL") return true;
    return r.status === activeTab;
  });

  const handleStatusChange = (registrationId: string, newStatus: "APPROVED" | "WAITLISTED" | "CANCELLED" | "ATTENDED") => {
    setToastMessage(null);
    startTransition(async () => {
      const res = await updateRsvpStatusAction(registrationId, newStatus);
      if (res.success) {
        setToastMessage(`✓ Updated RSVP status to ${newStatus}`);
        setTimeout(() => setToastMessage(null), 3000);
      } else {
        setToastMessage(`⚠️ ${res.message}`);
      }
    });
  };

  const countByStatus = (status: string) => registrations.filter((r) => r.status === status).length;

  return (
    <div className="flex flex-col gap-4">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className="px-4 py-2.5 rounded-xl text-xs font-mono border text-center transition-all"
          style={{ background: "#f0fdf4", color: "#166534", borderColor: "#bbf7d0" }}
        >
          {toastMessage}
        </div>
      )}

      {/* Roster Header & Filter Chips */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap text-xs" style={{ fontFamily: "var(--font-mono)" }}>
          {[
            { id: "ALL", label: `ALL (${registrations.length})` },
            { id: "APPROVED", label: `APPROVED (${countByStatus("APPROVED")})` },
            { id: "WAITLISTED", label: `WAITLISTED (${countByStatus("WAITLISTED")})` },
            { id: "ATTENDED", label: `ATTENDED (${countByStatus("ATTENDED")})` },
            { id: "CANCELLED", label: `CANCELLED (${countByStatus("CANCELLED")})` },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className="hive-badge cursor-pointer transition-colors"
              style={{
                color: activeTab === tab.id ? "#fff" : "var(--hive-muted)",
                background: activeTab === tab.id ? "var(--hive-primary)" : "var(--hive-surface)",
                borderColor: activeTab === tab.id ? "var(--hive-primary)" : "var(--hive-border)",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Roster Table */}
      <div className="hive-card overflow-hidden p-0">
        <div
          className="grid grid-cols-[1fr_180px_130px_110px_180px] gap-3 px-5 py-3 border-b text-[10px] font-bold uppercase tracking-wider"
          style={{ borderColor: "var(--hive-border)", color: "var(--hive-muted)", fontFamily: "var(--font-mono)", background: "var(--hive-surface)" }}
        >
          <span>MEMBER</span>
          <span>EMAIL</span>
          <span>RSVP_STATUS</span>
          <span>REGISTERED</span>
          <span className="text-right">MANAGE_STATUS</span>
        </div>

        {filteredRegistrations.length === 0 ? (
          <div className="p-8 text-center text-xs font-mono text-[var(--hive-muted)]">
            NO_REGISTRATIONS_FOUND
          </div>
        ) : (
          filteredRegistrations.map((reg) => {
            const sb = statusBadges[reg.status] ?? statusBadges.APPROVED;
            return (
              <div
                key={reg.id}
                className="grid grid-cols-[1fr_180px_130px_110px_180px] gap-3 items-center px-5 py-3.5 border-b last:border-b-0 hover:bg-[var(--hive-surface)] transition-colors"
                style={{ borderColor: "var(--hive-border)" }}
              >
                {/* Member */}
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-white font-mono text-xs font-bold"
                    style={{ background: "var(--hive-primary)" }}
                  >
                    {reg.user.fullName.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold truncate text-[var(--hive-text)]">
                      {reg.user.fullName}
                    </p>
                    <p className="text-[10px] font-mono text-[var(--hive-muted)] truncate">
                      @{reg.user.username}
                    </p>
                  </div>
                </div>

                {/* Email */}
                <p className="text-xs font-mono text-[var(--hive-muted)] truncate">
                  {reg.user.email}
                </p>

                {/* Status Badge */}
                <div>
                  <span
                    className="hive-badge text-[10px] font-mono"
                    style={{ color: sb.color, background: sb.bg, borderColor: sb.color }}
                  >
                    {sb.label}
                  </span>
                </div>

                {/* Registered date */}
                <p className="text-[10px] font-mono text-[var(--hive-muted)]">
                  {formatDate(reg.registeredAt)}
                </p>

                {/* Actions Dropdown / Buttons */}
                <div className="flex justify-end items-center gap-1">
                  {reg.status === "WAITLISTED" && (
                    <button
                      type="button"
                      onClick={() => handleStatusChange(reg.id, "APPROVED")}
                      disabled={isPending}
                      className="hive-btn px-2.5 py-1 text-[10px] text-white bg-[#22c55e] cursor-pointer"
                      title="Move to Approved"
                    >
                      APPROVE
                    </button>
                  )}
                  {reg.status === "APPROVED" && (
                    <button
                      type="button"
                      onClick={() => handleStatusChange(reg.id, "WAITLISTED")}
                      disabled={isPending}
                      className="hive-btn px-2 py-1 text-[10px] text-[#f59e0b] bg-[#fffbeb] border border-[#f59e0b] cursor-pointer"
                      title="Move to Waitlist"
                    >
                      WAITLIST
                    </button>
                  )}
                  {reg.status !== "ATTENDED" && (
                    <button
                      type="button"
                      onClick={() => handleStatusChange(reg.id, "ATTENDED")}
                      disabled={isPending}
                      className="hive-btn px-2 py-1 text-[10px] text-[var(--hive-primary)] bg-[#ecfeff] border border-[var(--hive-primary)] cursor-pointer"
                      title="Mark as Attended"
                    >
                      ATTENDED
                    </button>
                  )}
                  {reg.status !== "CANCELLED" && (
                    <button
                      type="button"
                      onClick={() => handleStatusChange(reg.id, "CANCELLED")}
                      disabled={isPending}
                      className="hive-btn px-2 py-1 text-[10px] text-[#ef4444] bg-[#fef2f2] border border-[#fecaca] cursor-pointer"
                      title="Cancel Registration"
                    >
                      CANCEL
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
