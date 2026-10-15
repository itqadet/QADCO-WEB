"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import type { Dictionary } from "@/i18n/dictionaries/en";
import styles from "./ContactForm.module.css";

type Labels = Dictionary["contact"]["form"];
type FieldName = "name" | "company" | "phone" | "email" | "type" | "location" | "message";
type Errors = Partial<Record<FieldName, string>>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(data: FormData, t: Labels["errors"]): Errors {
  const get = (k: FieldName) => String(data.get(k) ?? "").trim();
  const errors: Errors = {};
  if (!get("name")) errors.name = t.required;
  if (!get("phone")) errors.phone = t.required;
  else if (get("phone").replace(/\D/g, "").length < 8) errors.phone = t.phone;
  if (get("email") && !EMAIL.test(get("email"))) errors.email = t.email;
  if (!get("type")) errors.type = t.required;
  return errors;
}

type ContactFormProps = {
  labels: Labels;
  recipient: string;
  phone: { display: string; href: string };
};

/**
 * Validates the request, then shows it written out with three ways to send it:
 * open it in the visitor's email app, copy it, or call. Nothing is lost if the
 * visitor has no email app set up (common on office PCs that use webmail).
 * There is no server endpoint yet; when one is chosen, replace `prepare` with a real send.
 */
export function ContactForm({ labels, recipient, phone }: ContactFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const readyRef = useRef<HTMLHeadingElement>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState("");
  const [draft, setDraft] = useState<{ text: string; mailto: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const order: FieldName[] = ["name", "company", "phone", "email", "type", "location", "message"];
  const fieldLabel: Record<FieldName, string> = {
    name: labels.name,
    company: labels.company,
    phone: labels.phone,
    email: labels.email,
    type: labels.type,
    location: labels.location,
    message: labels.message,
  };

  function prepare(data: FormData) {
    const lines = order
      .map((k) => [k, String(data.get(k) ?? "").trim()] as const)
      .filter(([, v]) => v)
      .map(([k, v]) => `${fieldLabel[k].replace(/\s*\(.*\)$/, "")}: ${v}`);
    const text = lines.join("\n");
    const mailto =
      `mailto:${recipient}?subject=${encodeURIComponent(labels.emailSubject)}` + `&body=${encodeURIComponent(text)}`;
    setDraft({ text, mailto });
    setCopied(false);
  }

  // Move focus to the result so keyboard and screen-reader users land on it.
  useEffect(() => {
    if (draft) readyRef.current?.focus();
  }, [draft]);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const next = validate(data, labels.errors);
    setErrors(next);

    const firstBad = order.find((k) => next[k]);
    if (firstBad) {
      setStatus(labels.errors.fix);
      formRef.current?.querySelector<HTMLElement>(`[name="${firstBad}"]`)?.focus();
      return;
    }
    setStatus("");
    prepare(data);
  }

  async function copy() {
    if (!draft) return;
    try {
      await navigator.clipboard.writeText(`${labels.emailSubject}\n\n${draft.text}`);
      setCopied(true);
    } catch {
      // Clipboard can be blocked; the text is selectable in the box as a fallback.
      setCopied(false);
    }
  }

  // Re-check a single field when the visitor leaves it, so fixes clear the error.
  function onBlur(e: React.FocusEvent<HTMLFormElement>) {
    const field = e.target as unknown as HTMLInputElement;
    const name = field.name as FieldName;
    if (!name || !field.value) return;
    const result = validate(new FormData(e.currentTarget), labels.errors);
    setErrors((prev) => ({ ...prev, [name]: result[name] }));
  }

  const describedBy = (name: FieldName, hint?: string) =>
    [hint, errors[name] ? `e-${name}` : null].filter(Boolean).join(" ") || undefined;

  const errorText = (name: FieldName) =>
    errors[name] ? (
      <span className={styles.error} id={`e-${name}`}>
        {errors[name]}
      </span>
    ) : null;

  const readyView = draft ? (
      <section className={styles.ready} aria-labelledby="ready-h">
        <h2 id="ready-h" ref={readyRef} tabIndex={-1} className={styles.readyTitle}>
          {labels.ready.title}
        </h2>
        <p>{labels.ready.body}</p>

        <div className={styles.readyActions}>
          <a className={styles.primaryAction} href={draft.mailto}>
            {labels.ready.openEmail}
          </a>
          <button type="button" className={styles.secondaryAction} onClick={copy}>
            {copied ? labels.ready.copied : labels.ready.copy}
          </button>
          <a className={styles.secondaryAction} href={phone.href} dir="ltr">
            {labels.ready.call} {phone.display}
          </a>
        </div>

        <p className={styles.sendTo}>
          {labels.ready.sendTo}{" "}
          <a href={`mailto:${recipient}`} dir="ltr">
            {recipient}
          </a>
        </p>

        <label className={styles.draftLabel} htmlFor="f-draft">
          {labels.ready.yourRequest}
        </label>
        <textarea
          id="f-draft"
          className={styles.draft}
          readOnly
          value={`${labels.emailSubject}\n\n${draft.text}`}
          rows={Math.min(10, draft.text.split("\n").length + 3)}
          onFocus={(e) => e.currentTarget.select()}
        />

        <p role="status" className="visually-hidden">
          {copied ? labels.ready.copied : ""}
        </p>

        <button type="button" className={styles.editLink} onClick={() => setDraft(null)}>
          {labels.ready.edit}
        </button>
      </section>
  ) : null;

  return (
    <>
    {readyView}
    {/* Kept mounted (just hidden) so "Change details" brings back what the visitor typed. */}
    <form ref={formRef} className={styles.form} noValidate onSubmit={onSubmit} onBlur={onBlur} hidden={!!draft}>
      <div className={styles.field}>
        <label htmlFor="f-name">{labels.name}</label>
        <input id="f-name" name="name" type="text" autoComplete="name" required
          aria-invalid={!!errors.name} aria-describedby={describedBy("name")} />
        {errorText("name")}
      </div>

      <div className={styles.field}>
        <label htmlFor="f-company">{labels.company}</label>
        <input id="f-company" name="company" type="text" autoComplete="organization" />
      </div>

      <div className={styles.field}>
        <label htmlFor="f-phone">{labels.phone}</label>
        <input id="f-phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" dir="ltr" required
          aria-invalid={!!errors.phone} aria-describedby={describedBy("phone")} />
        {errorText("phone")}
      </div>

      <div className={styles.field}>
        <label htmlFor="f-email">{labels.email}</label>
        <input id="f-email" name="email" type="email" autoComplete="email" dir="ltr"
          aria-invalid={!!errors.email} aria-describedby={describedBy("email")} />
        {errorText("email")}
      </div>

      <div className={styles.field}>
        <label htmlFor="f-type">{labels.type}</label>
        <select id="f-type" name="type" required defaultValue=""
          aria-invalid={!!errors.type} aria-describedby={describedBy("type")}>
          <option value="">{labels.typePlaceholder}</option>
          {labels.types.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        {errorText("type")}
      </div>

      <div className={styles.field}>
        <label htmlFor="f-location">{labels.location}</label>
        <input id="f-location" name="location" type="text" placeholder={labels.locationPlaceholder} />
      </div>

      <div className={`${styles.field} ${styles.full}`}>
        <label htmlFor="f-message">{labels.message}</label>
        <span className={styles.hint} id="h-message">{labels.messageHint}</span>
        <textarea id="f-message" name="message" aria-describedby="h-message" />
      </div>

      {/* One persistent live region, so screen readers announce every status change. */}
      <p className={status ? styles.status : "visually-hidden"} role="status">
        {status}
      </p>

      <div className={styles.full}>
        <Button type="submit">{labels.submit}</Button>
      </div>
    </form>
    </>
  );
}
