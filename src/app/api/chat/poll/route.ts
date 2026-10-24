import { preflight, withCors } from "@/lib/cors";
import { ChatNotConfigured, messagesAfter } from "@/lib/chat/db";
import { conversationFor } from "@/lib/chat/visitor";

/**
 * New messages in a visitor's conversation since the last one their browser has. Posted rather
 * than fetched, so the secret token stays out of addresses and server logs.
 */
export const OPTIONS = preflight();
export const POST = withCors(poll);

async function poll(request: Request): Promise<Response> {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, reason: "invalid" }, { status: 400 });
  }
  try {
    const conversation = await conversationFor(body.id, body.token);
    if (!conversation) return Response.json({ ok: false, reason: "not-found" }, { status: 404 });
    const after = Number.isFinite(Number(body.after)) ? Number(body.after) : 0;
    const messages = await messagesAfter(conversation.id, after);
    return Response.json({ ok: true, messages, status: conversation.status });
  } catch (error) {
    if (error instanceof ChatNotConfigured) return Response.json({ ok: false, reason: "not-configured" }, { status: 503 });
    throw error;
  }
}
