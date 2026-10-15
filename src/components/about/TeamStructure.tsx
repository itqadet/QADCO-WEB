import styles from "./TeamStructure.module.css";

type Group = { title: string; roles: string[] };

/** Departments under the General Manager, drawn as a simple organisation tree. */
export function TeamStructure({ head, groups }: { head: string; groups: Group[] }) {
  return (
    <div className={styles.tree}>
      <p className={styles.head}>{head}</p>
      <ul className={styles.groups}>
        {groups.map((g) => (
          <li key={g.title} className={styles.group}>
            <h3>{g.title}</h3>
            <ul>
              {g.roles.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}
