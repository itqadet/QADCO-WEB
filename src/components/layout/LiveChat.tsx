"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Dictionary } from "@/i18n/dictionaries/en";
import styles from "./ChatHelp.module.css";

type Message = { id: number; sender: "visitor" | "agent"; agentName: string; body: string; at: string };
type Saved = { id: string; token: string; seen: number };

const STORE = "qadco-chat";
/** How often to check for replies: while the chat is on screen, and in the background. */
const ACTIVE_EVERY = 3000;
const IDLE_EVERY = 20000;

function load(): Saved | null {
  try {
    const v = JSON.parse(localStorage.getItem(STORE) ?? "null");
    return v && typeof v.id === "string" && typeof v.token === "string" ? { seen: 0, ...v } : null;
  } catch {
    return null;
  }
}
function save(v: Saved | null) {
  try {
    if (v) localStorage.setItem(STORE, JSON.stringify(v));
    else localStorage.removeItem(STORE);
  } catch {
    /* private browsing: the chat still works until the page closes */
  }
}

/** Whether this browser already has a chat going, so the panel can open straight into it. */
export const hasSavedChat = () => load() !== null;

type LiveChatProps = {
  /** Base address of the chat API: /api/chat on Vercel, the Vercel address on the Bluehost copy. */
  api: string;
  /** Whether the chat is on screen (panel open, this view showing). */
  active: boolean;
  officeOpen: boolean;
  locale: string;
  t: Dictionary["chat"];
  onUnread: (count: number) => void;
  onBack: () => void;
};

