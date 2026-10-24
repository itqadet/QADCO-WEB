import type { Metadata, Viewport } from "next";
import "@/styles/globals.css";
import { fontVariables } from "@/lib/fonts";

/** Root layout for the team's chat inbox. Private: never indexed, never in the static (Bluehost) copy. */
export const metadata: Metadata = {
  title: "QADCO chat inbox",
  robots: { index: false, follow: false },
  manifest: "/inbox.webmanifest",
  appleWebApp: { capable: true, title: "QADCO Inbox", statusBarStyle: "default" },
};

export const viewport: Viewport = { themeColor: "#14215a" };

export default function InboxLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={fontVariables}>
      <body>{children}</body>
    </html>
  );
}
