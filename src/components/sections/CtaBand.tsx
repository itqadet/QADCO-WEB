import { getDictionary, getLocale } from "@/i18n/get-dictionary";
import { href, routes } from "@/i18n/routing";
import { ButtonLink, ButtonRow } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { ContactList } from "./ContactList";
import styles from "./CtaBand.module.css";

type CtaBandProps = {
  title: string;
  body: string;
  /** Button text when the action isn't a site visit; it still leads to the contact page. */
  actionLabel?: string;
};

/** Closing call to action on every page: a contact button beside the contact details. */
export async function CtaBand({ title, body, actionLabel }: CtaBandProps) {
  const [{ common }, locale] = await Promise.all([getDictionary(), getLocale()]);

  return (
    <Section tone="band" aria-labelledby="cta-h">
      <div className={styles.grid}>
        <div>
          <h2 id="cta-h" className={styles.title}>
            {title}
          </h2>
          <p>{body}</p>
          <ButtonRow>
            <ButtonLink href={href(locale, routes.contact)}>{actionLabel ?? common.requestVisit}</ButtonLink>
          </ButtonRow>
        </div>
        <ContactList />
      </div>
    </Section>
  );
}
