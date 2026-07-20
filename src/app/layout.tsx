import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

/**
 * JetBrains Mono — loaded via Google Fonts.
 * Used ONLY for: nav, buttons, badges, stats, labels, tags, usernames, IDs, code.
 * Exposed as CSS variable --font-jetbrains-mono.
 */
const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

/**
 * Site-wide metadata — SEO optimized.
 */
export const metadata: Metadata = {
  title: {
    default: "Hive — The Community Operating System",
    template: "%s | Hive",
  },
  description:
    "Hive is a modern Community Operating System built to help student developer communities grow, engage, and manage their members through a unified platform.",
  keywords: [
    "community",
    "developer community",
    "events",
    "student developers",
    "hackathon",
    "open source",
  ],
  authors: [{ name: "Hive" }],
  creator: "Hive",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"
  ),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
    title: "Hive — The Community Operating System",
    description:
      "Build communities, not just events. The unified platform for student developer communities.",
    siteName: "Hive",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hive — The Community Operating System",
    description:
      "Build communities, not just events. The unified platform for student developer communities.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: "#0DB4C9",
  width: "device-width",
  initialScale: 1,
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: Readonly<RootLayoutProps>) {
  return (
    <html
      lang="en"
      className={cn("h-full", jetbrainsMono.variable, "font-sans", geist.variable)}
      suppressHydrationWarning
    >
      <head>
        {/*
         * Plus Jakarta Sans — loaded via Google Fonts preconnect.
         * This is our General Sans substitute (similar aesthetic, freely available).
         * The @font-face in globals.css handles the actual loading.
         */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-dvh flex flex-col antialiased">
        {children}
      </body>
    </html>
  );
}
