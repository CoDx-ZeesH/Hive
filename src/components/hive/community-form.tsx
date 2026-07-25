"use client";

import { useActionState, useEffect, useRef } from "react";
import { createCommunityAction, type CommunityFormState } from "@/actions/communities";

export function CommunityForm() {
  const [state, formAction, isPending] = useActionState<CommunityFormState, FormData>(createCommunityAction, {
    success: false,
    errors: {},
    message: "",
  });

  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
    }
  }, [state.success]);

  return (
    <form ref={formRef} action={formAction} className="flex flex-col gap-4">
      {state.message && (
        <div
          className={`px-4 py-3 rounded-xl text-sm font-semibold border ${
            state.success
              ? "bg-green-50 text-green-700 border-green-200"
              : "bg-red-50 text-red-700 border-red-200"
          }`}
        >
          {state.message}
        </div>
      )}

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="name"
          className="text-[10px] font-bold uppercase tracking-widest text-gray-500"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          Community Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          placeholder="e.g. Google Developer Groups - Campus"
          className="px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0DB4C9]/20 transition-all text-sm font-medium"
        />
        {state.errors?.name && (
          <p className="text-xs text-red-500 font-medium">{state.errors.name[0]}</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="description"
          className="text-[10px] font-bold uppercase tracking-widest text-gray-500"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          placeholder="What is this community about?"
          className="px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0DB4C9]/20 transition-all text-sm resize-none"
        />
        {state.errors?.description && (
          <p className="text-xs text-red-500 font-medium">
            {state.errors.description[0]}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="mt-2 w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-white font-bold tracking-widest text-[11px] transition-all hover:opacity-90 disabled:opacity-50 uppercase"
        style={{ background: "var(--hive-primary)", fontFamily: "var(--font-mono)" }}
      >
        {isPending ? "Creating..." : "CREATE_COMMUNITY"}
      </button>
    </form>
  );
}
