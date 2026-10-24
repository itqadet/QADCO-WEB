import { preflight, withCors } from "@/lib/cors";
import { ChatNotConfigured, query } from "@/lib/chat/db";
import { clean, conversationFor, LIMITS, tooManyMessages } from "@/lib/chat/visitor";

/** A visitor's next message in their conversation. A conversation the team closed opens again. */
export const OPTIONS = preflight();
export const POST = withCors(send);

async function send(request: Request): Promise<Response> {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, reason: "invalid" }, { status: 400 });
  }
  const text = clean(body.message, LIMITS.body);
  if (!text) return Response.json({ ok: false, reason: "invalid" }, { status: 400 });

  try {
    const conversation = await conversationFor(body.id, body.token);
    if (!conversation) return Response.json({ ok: false, reason: "not-found" }, { status: 404 });
    if (await tooManyMessages(conversation.id)) return Response.json({ ok: false, reason: "rate-limited" }, { status: 429 });

    const [row] = await query<{ id: string }>(
      "INSERT INTO chat_messages (conversation_id, sender, body) VALUES ($1, 'visitor', $2) RETURNING id",
      [conversation.id, text],
    );
    await query("UPDATE chat_conversations SET last_at = now(), status = 'open' WHERE id = $1", [conversation.id]);
    return Response.json({ ok: true, messageId: Number(row.id) });
  } catch (error) {
    if (error instanceof ChatNotConfigured) return Response.json({ ok: false, reason: "not-configured" }, { status: 503 });
    throw error;
  }
}
