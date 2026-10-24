import { sessionCookie } from "@/lib/chat/auth";

/** Signs out of the chat inbox. */
export function POST() {
  return Response.json({ ok: true }, { headers: { "Set-Cookie": sessionCookie("", 0) } });
}
