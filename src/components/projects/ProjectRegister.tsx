"use client";

import { useDeferredValue, useEffect, useId, useMemo, useState } from "react";
import styles from "./ProjectRegister.module.css";

export type RegisterRow = {
  name: string;
  sector: string;
  sectorLabel: string;
  location?: string;
  contractor?: string;
  consultant?: string;
  scope: string;
  period: string;
};

type Labels = {
  search: string;
  searchPlaceholder: string;
  sectorLabel: string;
  all: string;
  columns: { project: string; sector: string; location: string; contractor: string; consultant: string; scope: string; period: string };
  count: string;
  empty: string;
  clear: string;
  note: string;
};

type ProjectRegisterProps = {
  rows: RegisterRow[];
  sectors: { key: string; label: string }[];
  labels: Labels;
};

const normalise = (s: string) => s.toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "");

/** Searchable, filterable project schedule. Filters are mirrored in the URL so a view can be shared. */
export function ProjectRegister({ rows, sectors, labels }: ProjectRegisterProps) {
  const [query, setQuery] = useState("");
  const [sector, setSector] = useState("all");
  const deferredQuery = useDeferredValue(query);
  const searchId = useId();

  // Restore filters from the URL once, on the client.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const q = params.get("q");
    const s = params.get("sector");
    if (q) setQuery(q);
    if (s && sectors.some((x) => x.key === s)) setSector(s);
  }, [sectors]);

  // Keep the URL in step without adding history entries.
  useEffect(() => {
    const url = new URL(window.location.href);
    if (deferredQuery) url.searchParams.set("q", deferredQuery);
    else url.searchParams.delete("q");
    if (sector !== "all") url.searchParams.set("sector", sector);
    else url.searchParams.delete("sector");
    window.history.replaceState(null, "", url);
  }, [deferredQuery, sector]);

  const counts = useMemo(() => {
    const map = new Map<string, number>();
    rows.forEach((r) => map.set(r.sector, (map.get(r.sector) ?? 0) + 1));
    return map;
  }, [rows]);

  const visible = useMemo(() => {
    const q = normalise(deferredQuery.trim());
    return rows.filter((r) => {
      if (sector !== "all" && r.sector !== sector) return false;
      if (!q) return true;
      return normalise([r.name, r.location, r.contractor, r.consultant].filter(Boolean).join(" ")).includes(q);
    });
  }, [rows, sector, deferredQuery]);

  const reset = () => {
    setQuery("");
    setSector("all");
  };

  return (
    <div className={styles.register}>
      <div className={styles.controls}>
        <div className={styles.search}>
          <label htmlFor={searchId}>{labels.search}</label>
          <input
            id={searchId}
            type="search"
            value={query}
            placeholder={labels.searchPlaceholder}
            onChange={(e) => setQuery(e.target.value)}
            autoComplete="off"
          />
        </div>
        <div className={styles.sectors} role="group" aria-label={labels.sectorLabel}>
          <button type="button" aria-pressed={sector === "all"} onClick={() => setSector("all")}>
            {labels.all} <span dir="ltr">{rows.length}</span>
          </button>
          {sectors.map((s) => (
            <button key={s.key} type="button" aria-pressed={sector === s.key} onClick={() => setSector(s.key)}>
              {s.label} <span dir="ltr">{counts.get(s.key) ?? 0}</span>
            </button>
          ))}
        </div>
      </div>

      <p className={styles.status} role="status" aria-live="polite">
        {labels.count.replace("{count}", String(visible.length))}
      </p>

      {visible.length === 0 ? (
        <div className={styles.empty}>
          <p>{labels.empty}</p>
          <button type="button" className={styles.reset} onClick={reset}>
            {labels.clear}
          </button>
        </div>
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th scope="col">{labels.columns.project}</th>
                <th scope="col">{labels.columns.sector}</th>
                <th scope="col">{labels.columns.contractor}</th>
                <th scope="col">{labels.columns.consultant}</th>
                <th scope="col">{labels.columns.scope}</th>
                <th scope="col">{labels.columns.period}</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((r, i) => (
                <tr key={`${r.name}-${r.location}-${i}`}>
                  <th scope="row">
                    <span lang="en" dir="ltr" className={styles.project}>
                      {r.name}
                    </span>
                    {r.location ? (
                      <span lang="en" dir="ltr" className={styles.location}>
                        {r.location}
                      </span>
                    ) : null}
                  </th>
                  <td data-label={labels.columns.sector}>{r.sectorLabel}</td>
                  <td data-label={labels.columns.contractor} lang="en" dir="ltr">
                    {r.contractor ?? "–"}
                  </td>
                  <td data-label={labels.columns.consultant} lang="en" dir="ltr">
                    {r.consultant ?? "–"}
                  </td>
                  <td data-label={labels.columns.scope}>{r.scope}</td>
                  <td data-label={labels.columns.period} dir="ltr" className={styles.period}>
                    {r.period}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className={styles.note}>{labels.note}</p>
    </div>
  );
}
