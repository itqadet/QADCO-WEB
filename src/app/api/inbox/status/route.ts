import { agentFor } from "@/lib/chat/auth";
import { query } from "@/lib/chat/db";

/** Closes a conversation (moves it out of the open list) or opens it again. Nothing is deleted. */
export async function POST(request: Request) {
  if (!agentFor(request)) return Response.json({ ok: false }, { status: 401 });
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, reason: "invalid" }, { status: 400 });
  }
  const id = String(body.c ?? "");
  const status = body.status === "closed" ? "closed" : "open";
  if (!/^[0-9a-f-]{36}$/i.test(id)) return Response.json({ ok: false, reason: "invalid" }, { status: 400 });
  await query("UPDATE chat_conversations SET status = $2 WHERE id = $1", [id, status]);
  return Response.json({ ok: true });
}
