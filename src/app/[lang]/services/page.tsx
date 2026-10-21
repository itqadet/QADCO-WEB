import type { Metadata } from "next";
import Link from "next/link";
import { getDictionary, getLocale } from "@/i18n/get-dictionary";
import { href, routes } from "@/i18n/routing";
import { buildMetadata } from "@/lib/metadata";
import { tradeAnchor } from "@/content/drawings";
import { PageIntro } from "@/components/sections/PageIntro";
import { SystemList } from "@/components/sections/SystemList";
import { CtaBand } from "@/components/sections/CtaBand";
import { TradeDetail } from "@/components/services/TradeDetail";
import { SpecTable } from "@/components/services/SpecTable";
import { FaqList } from "@/components/services/FaqList";
import { Section } from "@/components/ui/Section";
import { Split } from "@/components/ui/Split";

export async function generateMetadata(): Promise<Metadata> {
  const [dict, locale] = await Promise.all([getDictionary(), getLocale()]);
  return buildMetadata(locale, routes.services, dict.services.meta);
}

export default async function ServicesPage() {
  const [{ services, nav }, locale] = await Promise.all([getDictionary(), getLocale()]);
  const { lede } = services;

  return (
    <>
      <PageIntro
        crumb={nav.services}
        title={services.title}
        lede={
          <>
            {lede.before} <a href={`#${tradeAnchor.design}`}>{lede.design}</a>,{" "}
            <a href={`#${tradeAnchor.ceilings}`}>{lede.ceilings}</a>,{" "}
            <a href={`#${tradeAnchor.partitions}`}>{lede.partitions}</a> {lede.or}{" "}
            <a href={`#${tradeAnchor.fitOut}`}>{lede.fitOut}</a>.
          </>
        }
      />

      <TradeDetail
        trade="design"
        intro={services.design.body}
        photo={{ src: "/images/services/corridor-coffers.jpg", width: 1600, height: 1600, alt: services.design.imageAlt }}
      >
        <SpecTable caption={services.design.tableCaption} head={services.design.tableHead} rows={services.design.rows} />
      </TradeDetail>

      <TradeDetail
        trade="ceilings"
        intro={services.ceilings.body}
        photo={{ src: "/images/services/sys-star-coffer.jpg", width: 1760, height: 1232, alt: services.ceilings.imageAlt }}
      >
        <SpecTable caption={services.ceilings.tableCaption} head={services.tableHead} rows={services.ceilings.rows} />
      </TradeDetail>

      <TradeDetail
        trade="partitions"
        intro={services.partitions.body}
        photo={{ src: "/images/services/part-demountable-glazed.jpg", width: 1744, height: 1360, alt: services.partitions.imageAlt }}
      >
        <SpecTable caption={services.partitions.tableCaption} head={services.tableHead} rows={services.partitions.rows} />
      </TradeDetail>

      <TradeDetail
        trade="fitOut"
        intro={services.fitOut.body}
        photo={{ src: "/images/services/joinery-wall-unit.jpg", width: 1824, height: 1360, alt: services.fitOut.imageAlt }}
      >
        <SystemList items={services.fitOut.systems} />
      </TradeDetail>

      <Section aria-labelledby="faq-h">
        <Split>
          <div>
            <h2 id="faq-h">{services.faq.title}</h2>
            <p style={{ color: "var(--muted)" }}>
              {services.faq.askPrefix} <Link href={href(locale, routes.contact)}>{services.faq.askLink}</Link>.
            </p>
          </div>
          <FaqList items={services.faq.items} />
        </Split>
      </Section>

      <CtaBand title={services.cta.title} body={services.cta.body} />
    </>
  );
}
