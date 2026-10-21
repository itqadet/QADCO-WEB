import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, getLocale } from "@/i18n/get-dictionary";
import { localeDirection } from "@/i18n/config";
import { href, routes } from "@/i18n/routing";
import { buildMetadata } from "@/lib/metadata";
import { getCaseStudies } from "@/lib/content";
import { sectors } from "@/content/sectors";
import { pick } from "@/content/localized";
import Image from "next/image";
import Link from "next/link";
import { CaseStudyHero } from "@/components/projects/CaseStudyHero";
import body from "@/components/projects/CaseStudyBody.module.css";
import { CtaBand } from "@/components/sections/CtaBand";
import { PhotoGallery } from "@/components/projects/PhotoGallery";
import { Container } from "@/components/ui/Container";
import { Section, SectionHead } from "@/components/ui/Section";

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
      <CaseStudyHero
        title={pick(study.title, locale)}
        summary={pick(study.summary, locale)}
        sector={pick(sectors[study.sector], locale)}
        cover={study.cover}
        facts={facts.filter((f) => f.label !== t.facts.sector)}
      />

      <Section aria-labelledby="scope-h">
        <div className={body.scopeHead}>
          <h2 id="scope-h">{t.scopeTitle}</h2>
          <span className={body.scopeCount}>{t.scopeCount.replace("{n}", String(study.scope.length))}</span>
        </div>
        <ol className={body.scope}>
          {study.scope.map((s) => (
            <li key={s.en}>{pick(s, locale)}</li>
          ))}
        </ol>
      </Section>

      <Section aria-labelledby="photos-h">
        <SectionHead id="photos-h" title={t.gallery} />
        <div className={body.gallery}>
          <PhotoGallery
            photos={study.photos.map((p) => ({ ...p, caption: pick(p.caption, locale) }))}
            rtl={localeDirection[locale] === "rtl"}
            labels={{ ...t.lightbox, openPhoto: t.openPhoto }}
          />
        </div>
      </Section>

      <Container as="nav" aria-label={nav.projects} className={body.pager}>
        <Link href={href(locale, routes.projects)} className={body.back}>
          {t.back}
        </Link>
        <Link href={href(locale, `${routes.projects}/${next.slug}`)} className={body.next}>
          <Image src={next.cover.src} alt="" width={next.cover.width} height={next.cover.height} sizes="160px" />
          <span>
            <span className={body.nextHint}>{t.nextHint}</span>
            <span className={body.nextTitle}>{pick(next.title, locale)}</span>
          </span>
          <span className={body.arrow} aria-hidden="true" />
        </Link>
      </Container>

      <CtaBand title={projects.cta.title} body={projects.cta.body} />
    </>
  );
}
