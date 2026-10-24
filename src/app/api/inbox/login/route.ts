import { checkLogin, createSession, inboxConfigured, sessionCookie } from "@/lib/chat/auth";

/** Signs a team member in to the chat inbox. At most 10 tries per address in 15 minutes. */
const attempts = new Map<string, number[]>();

export async function POST(request: Request) {
  if (!inboxConfigured()) return Response.json({ ok: false, reason: "not-configured" }, { status: 503 });
  const origin = request.headers.get("origin");
  if (!origin || new URL(origin).host !== new URL(request.url).host) return Response.json({ ok: false }, { status: 403 });

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const now = Date.now();
  const recent = (attempts.get(ip) ?? []).filter((t) => now - t < 15 * 60_000);
  if (recent.length >= 10) return Response.json({ ok: false, reason: "rate-limited" }, { status: 429 });
  recent.push(now);
  attempts.set(ip, recent);

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, reason: "invalid" }, { status: 400 });
  }
  const agent = await checkLogin(String(body.id ?? "").slice(0, 60), String(body.password ?? "").slice(0, 200));
  if (!agent) return Response.json({ ok: false, reason: "wrong" }, { status: 401 });

  attempts.delete(ip);
  return Response.json({ ok: true, name: agent.name }, { headers: { "Set-Cookie": sessionCookie(createSession(agent)) } });
}
