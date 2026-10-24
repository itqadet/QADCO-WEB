import { randomUUID } from "node:crypto";
import { preflight, withCors } from "@/lib/cors";
import { newVisitorToken } from "@/lib/chat/auth";
import { ChatNotConfigured, query } from "@/lib/chat/db";
import { clean, LIMITS, tooManyStarts, whatsappLink } from "@/lib/chat/visitor";
import { escapeHtml, mailQadco } from "@/lib/mail";

/**
 * Starts a live-chat conversation with the visitor's first message. Answers with the conversation
 * id and a secret token that only this browser keeps; both are needed to read or add to it.
 * The team is emailed about every new conversation.
 */
export const OPTIONS = preflight();
export const POST = withCors(start);

async function start(request: Request): Promise<Response> {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, reason: "invalid" }, { status: 400 });
  }
  // Bots: a hidden field people never fill. Store nothing.
  if (body.website) return Response.json({ ok: false, reason: "invalid" }, { status: 400 });

  const name = clean(body.name, LIMITS.name);
  const contact = clean(body.contact, LIMITS.contact);
  const page = clean(body.page, LIMITS.page);
  const text = clean(body.message, LIMITS.body);
  const lang = body.lang === "ar" ? "ar" : "en";
  if (!text) return Response.json({ ok: false, reason: "invalid" }, { status: 400 });
  if (tooManyStarts(request)) return Response.json({ ok: false, reason: "rate-limited" }, { status: 429 });

  const id = randomUUID();
  const { token, hash } = newVisitorToken();
  try {
    await query(
      "INSERT INTO chat_conversations (id, token_hash, visitor_name, visitor_contact, page, lang) VALUES ($1, $2, $3, $4, $5, $6)",
      [id, hash, name, contact, page, lang],
    );
    await query("INSERT INTO chat_messages (conversation_id, sender, body) VALUES ($1, 'visitor', $2)", [id, text]);
  } catch (error) {
    if (error instanceof ChatNotConfigured) return Response.json({ ok: false, reason: "not-configured" }, { status: 503 });
    throw error;
  }

  // CHAT_INBOX_URL (Vercel setting) is the inbox address in emails, e.g. https://inbox.qasralandalusco.com/inbox
  const inbox = `${process.env.CHAT_INBOX_URL?.trim().replace(/\/$/, "") || `${new URL(request.url).origin}/inbox`}?c=${id}`;
  const whatsapp = whatsappLink(contact);
  const who = name || "A visitor";
  const rows: [string, string][] = [
    ["Name", name],
    ["Phone or email", contact],
    ["Page", page],
    ["Language", lang === "ar" ? "Arabic" : "English"],
  ];
  const cell = (k: string, v: string) =>
    `<tr><td style="padding:6px 16px 6px 0;color:#5A6378">${k}</td><td style="padding:6px 0"><strong>${escapeHtml(v)}</strong></td></tr>`;
  const button = (href: string, label: string, color: string) =>
    `<a href="${escapeHtml(href)}" style="display:inline-block;margin:8px 8px 0 0;padding:10px 18px;border-radius:999px;background:${color};color:#fff;text-decoration:none;font-weight:bold">${label}</a>`;
  // the email is a nudge; the chat works whether or not it is sent
  await mailQadco({
    subject: `New chat: ${who}`,
    text:
      `${who} started a chat on the website.\n\n` +
      rows.filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`).join("\n") +
      `\n\nFirst message:\n${text}\n\nAnswer in the inbox: ${inbox}` +
      (whatsapp ? `\nOr on WhatsApp: ${whatsapp}` : ""),
    html: `
      <h2 style="font-family:Arial,sans-serif;color:#14215A">${escapeHtml(who)} started a chat</h2>
      <table style="font-family:Arial,sans-serif;font-size:15px;border-collapse:collapse">${rows.filter(([, v]) => v).map(([k, v]) => cell(k, v)).join("")}</table>
      <p style="font-family:Arial,sans-serif;font-size:15px;white-space:pre-wrap;margin-top:16px;padding:12px 14px;background:#F3F3F0;border-radius:8px">${escapeHtml(text)}</p>
      <p style="font-family:Arial,sans-serif">${button(inbox, "Answer in the inbox", "#14215A")}${whatsapp ? button(whatsapp, "Open WhatsApp", "#167A42") : ""}</p>`,
    replyTo: contact.includes("@") ? contact : undefined,
  }).catch((error) => console.error("[chat] notification email failed", error));

  return Response.json({ ok: true, id, token });
}
