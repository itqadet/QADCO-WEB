"use client";

import { useRef, useState } from "react";
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

/**
 * Validates the request, then opens the visitor's email app with it filled in.
 * There is no server endpoint yet; swap `handOff` for a Server Action or form
 * service when one is chosen.
 */
export function ContactForm({ labels, recipient }: { labels: Labels; recipient: string }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState("");

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

  function handOff(data: FormData) {
    const lines = order
      .map((k) => [k, String(data.get(k) ?? "").trim()] as const)
      .filter(([, v]) => v)
      .map(([k, v]) => `${fieldLabel[k]}: ${v}`);
    window.location.href =
      `mailto:${recipient}?subject=${encodeURIComponent(labels.emailSubject)}` +
      `&body=${encodeURIComponent(lines.join("\n"))}`;
  }

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
    handOff(data);
    setStatus(labels.ready);
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

  return (
    <form ref={formRef} className={styles.form} noValidate onSubmit={onSubmit} onBlur={onBlur}>
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
  );
}
