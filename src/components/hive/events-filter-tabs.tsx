"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

interface EventsFilterTabsProps {
  basePath: string;
}

/**
 * EventsFilterTabs — toggles between upcoming and past events.
 */
export function EventsFilterTabs({ basePath }: EventsFilterTabsProps) {
  const searchParams = useSearchParams();
  const filter = searchParams.get("filter") === "past" ? "past" : "upcoming";

  const tabs = [
    { key: "upcoming", label: "UPCOMING" },
    { key: "past", label: "PAST" },
  ] as const;

  return (
    <div
      className="inline-flex p-1 rounded-xl border"
      style={{
        background: "var(--hive-surface)",
        borderColor: "var(--hive-border)",
      }}
    >
      {tabs.map((tab) => {
        const isActive = filter === tab.key;
        const href =
          tab.key === "upcoming"
            ? basePath
            : `${basePath}?filter=past`;

        return (
          <Link
            key={tab.key}
            href={href}
            className={cn(
              "px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all",
              isActive ? "text-white shadow-sm" : "hover:bg-white"
            )}
            style={{
              fontFamily: "var(--font-mono)",
              background: isActive ? "var(--hive-primary)" : "transparent",
              color: isActive ? "#fff" : "var(--hive-muted)",
            }}
            aria-current={isActive ? "page" : undefined}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
