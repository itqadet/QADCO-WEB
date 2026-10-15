import type { Metadata } from "next";
import { getDictionary, getLocale } from "@/i18n/get-dictionary";
import { localeDirection } from "@/i18n/config";
import { routes } from "@/i18n/routing";
import { buildMetadata } from "@/lib/metadata";
import { stages } from "@/content/process";
import { pick } from "@/content/localized";
import { PageIntro } from "@/components/sections/PageIntro";
import { CtaBand } from "@/components/sections/CtaBand";
import { ProcessTransmittal } from "@/components/process/ProcessTransmittal";
import { ApprovalCodes } from "@/components/process/ApprovalCodes";
import { Section, SectionHead } from "@/components/ui/Section";
import { Split } from "@/components/ui/Split";

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
      <PageIntro crumb={nav.process} title={copy.title} lede={copy.lede} />

      <Section aria-label={copy.transmittal.label} tight>
        <ProcessTransmittal stages={resolved} labels={copy.transmittal} rtl={localeDirection[locale] === "rtl"} />
      </Section>

      <Section aria-labelledby="codes-h">
        <SectionHead id="codes-h" title={copy.codes.title} intro={copy.codes.intro} />
        <ApprovalCodes locale={locale} />
      </Section>

      <Section aria-labelledby="qa-h">
        <Split>
          <h2 id="qa-h">{copy.quality.title}</h2>
          <p>{copy.quality.body}</p>
        </Split>
      </Section>

      <CtaBand title={copy.cta.title} body={copy.cta.body} actionLabel={copy.cta.action} />
    </>
  );
}
