import type { Metadata } from "next";
import { Settings, Bell, Shield, Database, Palette, Save } from "lucide-react";

export const metadata: Metadata = {
  title: "Settings — Admin",
  description: "Hive platform configuration and settings.",
};

const sections = [
  {
    icon: Bell,
    title: "NOTIFICATIONS",
    desc: "Configure platform-wide email and push notification settings.",
    fields: [
      { id: "notif-welcome",    label: "Send welcome email on signup",          type: "toggle", value: true  },
      { id: "notif-event",      label: "Send event reminders 24h before",       type: "toggle", value: true  },
      { id: "notif-announce",   label: "Notify members on new announcements",   type: "toggle", value: false },
    ],
  },
  {
    icon: Shield,
    title: "SECURITY",
    desc: "Authentication and security configuration.",
    fields: [
      { id: "sec-email-confirm", label: "Require email confirmation on signup", type: "toggle", value: true  },
      { id: "sec-allow-register",label: "Allow public registration",             type: "toggle", value: true  },
    ],
  },
  {
    icon: Palette,
    title: "BRANDING",
    desc: "Customise the platform name and visual identity.",
    fields: [
      { id: "brand-name", label: "Platform name", type: "text", value: "Hive" },
      { id: "brand-url",  label: "Platform URL",  type: "text", value: "https://hive.app" },
    ],
  },
  {
    icon: Database,
    title: "DATABASE",
    desc: "Prisma + Supabase connection status.",
    fields: [
      { id: "db-url",    label: "DATABASE_URL set",  type: "status", value: !!process.env.DATABASE_URL  },
      { id: "db-direct", label: "DIRECT_URL set",    type: "status", value: !!process.env.DIRECT_URL    },
    ],
  },
];

export default function AdminSettingsPage() {
  return (
    <div className="flex flex-col gap-8 max-w-2xl">
      <div>
        <span
          className="hive-badge mb-1 inline-flex w-fit"
          style={{ color: "var(--hive-accent)", background: "#ffe4e4", borderColor: "#ffe4e4" }}
        >
          ADMIN › SETTINGS
        </span>
        <h2 className="text-3xl font-bold" style={{ color: "var(--hive-text)" }}>
          Platform Settings
        </h2>
        <p className="text-sm mt-1" style={{ color: "var(--hive-muted)" }}>
          Global configuration for the Hive platform.
        </p>
      </div>

      {sections.map((section) => (
        <div key={section.title} className="hive-card p-6 flex flex-col gap-4">
          <div className="flex items-center gap-2.5">
            <section.icon size={15} style={{ color: "var(--hive-primary)" }} />
            <h3 className="text-xs font-bold uppercase tracking-wider" style={{ fontFamily: "var(--font-mono)", color: "var(--hive-text)" }}>
              {section.title}
            </h3>
          </div>
          <p className="text-xs" style={{ color: "var(--hive-muted)" }}>{section.desc}</p>

          <div className="flex flex-col gap-3 pt-1">
            {section.fields.map((field) => (
              <div key={field.id} className="flex items-center justify-between py-2 border-b last:border-0" style={{ borderColor: "var(--hive-border)" }}>
                <label
                  htmlFor={field.id}
                  className="text-xs"
                  style={{ color: "var(--hive-text)" }}
                >
                  {field.label}
                </label>
                {field.type === "toggle" && (
                  <div
                    id={field.id}
                    role="switch"
                    aria-checked={field.value as boolean}
                    className="w-9 h-5 rounded-full relative cursor-pointer transition-colors"
                    style={{ background: (field.value as boolean) ? "var(--hive-primary)" : "var(--hive-border)" }}
                  >
                    <span
                      className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform"
                      style={{ transform: (field.value as boolean) ? "translateX(18px)" : "translateX(2px)" }}
                    />
                  </div>
                )}
                {field.type === "text" && (
                  <input
                    id={field.id}
                    type="text"
                    defaultValue={field.value as string}
                    className="hive-input px-2.5 py-1.5 text-xs w-48 rounded-xl"
                    style={{ color: "var(--hive-text)", fontFamily: "var(--font-mono)" }}
                  />
                )}
                {field.type === "status" && (
                  <span
                    className="hive-badge text-[10px]"
                    style={{
                      color: (field.value as boolean) ? "var(--hive-success)" : "var(--hive-accent)",
                      background: (field.value as boolean) ? "#f0fdf4" : "#ffe4e4",
                      borderColor: (field.value as boolean) ? "#f0fdf4" : "#ffe4e4",
                    }}
                  >
                    {(field.value as boolean) ? "SET" : "MISSING"}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      <button
        type="button"
        className="hive-btn px-6 py-3 text-sm text-white flex items-center gap-2 self-start"
        style={{ background: "var(--hive-primary)" }}
      >
        <Save size={14} /> SAVE_SETTINGS
      </button>
    </div>
  );
}
