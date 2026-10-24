import { preflight, withCors } from "@/lib/cors";
import { inboxConfigured } from "@/lib/chat/auth";
import { chatConfigured } from "@/lib/chat/db";

/** Whether the live chat is set up (database and at least one team member), so the site can offer it. */
export const dynamic = "force-dynamic";
export const OPTIONS = preflight("GET, OPTIONS");
export const GET = withCors(async () => Response.json({ enabled: chatConfigured() && inboxConfigured() }), "GET, OPTIONS");
