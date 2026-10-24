"use client";

import { useState } from "react";
import styles from "./Inbox.module.css";

/** Sign-in for team members. */
export function Login({ configured }: { configured: boolean }) {
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  if (!configured) {
    return (
      <main className={styles.loginWrap}>
        <div className={styles.loginCard}>
          <h1 className={styles.loginTitle}>Chat inbox</h1>
          <p className={styles.muted}>The inbox isn&apos;t set up yet: CHAT_SECRET and CHAT_AGENTS are missing in Vercel.</p>
        </div>
      </main>
    );
  }

  async function submit(form: HTMLFormElement) {
    setBusy(true);
    setError("");
    const data = new FormData(form);
    try {
      const res = await fetch("/api/inbox/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: data.get("id"), password: data.get("password") }),
      });
      if (res.ok) return window.location.reload();
      setError(res.status === 429 ? "Too many tries. Wait 15 minutes and try again." : "That name and password don't match.");
    } catch {
      setError("No connection. Check the internet and try again.");
    }
    setBusy(false);
  }

  return (
    <main className={styles.loginWrap}>
      <form
        className={styles.loginCard}
        onSubmit={(e) => {
          e.preventDefault();
          void submit(e.currentTarget);
        }}
      >
        <h1 className={styles.loginTitle}>Chat inbox</h1>
        <p className={styles.muted}>Sign in to answer visitors from the QADCO website.</p>
        <label className={styles.field}>
          <span>Username</span>
          <input name="id" autoComplete="username" autoCapitalize="none" required />
        </label>
        <label className={styles.field}>
          <span>Password</span>
          <input name="password" type="password" autoComplete="current-password" required />
        </label>
        {error ? (
          <p className={styles.error} role="alert">
            {error}
          </p>
        ) : null}
        <button className={styles.primary} disabled={busy}>
          {busy ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </main>
  );
}
