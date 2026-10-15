import Link from "next/link";
import { getDictionary, getLocale } from "@/i18n/get-dictionary";
import { href } from "@/i18n/routing";
import { Container } from "@/components/ui/Container";
import styles from "./PageIntro.module.css";

type PageIntroProps = {
  /** Current page name, shown as the last breadcrumb item. */
  crumb: string;
  /** Optional middle breadcrumb level, e.g. Projects on a case-study page. */
  parent?: { href: string; label: string };
  title: string;
  lede: React.ReactNode;
};

/** Breadcrumb, page title and lede at the top of every inner page. */
export async function PageIntro({ crumb, parent, title, lede }: PageIntroProps) {
  const [{ common }, locale] = await Promise.all([getDictionary(), getLocale()]);

  return (
    <Container className={styles.intro}>
      <nav aria-label={common.breadcrumb} className={styles.breadcrumb}>
        <Link href={href(locale)}>{common.home}</Link> /{" "}
        {parent ? (
          <>
            <Link href={parent.href}>{parent.label}</Link> /{" "}
          </>
        ) : null}
        <span aria-current="page">{crumb}</span>
      </nav>
      <h1>{title}</h1>
      <p className={styles.lede}>{lede}</p>
    </Container>
  );
}
