# QADCO live chat

Visitors chat inside the website (the green help button → "Chat with us here"). The team answers
in a private inbox at **https://qadco-web.vercel.app/inbox**, on a phone or a computer. Chats are
stored in our own Postgres database on Vercel and kept until deleted.

Until the steps below are done, the help button stays WhatsApp-only; nothing breaks.

## 1. Create the database (once)

Vercel → project **qadco-web** → **Storage** → **Create Database** → **Neon** (free plan) →
connect it to the project. Vercel adds `DATABASE_URL` by itself. The chat tables are created on
first use.

## 2. Add the team (once per person)

On the computer with the project, run:

```
npm run chat:agent
```

It asks for the name visitors will see (e.g. Ahmed), a username and a password, and prints:

- a line for `CHAT_AGENTS`, e.g. `{"id":"ahmed","name":"Ahmed","hash":"scrypt:..."}`
- a value for `CHAT_SECRET` (only needed the first time)

In Vercel → **Settings → Environment Variables** add:

| Name | Value |
|---|---|
| `CHAT_SECRET` | the value printed the first time; keep it private |
| `CHAT_AGENTS` | a list of the printed lines: `[{...}]`, or `[{...},{...}]` for two people |

Then **Deployments → ⋯ → Redeploy**. To add someone later, run the command again, add their line
to the list, and redeploy. To remove someone, delete their line and redeploy.

Passwords are never stored, only a scrambled fingerprint (scrypt). Sessions last 12 hours.

## 3. Answer chats

- Open **https://qadco-web.vercel.app/inbox** and sign in.
- Press **Turn on alerts** once per device: new messages then make a sound and show a notification
  while the inbox is open.
- On a phone, use the browser's **Add to Home Screen** to open the inbox like an app.
- Every new chat is also emailed to the contact address (through Resend, like the contact form),
  with a button to the conversation and a WhatsApp button when the visitor left a phone number.
- **Close chat** moves a finished conversation to **Closed**; if the visitor writes again it
  reopens. Nothing is deleted.