/** The live chat inside the help panel: a short form to start, then the conversation. */
export function LiveChat({ api, active, officeOpen, locale, t, onUnread, onBack }: LiveChatProps) {
  const [saved, setSaved] = useState<Saved | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const lastId = useRef(0);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => setSaved(load()), []);

  const post = useCallback(
    async (path: string, body: object) => {
      const res = await fetch(`${api}/${path}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      return { status: res.status, data: await res.json().catch(() => ({})) };
    },
    [api],
  );

  /* ---------- new messages ---------- */
  const poll = useCallback(async () => {
    if (!saved) return;
    try {
      const { status, data } = await post("poll", { id: saved.id, token: saved.token, after: lastId.current });
      if (status === 404) {
        // the conversation no longer exists for this browser: start over
        save(null);
        setSaved(null);
        setMessages([]);
        return;
      }
      if (data.messages?.length) {
        lastId.current = data.messages.at(-1).id;
        setMessages((m) => [...m, ...data.messages.filter((x: Message) => !m.some((y) => y.id === x.id))]);
      }
    } catch {
      /* offline for a moment; the next check catches up */
    }
  }, [saved, post]);

  useEffect(() => {
    if (!saved) return;
    void poll();
    const every = active ? ACTIVE_EVERY : IDLE_EVERY;
    const id = window.setInterval(() => {
      if (!document.hidden) void poll();
    }, every);
    // checks pause while the tab is in the background; catch up as soon as it is back
    const onVisible = () => {
      if (!document.hidden) void poll();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      window.clearInterval(id);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [saved, active, poll]);

  // replies the visitor hasn't seen yet light up the help button
  useEffect(() => {
    if (!saved) return onUnread(0);
    const lastTeam = messages.filter((m) => m.sender === "agent").at(-1)?.id ?? 0;
    if (active && lastTeam > saved.seen) {
      const next = { ...saved, seen: lastTeam };
      save(next);
      setSaved(next);
      return onUnread(0);
    }
    onUnread(active ? 0 : messages.filter((m) => m.sender === "agent" && m.id > saved.seen).length);
  }, [messages, active, saved, onUnread]);

  useEffect(() => {
    if (active) endRef.current?.scrollIntoView({ block: "end" });
  }, [messages.length, active]);

  /* ---------- starting and sending ---------- */
  async function start(form: HTMLFormElement) {
    const data = new FormData(form);
    const message = String(data.get("message") ?? "").trim();
    if (!message) return;
    setBusy(true);
    setError("");
    try {
      const { status, data: res } = await post("start", {
        name: data.get("name"),
        contact: data.get("contact"),
        message,
        website: data.get("website"),
        page: window.location.href,
        lang: locale,
      });
      if (status !== 200 || !res.ok) throw new Error(String(status));
      const next = { id: res.id, token: res.token, seen: 0 };
      save(next);
      lastId.current = 0;
      setSaved(next);
    } catch (e) {
      setError(String((e as Error).message) === "503" ? t.unavailable : t.failed);
    } finally {
      setBusy(false);
    }
  }

  async function send() {
    const text = draft.trim();
    if (!text || !saved) return;
    setBusy(true);
    setError("");
    try {
      const { status } = await post("send", { id: saved.id, token: saved.token, message: text });
      if (status !== 200) throw new Error(String(status));
      setDraft("");
      await poll();
      inputRef.current?.focus();
    } catch {
      setError(t.failed);
    } finally {
      setBusy(false);
    }
  }

  function startOver() {
    save(null);
    setSaved(null);
    setMessages([]);
    lastId.current = 0;
  }

  const timeFmt = new Intl.DateTimeFormat(locale, { hour: "2-digit", minute: "2-digit" });
  const answered = messages.some((m) => m.sender === "agent");

  return (
    <div className={styles.liveView}>
      <button type="button" className={styles.backLink} onClick={onBack}>
        {t.back}
      </button>

      {!saved ? (
        <form
          className={styles.compose}
          onSubmit={(e) => {
            e.preventDefault();
            void start(e.currentTarget);
          }}
        >
          <p className={styles.bubble}>{t.liveIntro}</p>
          <label className={styles.label}>
            {t.nameLabel}
            <input className={styles.input} name="name" autoComplete="name" maxLength={80} />
          </label>
          <label className={styles.label}>
            {t.contactLabel}
            <input className={styles.input} name="contact" autoComplete="tel" maxLength={120} required={!officeOpen} dir="ltr" />
            <span className={styles.hint}>{officeOpen ? t.contactHint : t.contactHintClosed}</span>
          </label>
          <label className={styles.label}>
            {t.firstMessageLabel}
            <textarea className={styles.text} name="message" rows={3} maxLength={2000} required />
          </label>
          {/* hidden from people; bots fill it in */}
          <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className={styles.trap} />
          {error ? (
            <p className={styles.error} role="alert">
              {error}
            </p>
          ) : null}
          <button type="submit" className={styles.liveSend} disabled={busy}>
            {busy ? t.starting : t.start}
          </button>
          <p className={styles.note}>{t.privacy}</p>
        </form>
      ) : (
        <>
          <div className={styles.thread} aria-live="polite">
            {messages.map((m) => (
              <div key={m.id} className={styles.msg} data-from={m.sender}>
                <p dir="auto">{m.body}</p>
                <span className={styles.msgMeta}>
                  {m.sender === "agent" ? `${m.agentName || t.team} · ` : ""}
                  {timeFmt.format(new Date(m.at))}
                </span>
              </div>
            ))}
            {!answered && messages.length > 0 ? <p className={styles.waiting}>{officeOpen ? t.waiting : t.waitingClosed}</p> : null}
            <div ref={endRef} />
          </div>
          {error ? (
            <p className={styles.error} role="alert">
              {error}
            </p>
          ) : null}
          <form
            className={styles.reply}
            onSubmit={(e) => {
              e.preventDefault();
              void send();
            }}
          >
            <textarea
              ref={inputRef}
              className={styles.text}
              rows={2}
              dir="auto"
              value={draft}
              maxLength={2000}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  void send();
                }
              }}
              placeholder={t.inputPlaceholder}
              aria-label={t.inputLabel}
            />
            <button type="submit" className={styles.liveSend} disabled={busy || !draft.trim()}>
              {t.sendShort}
            </button>
          </form>
          <button type="button" className={styles.backLink} onClick={startOver}>
            {t.newChat}
          </button>
        </>
      )}
    </div>
  );
}
