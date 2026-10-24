import { tokenMatches } from "./auth";
import { query } from "./db";

/** Field limits for what visitors send. */
export const LIMITS = { name: 80, contact: 120, page: 500, body: 2000 } as const;

export const clean = (value: unknown, max: number) => String(value ?? "").trim().slice(0, max);

/** The conversation if this browser's token belongs to it, else null. */
export async function conversationFor(id: unknown, token: unknown) {
  if (typeof id !== "string" || typeof token !== "string" || !/^[0-9a-f-]{36}$/i.test(id)) return null;
  const [row] = await query<{ id: string; token_hash: string; status: string }>(
    "SELECT id, token_hash, status FROM chat_conversations WHERE id = $1",
    [id],
  );
  return row && tokenMatches(token, row.token_hash) ? row : null;
}

/** A light per-address limit. Each server instance keeps its own count, which is enough to slow a flood. */
const recent = new Map<string, number[]>();
export function tooManyStarts(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const now = Date.now();
  const hits = (recent.get(ip) ?? []).filter((t) => now - t < 10 * 60_000);
  hits.push(now);
  recent.set(ip, hits);
  return hits.length > 5;
}

/** At most 15 visitor messages a minute in one conversation. */
export async function tooManyMessages(conversationId: string) {
  const [row] = await query<{ n: string }>(
    "SELECT count(*) AS n FROM chat_messages WHERE conversation_id = $1 AND sender = 'visitor' AND created_at > now() - interval '1 minute'",
    [conversationId],
  );
  return Number(row?.n ?? 0) >= 15;
}

/** A WhatsApp link for a contact that looks like a phone number (Qatar numbers may omit +974). */
export function whatsappLink(contact: string): string | null {
  if (contact.includes("@")) return null;
  let digits = contact.replace(/\D/g, "").replace(/^00/, "");
  if (digits.length === 8) digits = `974${digits}`;
  return digits.length >= 10 ? `https://wa.me/${digits}` : null;
}
