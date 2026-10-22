import type { Metadata } from "next";
import { getDictionary, getLocale } from "@/i18n/get-dictionary";
import { localeDirection } from "@/i18n/config";
import { routes } from "@/i18n/routing";
import { buildMetadata } from "@/lib/metadata";
import { stages } from "@/content/process";
import { pick } from "@/content/localized";
import { DarkBand } from "@/components/ui/DarkBand";
import { ProcessRoute } from "@/components/process/ProcessRoute";
import quality from "@/components/process/Quality.module.css";
import { CtaBand } from "@/components/sections/CtaBand";
import { ProcessTransmittal } from "@/components/process/ProcessTransmittal";
import { ApprovalCodes } from "@/components/process/ApprovalCodes";
import { Section, SectionHead } from "@/components/ui/Section";

export async function generateMetadata(): Promise<Metadata> {
  const [dict, locale] = await Promise.all([getDictionary(), getLocale()]);
  return buildMetadata(locale, routes.process, dict.process.meta);
}

export default async function ProcessPage() {
  const [{ process: copy, nav }, locale] = await Promise.all([getDictionary(), getLocale()]);

  const resolved = stages.map((s) => ({
    id: s.id,
    code: s.code,
    title: pick(s.title, locale),
    summary: pick(s.summary, locale),
    items: s.items.map((i) => ({ title: pick(i.title, locale), body: pick(i.body, locale) })),
  }));

  return (
    <>
      <DarkBand id="process-h" crumb={nav.process} title={copy.title} lede={copy.lede}>
        <ProcessRoute
          label={copy.route.label}
          itemsWord={copy.route.items}
          stages={resolved.map((s) => ({ id: s.id, code: s.code, title: s.title, summary: s.summary, count: s.items.length }))}
        />
      </DarkBand>

      <Section id="stages" aria-label={copy.transmittal.label} style={{ scrollMarginTop: "var(--header-h)" }}>
        <ProcessTransmittal stages={resolved} labels={copy.transmittal} rtl={localeDirection[locale] === "rtl"} />
      </Section>

      <Section aria-labelledby="codes-h">
        <SectionHead id="codes-h" title={copy.codes.title} intro={copy.codes.intro} />
        <ApprovalCodes locale={locale} />
      </Section>

      <Section aria-labelledby="qa-h">
        <div className={quality.card}>
          <div>
            <span className={quality.icon} aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3 4.5 6v5.5c0 4.6 3.2 8.4 7.5 9.5 4.3-1.1 7.5-4.9 7.5-9.5V6L12 3Z" />
                <path d="m8.5 12 2.5 2.5 4.5-5" />
              </svg>
            </span>
            <h2 id="qa-h">{copy.quality.title}</h2>
            <p>{copy.quality.body}</p>
          </div>
          <ul className={quality.points}>
            {copy.qualityPoints.map((q) => (
              <li key={q}>{q}</li>
            ))}
          </ul>
        </div>
      </Section>

      <CtaBand title={copy.cta.title} body={copy.cta.body} actionLabel={copy.cta.action} />
    </>
  );
}
