import { agentFor } from "@/lib/chat/auth";
import { query } from "@/lib/chat/db";

/** The inbox list: open (or closed) conversations, newest activity first, with unread counts. */
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  if (!agentFor(request)) return Response.json({ ok: false }, { status: 401 });
  const status = new URL(request.url).searchParams.get("status") === "closed" ? "closed" : "open";

  const rows = await query<{
    id: string;
    visitor_name: string;
    visitor_contact: string;
    page: string;
    lang: string;
    last_at: Date | string;
    unread: string;
    preview: string | null;
    preview_sender: string | null;
  }>(
    `SELECT c.id, c.visitor_name, c.visitor_contact, c.page, c.lang, c.last_at,
       (SELECT count(*) FROM chat_messages m WHERE m.conversation_id = c.id AND m.sender = 'visitor' AND m.id > c.agent_seen_id) AS unread,
       last.body AS preview, last.sender AS preview_sender
     FROM chat_conversations c
     LEFT JOIN LATERAL (SELECT body, sender FROM chat_messages m WHERE m.conversation_id = c.id ORDER BY id DESC LIMIT 1) last ON true
     WHERE c.status = $1
     ORDER BY c.last_at DESC
     LIMIT 200`,
    [status],
  );

  return Response.json({
    ok: true,
    conversations: rows.map((r) => ({
      id: r.id,
      name: r.visitor_name,
      contact: r.visitor_contact,
      page: r.page,
      lang: r.lang,
      lastAt: new Date(r.last_at).toISOString(),
      unread: Number(r.unread),
      preview: (r.preview ?? "").slice(0, 140),
      previewFromTeam: r.preview_sender === "agent",
    })),
  });
}
