"use client";

import { useState, useTransition } from "react";
import { updateUserRole } from "@/actions/admin";
import type { UserRole } from "@/generated/prisma/enums";

interface RoleSelectorProps {
  userId: string;
  currentRole: UserRole;
  disabled?: boolean;
}

const roleStyles: Record<UserRole, { color: string; bg: string; borderColor: string; label: string }> = {
  ADMIN:     { color: "var(--hive-primary)", bg: "#ecfeff", borderColor: "var(--hive-primary)", label: "[ADMIN]" },
  ORGANIZER: { color: "var(--hive-accent)",  bg: "#ffe4e4", borderColor: "var(--hive-accent)",  label: "[ORGANIZER]" },
  MEMBER:    { color: "var(--hive-muted)",   bg: "var(--hive-surface)", borderColor: "var(--hive-border)", label: "[MEMBER]" },
};

export function RoleSelector({ userId, currentRole, disabled = false }: RoleSelectorProps) {
  const [isPending, startTransition] = useTransition();
  const [selectedRole, setSelectedRole] = useState<UserRole>(currentRole);
  const [feedback, setFeedback] = useState<string | null>(null);

  const style = roleStyles[selectedRole] ?? roleStyles.MEMBER;

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRole = e.target.value as UserRole;
    setSelectedRole(newRole);
    setFeedback(null);

    startTransition(async () => {
      const res = await updateUserRole(userId, newRole);
      if (!res.success) {
        // Revert on failure
        setSelectedRole(currentRole);
        setFeedback(res.message ?? "Failed to update role");
      }
    });
  };

  return (
    <div className="relative inline-flex items-center gap-1.5">
      <select
        value={selectedRole}
        onChange={handleChange}
        disabled={disabled || isPending}
        className="hive-badge text-[11px] font-mono font-bold cursor-pointer outline-none appearance-none pr-6 py-1 transition-all"
        style={{
          color: style.color,
          background: style.bg,
          borderColor: style.borderColor,
          opacity: isPending ? 0.6 : 1,
          cursor: disabled || isPending ? "not-allowed" : "pointer",
        }}
        aria-label="Change user role"
      >
        <option value="MEMBER" className="bg-white text-gray-800">[MEMBER]</option>
        <option value="ORGANIZER" className="bg-white text-gray-800">[ORGANIZER]</option>
        <option value="ADMIN" className="bg-white text-gray-800">[ADMIN]</option>
      </select>

      {/* Custom Chevron Indicator */}
      <span
        className="absolute right-2 pointer-events-none text-[9px] font-mono font-bold"
        style={{ color: style.color }}
      >
        {isPending ? "⏳" : "▼"}
      </span>

      {feedback && (
        <span className="text-[10px] font-mono text-[#ef4444] ml-1">
          {feedback}
        </span>
      )}
    </div>
  );
}
