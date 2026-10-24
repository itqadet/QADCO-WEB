/**
 * Cross-site access for the API routes that the static copy on Bluehost calls (contact form, chat).
 * CONTACT_ORIGINS (Vercel environment variable) lists the sites allowed in, comma-separated;
 * it defaults to qasralandalusco.com.
 */
export const allowedOrigins = (process.env.CONTACT_ORIGINS || "https://qasralandalusco.com,https://www.qasralandalusco.com")
  .split(",")
  .map((o) => o.trim().replace(/\/$/, ""))
  .filter(Boolean);

/** Lets the listed sites read our answer; requests from anywhere else get no CORS headers. */
export function cors(request: Request, methods = "POST, OPTIONS"): Record<string, string> {
  const origin = request.headers.get("origin");
  if (!origin || !allowedOrigins.includes(origin)) return {};
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": methods,
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
}

/** Wraps a route handler so its answer carries the CORS headers. */
export function withCors(handler: (request: Request) => Promise<Response>, methods?: string) {
  return async (request: Request) => {
    const res = await handler(request);
    for (const [k, v] of Object.entries(cors(request, methods))) res.headers.set(k, v);
    return res;
  };
}

/** Answer to the browser's pre-flight check. */
export function preflight(methods?: string) {
  return (request: Request) => new Response(null, { status: 204, headers: cors(request, methods) });
}
