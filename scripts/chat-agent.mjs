/**
 * Adds a team member to the chat inbox.
 *
 *   npm run chat:agent
 *
 * Asks for a display name, a username and a password, and prints the entry to put in the
 * CHAT_AGENTS environment variable on Vercel (a JSON list; add a comma between entries). The
 * password itself is never stored, only a scrypt hash. Also prints a fresh CHAT_SECRET for the
 * first-time setup.
 */
import { randomBytes, scrypt } from "node:crypto";
import { createInterface } from "node:readline";
import { promisify } from "node:util";

const scryptAsync = promisify(scrypt);
const ENTER = new Set(["\r", "\n"]);
const CTRL_C = "\u0003";
const BACKSPACE = new Set(["\u007f", "\b"]);

// Piped input (scripts, tests): all answers arrive at once, one per line.
const piped = process.stdin.isTTY
  ? null
  : await new Promise((resolve) => {
      let all = "";
      process.stdin.setEncoding("utf8");
      process.stdin.on("data", (c) => (all += c));
      process.stdin.on("end", () => resolve(all.split(/\r?\n/)));
    });

// One reader for the typed questions: a new reader per question can drop what was typed between them.
const rl = process.stdin.isTTY ? createInterface({ input: process.stdin, output: process.stdout }) : null;
const ask = (question) =>
  piped ? Promise.resolve((piped.shift() ?? "").trim()) : new Promise((resolve) => rl.question(question, (a) => resolve(a.trim())));

/** Reads a password key by key, showing * for each character, so it never appears on screen. */
function askPassword(question) {
  if (piped) return Promise.resolve(piped.shift() ?? "");
  rl.close();
  return new Promise((resolve) => {
    process.stdout.write(question);
    const stdin = process.stdin;
    let value = "";
    stdin.setRawMode(true);
    stdin.setEncoding("utf8");
    stdin.resume();
    const onData = (chunk) => {
      for (const ch of chunk) {
        if (ENTER.has(ch)) {
          stdin.setRawMode(false);
          stdin.pause();
          stdin.off("data", onData);
          process.stdout.write("\n");
          return resolve(value);
        }
        if (ch === CTRL_C) {
          process.stdout.write("\n");
          process.exit(1);
        }
        if (BACKSPACE.has(ch)) {
          if (value) {
            value = value.slice(0, -1);
            process.stdout.write("\b \b");
          }
        } else if (ch >= " ") {
          value += ch;
          process.stdout.write("*");
        }
      }
    };
    stdin.on("data", onData);
  });
}

const name = await ask("Name shown to visitors (e.g. Ahmed): ");
const suggested = name.toLowerCase().replace(/\s+/g, "");
const id = (await ask(`Username for signing in [${suggested}]: `)) || suggested;
const password = await askPassword("Password (at least 10 characters): ");
if (!name || !id || password.length < 10) {
  console.error("\nName, username and a password of at least 10 characters are needed.");
  process.exit(1);
}

// same format as hashPassword() in src/lib/chat/auth.ts
const salt = randomBytes(16);
const [N, r, p] = [16384, 8, 1];
const key = await scryptAsync(password, salt, 32, { N, r, p });
const hash = ["scrypt", N, r, p, salt.toString("base64url"), key.toString("base64url")].join(":");

console.log("\nAdd this entry to CHAT_AGENTS on Vercel:\n");
console.log(JSON.stringify({ id, name, hash }));
console.log("\nThe whole value is a list, e.g. [ {first entry}, {second entry} ].");
console.log("\nIf CHAT_SECRET isn't set yet, use this value for it (keep it private):\n");
console.log(randomBytes(32).toString("base64url"));
process.exit(0);
