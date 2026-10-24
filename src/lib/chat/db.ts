/**
 * Storage for the live chat: two tables in Postgres.
 *
 * On Vercel the database is Neon (Vercel → Storage → Create Database → Neon), which sets
 * DATABASE_URL. Without it, development runs on an in-memory Postgres (PGlite) so the chat can be
 * tried locally; it empties on restart. The tables are created on first use.
 */

type Row = Record<string, unknown>;
type Run = (text: string, params?: unknown[]) => Promise<Row[]>;

export class ChatNotConfigured extends Error {}

let connection: Promise<Run> | undefined;

async function connect(): Promise<Run> {
  const url = (process.env.DATABASE_URL || process.env.POSTGRES_URL)?.trim();
  let run: Run;
  if (url) {
    const { neon } = await import("@neondatabase/serverless");
    const sql = neon(url);
    run = (text, params) => sql.query(text, params ?? []) as Promise<Row[]>;
  } else if (process.env.NODE_ENV !== "production") {
    const { PGlite } = await import("@electric-sql/pglite");
    const db = new PGlite();
    run = async (text, params) => (await db.query<Row>(text, params ?? [])).rows;
  } else {
    throw new ChatNotConfigured("DATABASE_URL is not set");
  }

  // one statement per call: Neon's HTTP driver runs a single statement at a time
  await run(`CREATE TABLE IF NOT EXISTS chat_conversations (
    id uuid PRIMARY KEY,
    token_hash text NOT NULL,
    visitor_name text NOT NULL DEFAULT '',
    visitor_contact text NOT NULL DEFAULT '',
    page text NOT NULL DEFAULT '',
    lang text NOT NULL DEFAULT 'en',
    status text NOT NULL DEFAULT 'open',
    created_at timestamptz NOT NULL DEFAULT now(),
    last_at timestamptz NOT NULL DEFAULT now(),
    agent_seen_id bigint NOT NULL DEFAULT 0
  )`);
  await run(`CREATE TABLE IF NOT EXISTS chat_messages (
    id bigserial PRIMARY KEY,
    conversation_id uuid NOT NULL REFERENCES chat_conversations(id),
    sender text NOT NULL CHECK (sender IN ('visitor', 'agent')),
    agent_name text NOT NULL DEFAULT '',
    body text NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now()
  )`);
  await run("CREATE INDEX IF NOT EXISTS chat_messages_by_conversation ON chat_messages (conversation_id, id)");
  await run("CREATE INDEX IF NOT EXISTS chat_conversations_by_last ON chat_conversations (last_at DESC)");
  return run;
}

/** Runs one SQL statement with $1, $2... parameters and returns its rows. */
export async function query<T = Row>(text: string, params?: unknown[]): Promise<T[]> {
  connection ??= connect().catch((error) => {
    connection = undefined; // try again on the next request
    throw error;
  });
  const run = await connection;
  return (await run(text, params)) as T[];
}

export const chatConfigured = () =>
  Boolean((process.env.DATABASE_URL || process.env.POSTGRES_URL)?.trim()) || process.env.NODE_ENV !== "production";

export type ChatMessage = { id: number; sender: "visitor" | "agent"; agentName: string; body: string; at: string };

/** Messages of a conversation after a given id, oldest first. */
export async function messagesAfter(conversationId: string, after: number): Promise<ChatMessage[]> {
  const rows = await query<{ id: string; sender: "visitor" | "agent"; agent_name: string; body: string; created_at: Date | string }>(
    "SELECT id, sender, agent_name, body, created_at FROM chat_messages WHERE conversation_id = $1 AND id > $2 ORDER BY id LIMIT 200",
    [conversationId, after],
  );
  return rows.map((r) => ({
    id: Number(r.id),
    sender: r.sender,
    agentName: r.agent_name,
    body: r.body,
    at: new Date(r.created_at).toISOString(),
  }));
}
