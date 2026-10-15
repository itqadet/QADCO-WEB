"use client";

import { useRef, useState } from "react";
import styles from "./ProcessTransmittal.module.css";

export type TransmittalStage = {
  id: string;
  code: string;
  title: string;
  summary: string;
  items: { title: string; body: string }[];
};

type Labels = {
  label: string;
  sheet: string;
  stage: string;
  items: string;
  status: string;
  stamp: string;
  itemNo: string;
  description: string;
};

/**
 * The method statement as a transmittal sheet. Each stage is a tab; opening one lands the
 * consultant's approval stamp on its sheet. The stamp is response motion: it only plays when the
 * visitor chooses a stage, never on page load.
 */
export function ProcessTransmittal({ stages, labels, rtl }: { stages: TransmittalStage[]; labels: Labels; rtl: boolean }) {
  const [active, setActive] = useState(0);
  const [stampKey, setStampKey] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  const select = (i: number) => {
    if (i === active) return;
    setActive(i);
    setStampKey((k) => k + 1);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    const last = stages.length - 1;
    const forward = rtl ? "ArrowLeft" : "ArrowRight";
    const back = rtl ? "ArrowRight" : "ArrowLeft";
    let next: number | null = null;
    if (e.key === forward) next = active === last ? 0 : active + 1;
    if (e.key === back) next = active === 0 ? last : active - 1;
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = last;
    if (next === null) return;
    e.preventDefault();
    select(next);
    tabs.current[next]?.focus();
  };

  const stage = stages[active];

  return (
    <div className={styles.wrap}>
      <div className={styles.tabs} role="tablist" aria-label={labels.label} onKeyDown={onKeyDown}>
        {stages.map((s, i) => (
          <button
            key={s.id}
            ref={(el) => {
              tabs.current[i] = el;
            }}
            id={`tab-${s.id}`}
            role="tab"
            type="button"
            aria-selected={i === active}
            aria-controls={`panel-${s.id}`}
            tabIndex={i === active ? 0 : -1}
            className={styles.tab}
            onClick={() => select(i)}
          >
            <span className={styles.tabNo} dir="ltr">
              {i + 1}
            </span>
            <span>
              <span className={styles.tabTitle}>{s.title}</span>
              <span className={styles.tabCode} dir="ltr">
                {s.code}
              </span>
            </span>
          </button>
        ))}
      </div>

      <section
        id={`panel-${stage.id}`}
        role="tabpanel"
        aria-labelledby={`tab-${stage.id}`}
        className={styles.sheet}
        tabIndex={0}
      >
        <div className={styles.head}>
          <div>
            <span className={styles.headLabel}>{labels.sheet}</span>
            <span dir="ltr">QADCO/{stage.code}</span>
          </div>
          <div>
            <span className={styles.headLabel}>{labels.stage}</span>
            <span>
              {active + 1} / {stages.length}
            </span>
          </div>
          <div>
            <span className={styles.headLabel}>{labels.items}</span>
            <span dir="ltr">{stage.items.length}</span>
          </div>
          <div>
            <span className={styles.headLabel}>{labels.status}</span>
            <span className={styles.statusValue}>{labels.stamp}</span>
          </div>
        </div>

        <h2 className={styles.title}>{stage.title}</h2>
        <p className={styles.summary}>{stage.summary}</p>

        <table className={styles.items}>
          <thead>
            <tr>
              <th scope="col">{labels.itemNo}</th>
              <th scope="col">{labels.description}</th>
            </tr>
          </thead>
          <tbody>
            {stage.items.map((item, i) => (
              <tr key={item.title}>
                <td dir="ltr" className={styles.no}>
                  {active + 1}.{i + 1}
                </td>
                <td>
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div key={stampKey} className={styles.stamp} data-animate={stampKey > 0 || undefined} aria-hidden="true">
          <span className={styles.stampCode}>A</span>
          <span className={styles.stampText}>{labels.stamp}</span>
          <span className={styles.stampMeta} dir="ltr">
            QADCO/{stage.code}
          </span>
        </div>
      </section>
    </div>
  );
}
