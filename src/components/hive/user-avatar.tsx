import { getInitials } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface UserAvatarProps {
  name: string;
  avatarUrl?: string | null;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeMap = {
  sm: { wh: "w-7 h-7", text: "text-[10px]" },
  md: { wh: "w-9 h-9", text: "text-xs" },
  lg: { wh: "w-12 h-12", text: "text-sm" },
};

/**
 * UserAvatar — RSC-compatible (no hooks, pure display).
 * Shows the user's avatar image or falls back to initials.
 */
export function UserAvatar({
  name,
  avatarUrl,
  size = "md",
  className,
}: UserAvatarProps) {
  const { wh, text } = sizeMap[size];
  const initials = getInitials(name);

  if (avatarUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={avatarUrl}
        alt={`${name}'s avatar`}
        className={cn(wh, "rounded-full object-cover shrink-0 border", className)}
        style={{ borderColor: "var(--hive-border)" }}
      />
    );
  }

  return (
    <div
      className={cn(
        wh,
        text,
        "rounded-full flex items-center justify-center font-bold shrink-0 select-none",
        className
      )}
      style={{
        background: "var(--hive-primary-light)",
        color: "var(--hive-primary)",
        fontFamily: "var(--font-mono)",
      }}
      aria-label={`${name}'s avatar`}
      role="img"
    >
      {initials}
    </div>
  );
}
