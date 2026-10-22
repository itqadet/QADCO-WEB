import type { Metadata } from "next";
import { getDictionary, getLocale } from "@/i18n/get-dictionary";
import { routes } from "@/i18n/routing";
import { buildMetadata } from "@/lib/metadata";
import Image from "next/image";
import { AboutHero } from "@/components/about/AboutHero";
import styles from "@/components/about/About.module.css";
import { FactsBlock } from "@/components/sections/FactsBlock";
import { ApprovalsList, BrandGrid } from "@/components/sections/Credentials";
import { CtaBand } from "@/components/sections/CtaBand";
import { PrinciplesList } from "@/components/about/PrinciplesList";
import { ServiceAreas } from "@/components/about/ServiceAreas";
import { TeamStructure } from "@/components/about/TeamStructure";
import { Container } from "@/components/ui/Container";
import { Section, SectionHead } from "@/components/ui/Section";

export async function generateMetadata(): Promise<Metadata> {
  const [dict, locale] = await Promise.all([getDictionary(), getLocale()]);
  return buildMetadata(locale, routes.about, dict.about.meta);
}

/** Simple line icons for the people and safety cards. */
const PeopleIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="9" cy="8" r="3.2" />
    <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" />
    <circle cx="17" cy="9" r="2.5" />
    <path d="M16 14.2c2.9.4 5 2.9 5 5.8" />
  </svg>
);
const ShieldIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 3 4.5 6v5.5c0 4.6 3.2 8.4 7.5 9.5 4.3-1.1 7.5-4.9 7.5-9.5V6L12 3Z" />
    <path d="m8.5 12 2.5 2.5 4.5-5" />
  </svg>
);

export default async function AboutPage() {
  const { about, home } = await getDictionary();

  return (
    <>
      <AboutHero />

      <Container style={{ marginTop: "clamp(2rem, 4vw, 3.5rem)" }}>
        <FactsBlock />
      </Container>

      <Section aria-labelledby="story-h">
        <div className={styles.story}>
          <figure className={styles.arch}>
            <div className={styles.archFrame}>
              <Image
                src="/images/projects/akh-hexagon-coffer.jpg"
                width={1920}
                height={1280}
                alt={about.story.imageAlt}
                sizes="(max-width: 860px) 90vw, 40vw"
              />
            </div>
            <figcaption>{about.story.caption}</figcaption>
          </figure>
          <div className={styles.storyText}>
            <h2 id="story-h">{about.story.title}</h2>
            <p className={styles.meaning}>
              <span className={styles.meaningAr} lang="ar" dir="rtl">
                {about.meaning.ar}
              </span>
              <span className={styles.meaningEn} lang="en">
                {about.meaning.en}
              </span>
            </p>
            {about.story.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </div>
      </Section>

      <Section aria-labelledby="people-h">
        <div className={styles.pair}>
          <div className={styles.pairCard}>
            <span className={styles.icon}>
              <PeopleIcon />
            </span>
            <h2 id="people-h">{about.people.title}</h2>
            <p>{about.people.body}</p>
          </div>
          <div className={styles.pairCard} data-tone="dark">
            <span className={styles.icon}>
              <ShieldIcon />
            </span>
            <h2>{about.safety.title}</h2>
            <p>{about.safety.body}</p>
          </div>
        </div>
      </Section>

      <Section aria-labelledby="how-h">
        <SectionHead id="how-h" title={about.principles.title} intro={about.principles.intro} />
        <PrinciplesList items={about.principles.items} />
      </Section>

      <Section aria-labelledby="team-h">
        <SectionHead id="team-h" title={about.team.title} intro={about.team.intro} />
        <TeamStructure head={about.team.head} groups={about.team.groups} />
      </Section>

      <Section aria-labelledby="who-h">
        <SectionHead id="who-h" title={about.clients.title} />
        <ul className={styles.audiences}>
          {about.clientTypes.map((c) => (
            <li key={c.title}>
              <h3>{c.title}</h3>
              <p>{c.body}</p>
            </li>
          ))}
        </ul>
        <h3 className={styles.areasHead}>{about.clients.areasTitle}</h3>
        <ServiceAreas label={about.clients.areasLabel} areas={about.clients.areas} />
      </Section>

      <Section aria-labelledby="cred-h">
        <SectionHead id="cred-h" title={about.credentials.title} />
        <div className={styles.iso}>
          <span className={styles.isoBadge} dir="ltr" aria-hidden="true">
            ISO
            <br />
            9001
          </span>
          <div>
            <p>{about.credentials.iso}</p>
            <p>{about.credentials.chamber}</p>
          </div>
        </div>
        <h3 className={styles.credHead}>{home.approvals.title}</h3>
        <ApprovalsList label={home.approvals.title} />
        <h3 className={styles.credHead} style={{ marginTop: "2.5rem" }}>
          {home.brands.title}
        </h3>
        <BrandGrid label={home.brands.title} />
      </Section>

      <CtaBand title={about.cta.title} body={about.cta.body} />
    </>
  );
}
