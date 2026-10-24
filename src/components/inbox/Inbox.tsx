"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./Inbox.module.css";

type Summary = {
  id: string;
  name: string;
  contact: string;
  page: string;
  lang: string;
  lastAt: string;
  unread: number;
  preview: string;
  previewFromTeam: boolean;
};
type Message = { id: number; sender: "visitor" | "agent"; agentName: string; body: string; at: string };
type Detail = { id: string; name: string; contact: string; page: string; lang: string; status: string; createdAt: string };

const LIST_EVERY = 4000;
const THREAD_EVERY = 2500;

const timeFmt = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Qatar" });
const dayFmt = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", timeZone: "Asia/Qatar" });
function when(iso: string) {
  const d = new Date(iso);
  return Date.now() - d.getTime() < 20 * 3600_000 ? timeFmt.format(d) : dayFmt.format(d);
}

/** A WhatsApp link for a contact that looks like a phone number (Qatar numbers may omit +974). */
function whatsapp(contact: string) {
  if (contact.includes("@")) return null;
  let digits = contact.replace(/\D/g, "").replace(/^00/, "");
  if (digits.length === 8) digits = `974${digits}`;
  return digits.length >= 10 ? `https://wa.me/${digits}` : null;
}

/** Short two-note chime for a new visitor message, made on the fly (no sound file). */
function chime() {
  try {
    const ctx = new AudioContext();
    [880, 1320].forEach((f, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.value = f;
      gain.gain.setValueAtTime(0.0001, ctx.currentTime + i * 0.16);
      gain.gain.exponentialRampToValueAtTime(0.25, ctx.currentTime + i * 0.16 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + i * 0.16 + 0.3);
      osc.connect(gain).connect(ctx.destination);
      osc.start(ctx.currentTime + i * 0.16);
      osc.stop(ctx.currentTime + i * 0.16 + 0.32);
    });
  } catch {
    /* sound is a nicety */
  }
}

