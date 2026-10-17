"use client";

import { useState } from "react";
import styles from "./ContactMap.module.css";

type ContactMapProps = {
  /** An address, or "latitude,longitude" for an exact pin. */
  query: string;
  locale: string;
  address: string;
  labels: { frameTitle: string; activate: string; open: string; directions: string };
};

/**
 * Google map of the office. It stays still until clicked, so scrolling the page never gets
 * caught by the map; after that it pans and zooms normally.
 */
export function ContactMap({ query, locale, address, labels }: ContactMapProps) {
  const [active, setActive] = useState(false);
  const q = encodeURIComponent(query);

  return (
    <div className={styles.wrap} data-active={active || undefined}>
      <iframe
        className={styles.frame}
        title={labels.frameTitle}
        src={`https://maps.google.com/maps?q=${q}&hl=${locale}&z=15&output=embed`}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
      />
      {active ? null : (
        <button type="button" className={styles.shield} onClick={() => setActive(true)}>
          <span className={styles.hint}>{labels.activate}</span>
        </button>
      )}
      <div className={styles.card}>
        <span className={styles.pin} aria-hidden="true" />
        <p className={styles.address}>{address}</p>
        <div className={styles.actions}>
          <a href={`https://www.google.com/maps/dir/?api=1&destination=${q}`} target="_blank" rel="noopener noreferrer" className={styles.primary}>
            {labels.directions}
          </a>
          <a href={`https://www.google.com/maps/search/?api=1&query=${q}`} target="_blank" rel="noopener noreferrer" className={styles.secondary}>
            {labels.open}
          </a>
        </div>
      </div>
    </div>
  );
}
