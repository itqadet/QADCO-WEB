"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { Dictionary } from "@/i18n/dictionaries/en";
import styles from "./ChatHelp.module.css";

type ChatHelpProps = {
  /** WhatsApp number in international form, digits only (wa.me format). */
  number: string;
  /** Crisp website ID: when set, visitors can also chat inside the site and the team answers in Crisp. */
  crispId?: string;
  hours: { days: readonly number[]; open: number; close: number };
  locale: string;
  t: Dictionary["chat"];
};

type Status = { open: true } | { open: false; when: string };

/** Open now, or when we next open, from the current time in Doha (UTC+3 all year). */
function officeStatus(hours: ChatHelpProps["hours"], t: ChatHelpProps["t"], locale: string): Status {
  const doha = new Date(Date.now() + 3 * 3600_000);
  const day = doha.getUTCDay();
  const h = doha.getUTCHours() + doha.getUTCMinutes() / 60;
  if (hours.days.includes(day) && h >= hours.open && h < hours.close) return { open: true };

  const time = `${hours.open}:00`;
  if (hours.days.includes(day) && h < hours.open) return { open: false, when: t.opensToday.replace("{time}", time) };
  for (let ahead = 1; ahead <= 7; ahead++) {
    const next = new Date(doha.getTime() + ahead * 86400_000);
    if (!hours.days.includes(next.getUTCDay())) continue;
    if (ahead === 1) return { open: false, when: t.opensTomorrow.replace("{time}", time) };
    const name = new Intl.DateTimeFormat(locale, { weekday: "long", timeZone: "UTC" }).format(next);
    return { open: false, when: t.opensOn.replace("{time}", time).replace("{day}", name) };
  }
  return { open: false, when: "" };
}

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.glyph}>
    <path
      fill="currentColor"
      d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3Z"
    />
  </svg>
);

type CrispQueue = unknown[][] & { is?: (what: string) => boolean };
declare global {
  interface Window {
    $crisp?: CrispQueue;
    CRISP_WEBSITE_ID?: string;
    CRISP_RUNTIME_CONFIG?: { locale: string };
  }
}

/**
 * Loads Crisp's chat the first time it is needed, so its script and cookies only arrive for
 * visitors who choose to chat. Its own round launcher stays hidden; this component's button is
 * the way in, and it steps aside while the chat window is open.
 */
function openCrisp(id: string, locale: string, onToggle: (open: boolean) => void) {
  if (!window.$crisp) {
    window.$crisp = [] as CrispQueue;
    window.CRISP_WEBSITE_ID = id;
    window.CRISP_RUNTIME_CONFIG = { locale };
    window.$crisp.push(["safe", true]);
    window.$crisp.push(["do", "chat:hide"]);
    window.$crisp.push(["on", "chat:opened", () => onToggle(true)]);
    window.$crisp.push(["on", "chat:closed", () => {
      window.$crisp?.push(["do", "chat:hide"]);
      onToggle(false);
    }]);
    const script = document.createElement("script");
    script.src = "https://client.crisp.chat/l.js";
    script.async = true;
    document.head.appendChild(script);
  }
  // the team sees which page the visitor was on
  window.$crisp.push(["set", "session:data", [[["page", window.location.href]]]]);
  window.$crisp.push(["do", "chat:show"]);
  window.$crisp.push(["do", "chat:open"]);
}

/**
 * Help button in the corner of every page. Opens a small panel with today's office status, a chat
 * inside the site (when Crisp is set up), and a few common questions that continue in WhatsApp
 * with a message the visitor can edit.
 */
export function ChatHelp({ number, crispId, hours, locale, t }: ChatHelpProps) {
  const [open, setOpen] = useState(false);
  const [crispOpen, setCrispOpen] = useState(false);
  const [status, setStatus] = useState<Status | null>(null);
  const [topic, setTopic] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const panelId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const check = () => setStatus(officeStatus(hours, t, locale));
    check();
    const id = window.setInterval(check, 60_000);
    return () => window.clearInterval(id);
  }, [hours, t, locale]);

  // Esc closes the panel and returns focus to the button; so does a click outside it.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    const onPointer = (e: PointerEvent) => {
      const target = e.target as Node;
      if (!panelRef.current?.contains(target) && !buttonRef.current?.contains(target)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    panelRef.current?.querySelector<HTMLElement>("button, textarea")?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [open]);

  const choose = (i: number) => {
    setTopic(i);
    setMessage(t.topics[i].message);
  };

  // After a topic is picked, put the cursor at the end of its message so the visitor can type on.
  useEffect(() => {
    const el = textRef.current;
    if (topic === null || !el) return;
    el.focus();
    el.setSelectionRange(el.value.length, el.value.length);
  }, [topic]);

  const send = () => {
    const text = `${message.trim()}\n\n${t.sentFrom}: ${window.location.href}`;
    window.open(`https://wa.me/${number}?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
  };

  return (
    <div className={styles.dock} hidden={crispOpen}>
      <div
        ref={panelRef}
        id={panelId}
        role="dialog"
        aria-label={crispId ? t.titleLive : t.title}
        className={styles.panel}
        data-open={open || undefined}
        hidden={!open}
      >
        <header className={styles.head}>
          <span className={styles.avatar} aria-hidden="true">
            <WhatsAppIcon />
          </span>
          <span className={styles.headText}>
            <strong>{crispId ? t.titleLive : t.title}</strong>
            {status ? (
              <span className={styles.status} data-open={status.open || undefined}>
                <span className={styles.dot} aria-hidden="true" />
                {status.open ? t.online : `${t.closed} ${status.when}`}
              </span>
            ) : null}
          </span>
          <button type="button" className={styles.close} onClick={() => setOpen(false)} aria-label={t.close}>
            <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M6 6l12 12M18 6 6 18" />
            </svg>
          </button>
        </header>

        <div className={styles.body}>
          <p className={styles.bubble}>{crispId ? t.greetingLive : t.greeting}</p>

          {crispId ? (
            <>
              <button
                type="button"
                className={styles.live}
                onClick={() => {
                  setOpen(false);
                  openCrisp(crispId, locale, setCrispOpen);
                }}
              >
                <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round">
                  <path d="M4 5h16v11H9l-5 4V5Z" />
                </svg>
                {t.chatHere}
              </button>
              <p className={styles.or}>{t.orWhatsApp}</p>
            </>
          ) : null}

          <fieldset className={styles.topics}>
            <legend className="visually-hidden">{t.topicsLabel}</legend>
            {t.topics.map((tp, i) => (
              <button key={tp.label} type="button" className={styles.topic} aria-pressed={topic === i} onClick={() => choose(i)}>
                {tp.label}
              </button>
            ))}
          </fieldset>

          {topic !== null ? (
            <form
              className={styles.compose}
              onSubmit={(e) => {
                e.preventDefault();
                if (message.trim()) send();
              }}
            >
              <label htmlFor={`${panelId}-msg`} className={styles.label}>
                {t.messageLabel}
              </label>
              <textarea
                ref={textRef}
                id={`${panelId}-msg`}
                className={styles.text}
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <button type="submit" className={styles.send} disabled={!message.trim()}>
                <WhatsAppIcon />
                {t.send}
              </button>
              <p className={styles.note}>{t.note}</p>
            </form>
          ) : null}
        </div>
      </div>

      <button
        ref={buttonRef}
        type="button"
        className={styles.fab}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((o) => !o)}
      >
        <WhatsAppIcon />
        <span className={styles.fabLabel}>{t.button}</span>
        {status?.open ? <span className={styles.fabDot} aria-hidden="true" /> : null}
      </button>
    </div>
  );
}
