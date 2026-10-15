import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, getLocale } from "@/i18n/get-dictionary";
import { localeDirection } from "@/i18n/config";
import { href, routes } from "@/i18n/routing";
import { buildMetadata } from "@/lib/metadata";
import { getCaseStudies } from "@/lib/content";
import { sectors } from "@/content/sectors";
import { pick } from "@/content/localized";
import { PageIntro } from "@/components/sections/PageIntro";
import { CtaBand } from "@/components/sections/CtaBand";
import { PhotoGallery } from "@/components/projects/PhotoGallery";
import { CaseStudyFacts } from "@/components/projects/CaseStudyFacts";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Split } from "@/components/ui/Split";
import { TextLink } from "@/components/ui/TextLink";

/** Projects published after the build get their page on first visit, then stay cached. */
export const dynamicParams = true;

export async function generateStaticParams() {
  return (await getCaseStudies()).map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/[lang]/projects/[slug]">): Promise<Metadata> {
  const [{ slug }, locale, all] = await Promise.all([params, getLocale(), getCaseStudies()]);
  const study = all.find((c) => c.slug === slug);
  if (!study) return {};
  return buildMetadata(locale, `${routes.projects}/${slug}`, {
    title: `${pick(study.title, locale)} | QADCO`,
    description: pick(study.summary, locale),
  });
}

export default async function CaseStudyPage({ params }: PageProps<"/[lang]/projects/[slug]">) {
  const [{ slug }, dict, locale, caseStudies] = await Promise.all([params, getDictionary(), getLocale(), getCaseStudies()]);
  const study = caseStudies.find((c) => c.slug === slug);
  if (!study) notFound();

  const { caseStudy: t, projects, nav } = dict;
  const index = caseStudies.indexOf(study);
  const next = caseStudies[(index + 1) % caseStudies.length];

  const facts = [
    { label: t.facts.sector, value: pick(sectors[study.sector], locale) },
    study.location && { label: t.facts.location, value: pick(study.location, locale) },
    study.building && { label: t.facts.building, value: study.building, ltr: true },
    study.contractor && { label: t.facts.contractor, value: study.contractor, ltr: true },
    study.consultant && { label: t.facts.consultant, value: study.consultant, ltr: true },
  ].filter(Boolean) as { label: string; value: string; ltr?: boolean }[];

  return (
    <>
      <PageIntro
        crumb={pick(study.title, locale)}
        parent={{ href: href(locale, routes.projects), label: nav.projects }}
        title={pick(study.title, locale)}
        lede={pick(study.summary, locale)}
      />

      <Container>
        <CaseStudyFacts facts={facts} />
      </Container>

      <Section aria-labelledby="scope-h">
        <Split>
          <div>
            <h2 id="scope-h">{t.scopeTitle}</h2>
            <ul className="ruled-list">
              {study.scope.map((s) => (
                <li key={s.en}>{pick(s, locale)}</li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="visually-hidden">{t.photosTitle}</h2>
            <PhotoGallery
              photos={study.photos.map((p) => ({ ...p, caption: pick(p.caption, locale) }))}
              rtl={localeDirection[locale] === "rtl"}
              labels={{ ...t.lightbox, openPhoto: t.openPhoto }}
            />
          </div>
        </Split>
      </Section>

      <Container as="nav" aria-label={nav.projects} className="pager">
        <TextLink href={href(locale, routes.projects)}>{t.back}</TextLink>
        <TextLink href={href(locale, `${routes.projects}/${next.slug}`)}>
          {t.next}: {pick(next.title, locale)}
        </TextLink>
      </Container>

      <CtaBand title={projects.cta.title} body={projects.cta.body} />
    </>
  );
}
