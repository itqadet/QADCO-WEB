import { createHash, createHmac, randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

/**
 * Sign-in for the team inbox, and the secret tokens that let a visitor's browser read its own chat.
 *
 * Environment variables (Vercel → Settings → Environment Variables):
 *   CHAT_SECRET  a long random string that signs inbox sessions (`npm run chat:agent` prints one).
 *   CHAT_AGENTS  the team, as JSON: [{"id":"ahmed","name":"Ahmed","hash":"scrypt:..."}].
 *                Make each entry with `npm run chat:agent`, which asks for the name and password
 *                and prints the line to add; passwords themselves are never stored.
 */

const scryptAsync = promisify(scrypt) as (password: string, salt: Buffer, keylen: number, options: object) => Promise<Buffer>;

export type Agent = { id: string; name: string };
type AgentRecord = Agent & { hash: string };

function agents(): AgentRecord[] {
  try {
    const list = JSON.parse(process.env.CHAT_AGENTS || "[]");
    return Array.isArray(list) ? list.filter((a) => a && typeof a.id === "string" && typeof a.name === "string" && typeof a.hash === "string") : [];
  } catch {
    console.error("[chat] CHAT_AGENTS is not valid JSON");
    return [];
  }
}

const secret = () => process.env.CHAT_SECRET?.trim() ?? "";
export const inboxConfigured = () => secret().length >= 32 && agents().length > 0;

/** What is missing from the inbox settings, in words, without revealing any value. Empty when all is well. */
export function setupProblems(): string[] {
  const problems: string[] = [];
  const s = secret();
  if (!s) problems.push("CHAT_SECRET is missing.");
  else if (s.length < 32) problems.push(`CHAT_SECRET is too short (${s.length} characters; it needs at least 32).`);

  const raw = process.env.CHAT_AGENTS?.trim() ?? "";
  if (!raw) problems.push("CHAT_AGENTS is missing.");
  else {
    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      problems.push(
        raw.startsWith("[")
          ? "CHAT_AGENTS is not valid JSON. Check that it was pasted whole, with straight quotes, and ends with }]."
          : "CHAT_AGENTS must start with [ and end with ] around the printed line, like [{...}].",
      );
    }
    if (parsed !== undefined) {
      if (!Array.isArray(parsed)) problems.push("CHAT_AGENTS must be a list: put [ before the printed line and ] after it.");
      else if (agents().length === 0) problems.push("CHAT_AGENTS has no complete entries (each needs id, name and hash).");
    }
  }
  return problems;
}

/** "scrypt:N:r:p:salt:hash", salt and hash in base64url. Colons, not dollar signs, which .env files would expand. */
export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const [N, r, p] = [16384, 8, 1];
  const key = await scryptAsync(password, salt, 32, { N, r, p });
  return ["scrypt", N, r, p, salt.toString("base64url"), key.toString("base64url")].join(":");
}

async function passwordMatches(password: string, stored: string): Promise<boolean> {
  const [kind, N, r, p, salt, hash] = stored.split(":");
  if (kind !== "scrypt" || !salt || !hash) return false;
  const expected = Buffer.from(hash, "base64url");
  const key = await scryptAsync(password, Buffer.from(salt, "base64url"), expected.length, { N: Number(N), r: Number(r), p: Number(p) });
  return timingSafeEqual(key, expected);
}

/** The agent for these credentials, or null. Takes the same time whether or not the name exists. */
export async function checkLogin(id: string, password: string): Promise<Agent | null> {
  const list = agents();
  const record = list.find((a) => a.id.toLowerCase() === id.trim().toLowerCase());
  // compare against a dummy hash for unknown names so timing doesn't reveal who has an account
  const ok = await passwordMatches(password, record?.hash ?? "scrypt:16384:8:1:AAAAAAAAAAAAAAAAAAAAAA:AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");
  return ok && record ? { id: record.id, name: record.name } : null;
}

/* ---------- inbox session cookie ---------- */

export const SESSION_COOKIE = "qadco_inbox";
const SESSION_HOURS = 12;

const sign = (data: string) => createHmac("sha256", secret()).update(data).digest("base64url");

export function createSession(agent: Agent): string {
  const data = Buffer.from(JSON.stringify({ a: agent.id, e: Date.now() + SESSION_HOURS * 3600_000 })).toString("base64url");
  return `${data}.${sign(data)}`;
}

export const sessionCookie = (value: string, maxAge = SESSION_HOURS * 3600) =>
  `${SESSION_COOKIE}=${value}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${maxAge}`;

/** The signed-in agent from a cookie value, or null if it is missing, forged, expired or the agent was removed. */
export function readSession(value: string | undefined): Agent | null {
  if (!value || !secret()) return null;
  const [data, signature] = value.split(".");
  if (!data || !signature) return null;
  const expected = Buffer.from(sign(data));
  const given = Buffer.from(signature);
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return null;
  try {
    const { a, e } = JSON.parse(Buffer.from(data, "base64url").toString());
    if (typeof e !== "number" || e < Date.now()) return null;
    const record = agents().find((x) => x.id === a);
    return record ? { id: record.id, name: record.name } : null;
  } catch {
    return null;
  }
}

/** The signed-in agent for an API request: the session cookie, plus a same-site check on changes. */
export function agentFor(request: Request): Agent | null {
  if (request.method !== "GET") {
    const origin = request.headers.get("origin");
    if (!origin || new URL(origin).host !== new URL(request.url).host) return null;
  }
  const cookie = request.headers.get("cookie") ?? "";
  const value = cookie
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${SESSION_COOKIE}=`))
    ?.slice(SESSION_COOKIE.length + 1);
  return readSession(value);
}

/* ---------- visitor tokens ---------- */

/** A new random token for a visitor's browser, and the hash kept in the database. */
export function newVisitorToken() {
  const token = randomBytes(32).toString("base64url");
  return { token, hash: hashToken(token) };
}

export const hashToken = (token: string) => createHash("sha256").update(token).digest("hex");

export function tokenMatches(token: string, storedHash: string) {
  const a = Buffer.from(hashToken(token));
  const b = Buffer.from(storedHash);
  return a.length === b.length && timingSafeEqual(a, b);
}
