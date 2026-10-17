import type { Metadata } from "next";
import { getDictionary, getLocale } from "@/i18n/get-dictionary";
import { href, routes } from "@/i18n/routing";
import { buildMetadata } from "@/lib/metadata";
import { getFeaturedCaseStudies } from "@/lib/content";
import { Hero } from "@/components/home/Hero";
import { DesignStory, type StoryStep } from "@/components/home/DesignStory";
import { TradeTiles } from "@/components/home/TradeTiles";
import { HeritageBand } from "@/components/home/HeritageBand";
import { TrustMarquee } from "@/components/home/TrustMarquee";
import { CaseStudyGrid } from "@/components/projects/CaseStudyGrid";
import { FactsBlock } from "@/components/sections/FactsBlock";
import { CtaBand } from "@/components/sections/CtaBand";
import { Container } from "@/components/ui/Container";
import { Section, SectionHead } from "@/components/ui/Section";
import { TextLink } from "@/components/ui/TextLink";

export async function generateMetadata(): Promise<Metadata> {
  const [dict, locale] = await Promise.all([getDictionary(), getLocale()]);
  return buildMetadata(locale, routes.home, dict.home.meta);
}

/** The image for each design stage, in order: plan, visualisation, materials, built. */
const storyImages: Omit<StoryStep["image"], "alt">[] = [
  { src: "/images/drawings/plan-interior.svg", width: 480, height: 360, kind: "drawing" },
  { src: "/images/visualisations/corridor-coffers.jpg", width: 1024, height: 1024, kind: "photo" },
  { src: "/images/visualisations/tray-timber.jpg", width: 1024, height: 1024, kind: "photo" },
  { src: "/images/work/cid-auditorium-stage.jpg", width: 1034, height: 675, kind: "photo" },
];

/**
 * The home page is deliberately light on reading: a statement, a few numbers, and then images
 * and motion carry the story. Detail lives on Services, Projects and About.
 */
export default async function HomePage() {
  const [{ home }, locale, featured] = await Promise.all([getDictionary(), getLocale(), getFeaturedCaseStudies()]);

  const steps: StoryStep[] = home.story.steps.map((s, i) => ({
    title: s.title,
    body: s.body,
    tag: s.tag,
    image: { ...storyImages[i], alt: s.alt },
  }));

  return (
    <>
      <Hero />

      <Container>
        <FactsBlock />
      </Container>

      <Section aria-labelledby="story-h">
        <SectionHead id="story-h" title={home.story.title} />
        <DesignStory steps={steps} />
      </Section>

      <Section aria-labelledby="tiles-h">
        <SectionHead id="tiles-h" title={home.tilesTitle} intro={home.tilesIntro} />
        <TradeTiles />
      </Section>

      <HeritageBand />

      <Section aria-labelledby="work-h">
        <SectionHead id="work-h" title={home.featured.title} />
        <CaseStudyGrid items={featured} featured />
        <p>
          <TextLink href={href(locale, routes.projects)}>{home.featured.more}</TextLink>
        </p>
      </Section>

      <Section aria-labelledby="trust-h" bare>
        <Container>
          <SectionHead id="trust-h" title={home.trust.title} />
        </Container>
        <TrustMarquee approvalsLabel={home.approvals.title} brandsLabel={home.brands.title} />
      </Section>

      <CtaBand title={home.cta.title} body={home.cta.body} />
    </>
  );
}
