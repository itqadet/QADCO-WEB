import styles from "./SpecTable.module.css";

type SpecTableProps = {
  caption: string;
  head: { system: string; use: string };
  rows: { system: string; use: string }[];
};

/** System / where-it's-used table. Collapses to stacked rows on small screens. */
export function SpecTable({ caption, head, rows }: SpecTableProps) {
  return (
    <table className={styles.table}>
      <caption>{caption}</caption>
      <thead>
        <tr>
          <th scope="col">{head.system}</th>
          <th scope="col">{head.use}</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.system}>
            <th scope="row">{row.system}</th>
            <td>{row.use}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
