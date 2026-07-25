"use client";

import { useTransition, useState } from "react";
import { assignOrganizerToCommunityAction } from "@/actions/communities";

interface AssignOrganizerFormProps {
  communities: { id: string; name: string }[];
  organizers: { id: string; fullName: string; email: string }[];
}

export function AssignOrganizerForm({ communities, organizers }: AssignOrganizerFormProps) {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const communityId = formData.get("communityId") as string;
    const organizerId = formData.get("organizerId") as string;

    if (!communityId || !organizerId) {
      setMessage({ text: "Please select both a community and an organizer.", type: "error" });
      return;
    }

    startTransition(async () => {
      const result = await assignOrganizerToCommunityAction(communityId, organizerId);
      setMessage({ text: result.message || "", type: result.success ? "success" : "error" });
      if (result.success) {
        // Reset form is not strictly necessary for selects, but we could
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {message && (
        <div
          className={`px-4 py-3 rounded-xl text-sm font-semibold border ${
            message.type === "success"
              ? "bg-green-50 text-green-700 border-green-200"
              : "bg-red-50 text-red-700 border-red-200"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="communityId"
          className="text-[10px] font-bold uppercase tracking-widest text-gray-500"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          Select Community
        </label>
        <select
          id="communityId"
          name="communityId"
          defaultValue=""
          className="px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0DB4C9]/20 transition-all text-sm bg-white"
        >
          <option value="" disabled>Select a community...</option>
          {communities.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="organizerId"
          className="text-[10px] font-bold uppercase tracking-widest text-gray-500"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          Select Organizer
        </label>
        <select
          id="organizerId"
          name="organizerId"
          defaultValue=""
          className="px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0DB4C9]/20 transition-all text-sm bg-white"
        >
          <option value="" disabled>Select an organizer...</option>
          {organizers.map(o => (
            <option key={o.id} value={o.id}>{o.fullName} ({o.email})</option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="mt-2 w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-white font-bold tracking-widest text-[11px] transition-all hover:opacity-90 disabled:opacity-50 uppercase"
        style={{ background: "#111827", fontFamily: "var(--font-mono)" }}
      >
        {isPending ? "Assigning..." : "ASSIGN_ORGANIZER"}
      </button>
    </form>
  );
}
