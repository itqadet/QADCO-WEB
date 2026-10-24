import { getSettings } from "@/lib/content";

/**
 * Emails QADCO through Resend (resend.com). Used by the contact form and the live chat.
 *
 * Environment variables (Vercel → Settings → Environment Variables):
 *   RESEND_API_KEY  required; without it nothing is sent.
 *   CONTACT_FROM    optional sender, e.g. "QADCO Website <website@qasralandalusco.com>" once a
 *                   domain is verified in Resend. Defaults to Resend's shared test sender, which
 *                   can only deliver to the email address the Resend account was created with.
 *   CONTACT_TO      optional recipient; defaults to the email in the Studio's Contact details.
 */

export const mailConfigured = () => Boolean(process.env.RESEND_API_KEY?.trim());

export const escapeHtml = (s: string) => s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

type Mail = { subject: string; text: string; html: string; replyTo?: string };

/** Sends one email to QADCO. Returns false (and logs why) when it could not be sent. */
export async function mailQadco({ subject, text, html, replyTo }: Mail): Promise<boolean> {
  const key = process.env.RESEND_API_KEY?.trim();
  if (!key) return false;
  const settings = await getSettings();
  const to = process.env.CONTACT_TO?.trim() || settings.email.display;
  const from = process.env.CONTACT_FROM?.trim() || "QADCO Website <onboarding@resend.dev>";

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from, to: [to], subject, text, html, ...(replyTo ? { reply_to: replyTo } : {}) }),
  });
  if (!res.ok) {
    console.error("[mail] Resend error", res.status, await res.text());
    return false;
  }
  return true;
}
