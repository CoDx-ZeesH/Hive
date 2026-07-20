"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
}

interface NavGroup {
  title?: string;
  items: NavItem[];
}

interface SidebarNavProps {
  groups: NavGroup[];
}

/**
 * SidebarNav — Client Component
 *
 * Renders navigation groups with active-state highlighting via usePathname.
 * Labels use JetBrains Mono uppercase per the Hive design language.
 */
export function SidebarNav({ groups }: SidebarNavProps) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-6 flex-1 overflow-y-auto" aria-label="Sidebar navigation">
      {groups.map((group, gi) => (
        <div key={gi} className="flex flex-col gap-1">
          {group.title && (
            <p
              className="px-3 mb-1 text-[10px] font-semibold uppercase tracking-widest"
              style={{
                fontFamily: "var(--font-mono)",
                color: "var(--hive-muted)",
              }}
            >
              {group.title}
            </p>
          )}
          {group.items.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 group",
                  isActive
                    ? "text-white"
                    : "hover:bg-[var(--hive-surface)]"
                )}
                style={{
                  fontFamily: "var(--font-mono)",
                  background: isActive ? "var(--hive-primary)" : "transparent",
                  color: isActive ? "#fff" : "var(--hive-muted)",
                  letterSpacing: "0.04em",
                }}
                aria-current={isActive ? "page" : undefined}
              >
                <item.icon
                  className="shrink-0 transition-colors"
                  size={16}
                  strokeWidth={2}
                  style={{
                    color: isActive ? "#fff" : "var(--hive-muted)",
                  }}
                />
                <span className="flex-1 truncate uppercase">{item.label}</span>
                {item.badge && (
                  <span
                    className="ml-auto text-[10px] px-1.5 py-0.5 rounded-full font-bold"
                    style={{
                      background: isActive
                        ? "rgba(255,255,255,0.25)"
                        : "var(--hive-primary-light)",
                      color: isActive ? "#fff" : "var(--hive-primary)",
                      fontFamily: "var(--font-mono)",
                    }}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      ))}
    </nav>
  );
}
