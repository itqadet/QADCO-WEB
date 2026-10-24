import { agentFor } from "@/lib/chat/auth";
import { query } from "@/lib/chat/db";
import { clean, LIMITS } from "@/lib/chat/visitor";

/** A team member's reply, shown to the visitor under the team member's name. */
export async function POST(request: Request) {
  const agent = agentFor(request);
  if (!agent) return Response.json({ ok: false }, { status: 401 });

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, reason: "invalid" }, { status: 400 });
  }
  const id = String(body.c ?? "");
  const text = clean(body.message, LIMITS.body);
  if (!/^[0-9a-f-]{36}$/i.test(id) || !text) return Response.json({ ok: false, reason: "invalid" }, { status: 400 });

  const [row] = await query<{ id: string }>(
    `INSERT INTO chat_messages (conversation_id, sender, agent_name, body)
     SELECT id, 'agent', $2, $3 FROM chat_conversations WHERE id = $1
     RETURNING id`,
    [id, agent.name, text],
  );
  if (!row) return Response.json({ ok: false, reason: "not-found" }, { status: 404 });
  await query("UPDATE chat_conversations SET last_at = now(), status = 'open', agent_seen_id = GREATEST(agent_seen_id, $2) WHERE id = $1", [
    id,
    Number(row.id),
  ]);
  return Response.json({ ok: true, messageId: Number(row.id) });
}
