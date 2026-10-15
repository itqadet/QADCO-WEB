import type { Metadata } from "next";
import { getDictionary, getLocale } from "@/i18n/get-dictionary";
import { routes } from "@/i18n/routing";
import { buildMetadata } from "@/lib/metadata";
import { PageIntro } from "@/components/sections/PageIntro";
import { CaptionedImage } from "@/components/sections/CaptionedImage";
import { FactsBlock } from "@/components/sections/FactsBlock";
import { ApprovalsList, BrandGrid } from "@/components/sections/Credentials";
import { CtaBand } from "@/components/sections/CtaBand";
import { PrinciplesList } from "@/components/about/PrinciplesList";
import { ServiceAreas } from "@/components/about/ServiceAreas";
import { TeamStructure } from "@/components/about/TeamStructure";
import { Container } from "@/components/ui/Container";
import { Section, SectionHead } from "@/components/ui/Section";
import { Split } from "@/components/ui/Split";

export async function generateMetadata(): Promise<Metadata> {
  const [dict, locale] = await Promise.all([getDictionary(), getLocale()]);
  return buildMetadata(locale, routes.about, dict.about.meta);
}

export default async function AboutPage() {
  const { about, nav, home } = await getDictionary();

  return (
    <>
      <PageIntro crumb={nav.about} title={about.title} lede={about.lede} />
      <Container>
        <FactsBlock />
      </Container>

      <Section aria-labelledby="story-h">
        <Split>
          <CaptionedImage
            src="/images/work/akh-hexagon-coffer.jpg"
            width={974}
            height={649}
            alt={about.story.imageAlt}
            caption={about.story.caption}
          />
          <div>
            <h2 id="story-h">{about.story.title}</h2>
            {about.story.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </Split>
      </Section>

      <Section aria-labelledby="people-h">
        <Split>
          <div>
            <h2 id="people-h">{about.people.title}</h2>
            <p>{about.people.body}</p>
          </div>
          <div>
            <h2>{about.safety.title}</h2>
            <p>{about.safety.body}</p>
          </div>
        </Split>
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
        <Split>
          <CaptionedImage
            src="/images/work/cid-auditorium-stage.jpg"
            width={1034}
            height={675}
            ratio="4 / 3"
            alt=""
          />
          <div>
            <h2 id="who-h">{about.clients.title}</h2>
            <p>{about.clients.body}</p>
            <h3>{about.clients.areasTitle}</h3>
            <ServiceAreas label={about.clients.areasLabel} areas={about.clients.areas} />
          </div>
        </Split>
      </Section>

      <Section aria-labelledby="cred-h">
        <SectionHead id="cred-h" title={about.credentials.title} intro={about.credentials.iso} />
        <p>{about.credentials.chamber}</p>
        <h3>{home.approvals.title}</h3>
        <ApprovalsList label={home.approvals.title} />
        <h3 style={{ marginTop: "2.5rem" }}>{home.brands.title}</h3>
        <BrandGrid label={home.brands.title} />
      </Section>

      <CtaBand title={about.cta.title} body={about.cta.body} />
    </>
  );
}
