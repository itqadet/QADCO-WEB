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

function ask(question, hidden = false) {
  return new Promise((resolve) => {
    const rl = createInterface({ input: process.stdin, output: process.stdout, terminal: true });
    if (hidden) {
      // don't echo the password as it is typed
      rl._writeToOutput = (s) => rl.output.write(s.startsWith(question) ? s : "");
    }
    rl.question(question, (answer) => {
      rl.close();
      if (hidden) process.stdout.write("\n");
      resolve(answer.trim());
    });
  });
}

const name = await ask("Name shown to visitors (e.g. Ahmed): ");
const id = (await ask(`Username for signing in [${name.toLowerCase().replace(/\s+/g, "")}]: `)) || name.toLowerCase().replace(/\s+/g, "");
const password = await ask("Password (at least 10 characters): ", true);
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
