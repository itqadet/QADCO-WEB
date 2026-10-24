import { agentFor } from "@/lib/chat/auth";
import { messagesAfter, query } from "@/lib/chat/db";

/** One conversation for the inbox: its details and messages after a given id. Marks them as seen. */
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  if (!agentFor(request)) return Response.json({ ok: false }, { status: 401 });
  const params = new URL(request.url).searchParams;
  const id = params.get("c") ?? "";
  if (!/^[0-9a-f-]{36}$/i.test(id)) return Response.json({ ok: false }, { status: 400 });
  const after = Number(params.get("after")) || 0;

  const [conversation] = await query<{
    id: string;
    visitor_name: string;
    visitor_contact: string;
    page: string;
    lang: string;
    status: string;
    created_at: Date | string;
  }>("SELECT id, visitor_name, visitor_contact, page, lang, status, created_at FROM chat_conversations WHERE id = $1", [id]);
  if (!conversation) return Response.json({ ok: false }, { status: 404 });

  const messages = await messagesAfter(id, after);
  const last = messages.at(-1);
  if (last) await query("UPDATE chat_conversations SET agent_seen_id = GREATEST(agent_seen_id, $2) WHERE id = $1", [id, last.id]);

  return Response.json({
    ok: true,
    conversation: {
      id: conversation.id,
      name: conversation.visitor_name,
      contact: conversation.visitor_contact,
      page: conversation.page,
      lang: conversation.lang,
      status: conversation.status,
      createdAt: new Date(conversation.created_at).toISOString(),
    },
    messages,
  });
}
