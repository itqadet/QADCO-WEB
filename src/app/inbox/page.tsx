import { cookies } from "next/headers";
import { readSession, SESSION_COOKIE, setupProblems } from "@/lib/chat/auth";
import { chatConfigured } from "@/lib/chat/db";
import { Inbox } from "@/components/inbox/Inbox";
import { Login } from "@/components/inbox/Login";

export const dynamic = "force-dynamic";

/** The team's chat inbox: the sign-in form, or the conversations once signed in. */
export default async function InboxPage({ searchParams }: { searchParams: Promise<{ c?: string }> }) {
  const [jar, { c }] = await Promise.all([cookies(), searchParams]);
  const agent = readSession(jar.get(SESSION_COOKIE)?.value);
  if (!agent) {
    const database = chatConfigured() ? [] : ["DATABASE_URL is missing: connect the Neon database to this project under Storage, with Production ticked."];
    return <Login problems={[...database, ...setupProblems()]} />;
  }
  return <Inbox agentName={agent.name} initialId={c && /^[0-9a-f-]{36}$/i.test(c) ? c : null} />;
}
