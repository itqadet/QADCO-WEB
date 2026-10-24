import { allowedOrigins, preflight, withCors } from "@/lib/cors";
import { escapeHtml as escape, mailConfigured, mailQadco } from "@/lib/mail";

/**
 * Sends a contact-form request to QADCO by email (see src/lib/mail.ts for the Resend settings).
 * Without RESEND_API_KEY the form falls back to "copy / email / call". The static copy on
 * Bluehost posts here too (see src/lib/cors.ts), because Bluehost's bot check blocks background
 * requests to its own PHP.
 */

type Payload = Record<"name" | "company" | "phone" | "email" | "type" | "location" | "message" | "lang", string> & {
  /** Honeypot: hidden from people, filled in by bots. */
  website?: string;
  /** Milliseconds the form was open before submitting; real people take more than a couple of seconds. */
  elapsed?: number;
};

const LIMITS: Record<string, number> = { name: 120, company: 160, phone: 40, email: 160, type: 80, location: 160, message: 4000 };
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** A light per-address limit. Each server instance keeps its own count, which is enough to slow a flood. */
const recent = new Map<string, number[]>();
function tooMany(ip: string) {
  const now = Date.now();
  const hits = (recent.get(ip) ?? []).filter((t) => now - t < 10 * 60_000);
  hits.push(now);
  recent.set(ip, hits);
  return hits.length > 5;
}

export const OPTIONS = preflight();
export const POST = withCors(send);

async function send(request: Request): Promise<Response> {
  if (!mailConfigured()) return Response.json({ ok: false, reason: "not-configured" }, { status: 503 });

  let body: Payload;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, reason: "invalid" }, { status: 400 });
  }

  // Bots: pretend success so they don't retry, but send nothing.
  if (body.website || (typeof body.elapsed === "number" && body.elapsed < 2500)) {
    return Response.json({ ok: true });
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (tooMany(ip)) return Response.json({ ok: false, reason: "rate-limited" }, { status: 429 });

  const field = (k: keyof typeof LIMITS) => String(body[k as keyof Payload] ?? "").trim().slice(0, LIMITS[k]);
  const data = {
    name: field("name"),
    company: field("company"),
    phone: field("phone"),
    email: field("email"),
    type: field("type"),
    location: field("location"),
    message: field("message"),
  };
  if (!data.name || data.phone.replace(/\D/g, "").length < 8 || !data.type || (data.email && !EMAIL.test(data.email))) {
    return Response.json({ ok: false, reason: "invalid" }, { status: 400 });
  }

  const language = body.lang === "ar" ? "Arabic" : "English";
  const site = allowedOrigins.includes(request.headers.get("origin") ?? "") ? new URL(request.headers.get("origin")!).host : "qadco-web.vercel.app";

  const rows: [string, string][] = [
    ["Name", data.name],
    ["Company", data.company],
    ["Phone", data.phone],
    ["Email", data.email],
    ["Needs", data.type],
    ["Location", data.location],
    ["Site language", language],
  ];
  const text =
    rows.filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`).join("\n") + (data.message ? `\n\nAbout the project:\n${data.message}` : "");
  const html = `
    <h2 style="font-family:Arial,sans-serif;color:#14215A">New request from the website</h2>
    <table style="font-family:Arial,sans-serif;font-size:15px;border-collapse:collapse">
      ${rows
        .filter(([, v]) => v)
        .map(([k, v]) => `<tr><td style="padding:6px 16px 6px 0;color:#5A6378">${k}</td><td style="padding:6px 0"><strong>${escape(v)}</strong></td></tr>`)
        .join("")}
    </table>
    ${data.message ? `<p style="font-family:Arial,sans-serif;font-size:15px;white-space:pre-wrap;margin-top:16px">${escape(data.message)}</p>` : ""}
    <p style="font-family:Arial,sans-serif;font-size:13px;color:#5A6378;margin-top:24px">Sent from the contact form on ${site}. Reply to this email to answer the visitor${data.email ? "" : " (no email given: call them)"}.</p>`;

  const sent = await mailQadco({
    subject: `Website request: ${data.type} from ${data.name}`,
    text,
    html,
    replyTo: data.email || undefined,
  });
  if (!sent) return Response.json({ ok: false, reason: "send-failed" }, { status: 502 });
  return Response.json({ ok: true });
}
