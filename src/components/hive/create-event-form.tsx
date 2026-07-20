"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import {
  createEventSchema,
  eventCategorySchema,
  type CreateEventInput,
} from "@/lib/validations/events";
import { createEventAction } from "@/actions/events";

interface CreateEventFormProps {
  communities: { id: string; name: string; slug: string }[];
}

const categories = eventCategorySchema.options;

/**
 * CreateEventForm — react-hook-form + zod validation.
 */
export function CreateEventForm({ communities }: CreateEventFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CreateEventInput>({
    resolver: zodResolver(createEventSchema),
    defaultValues: {
      title: "",
      description: "",
      communityId: communities[0]?.id ?? "",
      category: "COMMUNITY",
      location: "",
      isOnline: false,
      meetLink: "",
      startAt: "",
      endAt: "",
      capacity: "",
      status: "DRAFT",
    },
  });

  const isOnline = watch("isOnline");

  function onSubmit(data: CreateEventInput) {
    setServerError(null);
    const formData = new FormData();
    formData.set("title", data.title);
    formData.set("description", data.description ?? "");
    formData.set("communityId", data.communityId);
    formData.set("category", data.category);
    formData.set("location", data.location ?? "");
    formData.set("isOnline", String(data.isOnline));
    formData.set("meetLink", data.meetLink ?? "");
    formData.set("startAt", data.startAt);
    formData.set("endAt", data.endAt);
    formData.set("capacity", data.capacity === "" ? "" : String(data.capacity));
    formData.set("status", data.status);

    startTransition(async () => {
      const result = await createEventAction(undefined, formData);
      if (result?.message && !result.success) {
        setServerError(result.message);
      }
      if (result?.errors) {
        const firstError = Object.values(result.errors)[0]?.[0];
        if (firstError) setServerError(firstError);
      }
      router.refresh();
    });
  }

  if (communities.length === 0) {
    return (
      <div
        className="hive-card p-6 text-sm"
        style={{ color: "var(--hive-muted)" }}
      >
        You need to be assigned to a community before creating events. Contact
        an admin to set up your organizer membership.
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="hive-card p-6 md:p-8 flex flex-col gap-6 max-w-2xl"
      noValidate
    >
      {serverError && (
        <div
          className="px-4 py-3 rounded-xl border text-sm"
          style={{
            background: "#fef2f2",
            borderColor: "#fecaca",
            color: "#dc2626",
          }}
          role="alert"
        >
          {serverError}
        </div>
      )}

      {/* Title */}
      <Field label="EVENT_TITLE" error={errors.title?.message}>
        <input
          {...register("title")}
          type="text"
          placeholder="Build Night: Web3 x AI"
          className="hive-input w-full px-4 py-3 text-sm"
          style={{ color: "var(--hive-text)", fontFamily: "var(--font-sans)" }}
        />
      </Field>

      {/* Description */}
      <Field label="DESCRIPTION" error={errors.description?.message}>
        <textarea
          {...register("description")}
          rows={4}
          placeholder="Tell members what this event is about..."
          className="hive-input w-full px-4 py-3 text-sm resize-none"
          style={{ color: "var(--hive-text)", fontFamily: "var(--font-sans)" }}
        />
      </Field>

      <div className="grid sm:grid-cols-2 gap-4">
        {/* Community */}
        <Field label="COMMUNITY" error={errors.communityId?.message}>
          <select
            {...register("communityId")}
            className="hive-input w-full px-4 py-3 text-sm"
            style={{ color: "var(--hive-text)", fontFamily: "var(--font-sans)" }}
          >
            {communities.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </Field>

        {/* Category */}
        <Field label="CATEGORY" error={errors.category?.message}>
          <select
            {...register("category")}
            className="hive-input w-full px-4 py-3 text-sm"
            style={{ color: "var(--hive-text)", fontFamily: "var(--font-mono)" }}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </Field>
      </div>

      {/* Online toggle */}
      <div className="flex items-center gap-3">
        <input
          {...register("isOnline")}
          type="checkbox"
          id="isOnline"
          className="w-4 h-4 rounded accent-[var(--hive-primary)]"
        />
        <label
          htmlFor="isOnline"
          className="text-xs font-semibold uppercase tracking-wider cursor-pointer"
          style={{ fontFamily: "var(--font-mono)", color: "var(--hive-muted)" }}
        >
          ONLINE_EVENT
        </label>
      </div>

      {isOnline ? (
        <Field label="MEETING_LINK" error={errors.meetLink?.message}>
          <input
            {...register("meetLink")}
            type="url"
            placeholder="https://meet.google.com/..."
            className="hive-input w-full px-4 py-3 text-sm"
            style={{ color: "var(--hive-text)", fontFamily: "var(--font-sans)" }}
          />
        </Field>
      ) : (
        <Field label="LOCATION" error={errors.location?.message}>
          <input
            {...register("location")}
            type="text"
            placeholder="Hive HQ, Room 204"
            className="hive-input w-full px-4 py-3 text-sm"
            style={{ color: "var(--hive-text)", fontFamily: "var(--font-sans)" }}
          />
        </Field>
      )}

      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="START_DATE" error={errors.startAt?.message}>
          <input
            {...register("startAt")}
            type="datetime-local"
            className="hive-input w-full px-4 py-3 text-sm"
            style={{ color: "var(--hive-text)", fontFamily: "var(--font-mono)" }}
          />
        </Field>
        <Field label="END_DATE" error={errors.endAt?.message}>
          <input
            {...register("endAt")}
            type="datetime-local"
            className="hive-input w-full px-4 py-3 text-sm"
            style={{ color: "var(--hive-text)", fontFamily: "var(--font-mono)" }}
          />
        </Field>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="CAPACITY" error={errors.capacity?.message}>
          <input
            {...register("capacity")}
            type="number"
            min={1}
            placeholder="Leave empty for unlimited"
            className="hive-input w-full px-4 py-3 text-sm"
            style={{ color: "var(--hive-text)", fontFamily: "var(--font-mono)" }}
          />
        </Field>

        <Field label="STATUS" error={errors.status?.message}>
          <select
            {...register("status")}
            className="hive-input w-full px-4 py-3 text-sm"
            style={{ color: "var(--hive-text)", fontFamily: "var(--font-mono)" }}
          >
            <option value="DRAFT">DRAFT</option>
            <option value="PUBLISHED">PUBLISHED</option>
          </select>
        </Field>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="hive-btn w-full py-3.5 text-white text-sm mt-2"
        style={{
          background: isPending
            ? "var(--hive-primary-hover)"
            : "var(--hive-primary)",
          cursor: isPending ? "not-allowed" : "pointer",
          opacity: isPending ? 0.85 : 1,
        }}
      >
        {isPending ? "CREATING..." : "CREATE_EVENT"}
      </button>
    </form>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        className="text-xs font-semibold uppercase tracking-wider"
        style={{ fontFamily: "var(--font-mono)", color: "var(--hive-muted)" }}
      >
        {label}
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