/** The team's chat inbox: conversations on one side, the selected chat on the other (one at a time on phones). */
export function Inbox({ agentName, initialId }: { agentName: string; initialId: string | null }) {
  const [tab, setTab] = useState<"open" | "closed">("open");
  const [list, setList] = useState<Summary[]>([]);
  const [selected, setSelected] = useState<string | null>(initialId);
  const [detail, setDetail] = useState<Detail | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);
  const [offline, setOffline] = useState(false);
  const [alerts, setAlerts] = useState<NotificationPermission | "unsupported">("default");
  const lastSeen = useRef<Map<string, string>>(new Map());
  const firstLoad = useRef(true);
  const threadEnd = useRef<HTMLDivElement>(null);
  const lastId = useRef(0);

  useEffect(() => {
    setAlerts("Notification" in window ? Notification.permission : "unsupported");
  }, []);

  const signedOut = () => window.location.reload();

  /* ---------- the list, with alerts for new visitor messages ---------- */
  const loadList = useCallback(async () => {
    try {
      const res = await fetch(`/api/inbox/conversations?status=${tab}`, { cache: "no-store" });
      if (res.status === 401) return signedOut();
      const data = await res.json();
      setOffline(false);
      const items: Summary[] = data.conversations ?? [];
      setList(items);

      if (tab === "open") {
        const fresh = items.filter((c) => c.unread > 0 && !c.previewFromTeam && lastSeen.current.get(c.id) !== c.lastAt);
        items.forEach((c) => lastSeen.current.set(c.id, c.lastAt));
        // alert on news, but not for what was already waiting when the inbox opened
        if (!firstLoad.current && fresh.some((c) => document.hidden || c.id !== selected)) {
          chime();
          if ("Notification" in window && Notification.permission === "granted") {
            const c = fresh[0];
            new Notification(`New message from ${c.name || "a visitor"}`, { body: c.preview, tag: c.id, icon: "/images/brand/inbox-icon-512.png" });
          }
        }
        firstLoad.current = false;
        const unread = items.reduce((n, c) => n + c.unread, 0);
        document.title = unread ? `(${unread}) QADCO chat inbox` : "QADCO chat inbox";
      }
    } catch {
      setOffline(true);
    }
  }, [tab, selected]);

  useEffect(() => {
    void loadList();
    const id = window.setInterval(loadList, LIST_EVERY);
    return () => window.clearInterval(id);
  }, [loadList]);

  /* ---------- the selected conversation ---------- */
  const loadThread = useCallback(async () => {
    if (!selected) return;
    try {
      const res = await fetch(`/api/inbox/messages?c=${selected}&after=${lastId.current}`, { cache: "no-store" });
      if (res.status === 401) return signedOut();
      if (!res.ok) return;
      const data = await res.json();
      setDetail(data.conversation);
      if (data.messages.length) {
        lastId.current = data.messages.at(-1).id;
        setMessages((m) => [...m, ...data.messages.filter((x: Message) => !m.some((y) => y.id === x.id))]);
      }
    } catch {
      setOffline(true);
    }
  }, [selected]);

  useEffect(() => {
    lastId.current = 0;
    setMessages([]);
    setDetail(null);
    setReply("");
    if (!selected) return;
    void loadThread();
    const id = window.setInterval(loadThread, THREAD_EVERY);
    const url = new URL(window.location.href);
    url.searchParams.set("c", selected);
    window.history.replaceState(null, "", url);
    return () => window.clearInterval(id);
  }, [selected, loadThread]);

  useEffect(() => {
    threadEnd.current?.scrollIntoView({ block: "end" });
  }, [messages.length]);

  async function send() {
    const text = reply.trim();
    if (!text || !selected) return;
    setSending(true);
    try {
      const res = await fetch("/api/inbox/reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ c: selected, message: text }),
      });
      if (res.status === 401) return signedOut();
      if (res.ok) {
        setReply("");
        await loadThread();
        void loadList();
      }
    } finally {
      setSending(false);
    }
  }

  async function setStatus(status: "open" | "closed") {
    if (!selected) return;
    await fetch("/api/inbox/status", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ c: selected, status }) });
    setDetail((d) => (d ? { ...d, status } : d));
    void loadList();
  }

  async function signOut() {
    await fetch("/api/inbox/logout", { method: "POST" });
    signedOut();
  }

  const wa = detail ? whatsapp(detail.contact) : null;

  return (
    <div className={styles.app} data-thread={selected ? "" : undefined}>
      <header className={styles.bar}>
        <strong className={styles.brand}>QADCO chat inbox</strong>
        {offline ? <span className={styles.offline}>Reconnecting…</span> : null}
        <span className={styles.spacer} />
        {alerts === "default" ? (
          <button type="button" className={styles.ghost} onClick={() => Notification.requestPermission().then(setAlerts)}>
            Turn on alerts
          </button>
        ) : null}
        <span className={styles.me}>{agentName}</span>
        <button type="button" className={styles.ghost} onClick={signOut}>
          Sign out
        </button>
      </header>

      <aside className={styles.list} aria-label="Conversations">
        <div className={styles.tabs} role="tablist">
          {(["open", "closed"] as const).map((t) => (
            <button key={t} type="button" role="tab" aria-selected={tab === t} className={styles.tab} onClick={() => setTab(t)}>
              {t === "open" ? "Open" : "Closed"}
            </button>
          ))}
        </div>
        {list.length === 0 ? (
          <p className={styles.empty}>{tab === "open" ? "No open chats. New ones appear here with a sound." : "No closed chats."}</p>
        ) : (
          <ul className={styles.items}>
            {list.map((c) => (
              <li key={c.id}>
                <button type="button" className={styles.item} aria-current={c.id === selected} onClick={() => setSelected(c.id)}>
                  <span className={styles.itemTop}>
                    <span className={styles.itemName}>{c.name || "Visitor"}</span>
                    <span className={styles.itemTime}>{when(c.lastAt)}</span>
                  </span>
                  <span className={styles.itemPreview}>
                    {c.previewFromTeam ? "You: " : ""}
                    {c.preview}
                  </span>
                  {c.unread > 0 ? <span className={styles.badge}>{c.unread}</span> : null}
                </button>
              </li>
            ))}
          </ul>
        )}
      </aside>

      <section className={styles.thread} aria-label="Conversation">
        {!selected ? (
          <p className={styles.empty}>Choose a conversation.</p>
        ) : (
          <>
            <div className={styles.threadHead}>
              <button type="button" className={styles.back} onClick={() => setSelected(null)} aria-label="Back to the list">
                ‹
              </button>
              <div className={styles.who}>
                <strong>{detail?.name || "Visitor"}</strong>
                <span className={styles.muted}>
                  {detail?.contact || "No contact given"}
                  {/* the page address comes from the visitor's browser: only ever link a web address */}
                  {detail?.page && /^https?:\/\//i.test(detail.page) ? (
                    <>
                      {" "}
                      ·{" "}
                      <a href={detail.page} target="_blank" rel="noreferrer">
                        page
                      </a>
                    </>
                  ) : null}
                  {detail?.lang === "ar" ? " · Arabic" : ""}
                </span>
              </div>
              <div className={styles.actions}>
                {detail?.contact && !detail.contact.includes("@") ? (
                  <a className={styles.ghost} href={`tel:${detail.contact.replace(/[^\d+]/g, "")}`}>
                    Call
                  </a>
                ) : null}
                {wa ? (
                  <a className={styles.ghost} href={wa} target="_blank" rel="noreferrer">
                    WhatsApp
                  </a>
                ) : null}
                {detail?.contact.includes("@") ? (
                  <a className={styles.ghost} href={`mailto:${detail.contact}`}>
                    Email
                  </a>
                ) : null}
                {detail ? (
                  <button type="button" className={styles.ghost} onClick={() => setStatus(detail.status === "open" ? "closed" : "open")}>
                    {detail.status === "open" ? "Close chat" : "Reopen"}
                  </button>
                ) : null}
              </div>
            </div>

            <div className={styles.messages}>
              {messages.map((m) => (
                <div key={m.id} className={styles.msg} data-from={m.sender}>
                  <p dir="auto">{m.body}</p>
                  <span className={styles.meta}>
                    {m.sender === "agent" ? `${m.agentName} · ` : ""}
                    {when(m.at)}
                  </span>
                </div>
              ))}
              <div ref={threadEnd} />
            </div>

            <form
              className={styles.compose}
              onSubmit={(e) => {
                e.preventDefault();
                void send();
              }}
            >
              <textarea
                dir="auto"
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    void send();
                  }
                }}
                placeholder={`Reply as ${agentName}…`}
                title="Enter sends; Shift+Enter starts a new line"
                rows={2}
                aria-label="Reply"
              />
              <button className={styles.primary} disabled={sending || !reply.trim()}>
                Send
              </button>
            </form>
          </>
        )}
      </section>
    </div>
  );
}
