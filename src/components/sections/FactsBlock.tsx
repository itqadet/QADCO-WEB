import { getDictionary } from "@/i18n/get-dictionary";
import { facts } from "@/content/site";
import styles from "./FactsBlock.module.css";

/**
 * Company facts set as an architectural title block: a ruled strip of labelled cells,
 * the same device that closes every QADCO shop drawing.
 */
export async function FactsBlock() {
  const { facts: t } = await getDictionary();

  const cells = [
    { label: t.founded, value: String(facts.founded) },
    { label: t.technicians, value: facts.technicians },
    { label: t.projects, value: facts.projects },
    { label: t.quality, value: t.qualityValue },
  ];

  return (
    <dl className={styles.block} aria-label={t.label} data-reveal="">
      {cells.map((c) => (
        <div key={c.label} className={styles.cell}>
          <dt>{c.label}</dt>
          <dd dir="ltr">{c.value}</dd>
        </div>
      ))}
    </dl>
  );
}
