import { getDictionary, getLocale } from "@/i18n/get-dictionary";
import { href, routes } from "@/i18n/routing";
import { tradeAnchor, type BuildTrade } from "@/content/drawings";
import { DrawingSheet } from "@/components/sections/DrawingSheet";
import { SystemList } from "@/components/sections/SystemList";
import { TextLink } from "@/components/ui/TextLink";
import styles from "./TradeRow.module.css";

/** One trade on the home page: its drawing sheet beside a summary and system list. */
export async function TradeRow({ trade }: { trade: BuildTrade }) {
  const [dict, locale] = await Promise.all([getDictionary(), getLocale()]);
  const copy = dict.home.trades[trade];

  return (
    <article className={styles.row} data-reveal="">
      <DrawingSheet trade={trade} />
      <div>
        <h3 className={styles.title}>{dict.trades[trade].title}</h3>
        <p>{copy.body}</p>
        <SystemList items={copy.systems} />
        <TextLink href={href(locale, routes.services, tradeAnchor[trade])}>{copy.link}</TextLink>
      </div>
    </article>
  );
}
