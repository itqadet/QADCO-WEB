import type { Metadata } from "next";
import { getDictionary, getLocale } from "@/i18n/get-dictionary";
import { href, routes } from "@/i18n/routing";
import { buildMetadata } from "@/lib/metadata";
import { getFeaturedCaseStudies } from "@/lib/content";
import { buildTrades } from "@/content/drawings";
import { Hero } from "@/components/home/Hero";
import { DesignStory, type StoryStep } from "@/components/home/DesignStory";
import { TradeRow } from "@/components/home/TradeRow";
import { HeritageBand } from "@/components/home/HeritageBand";
import { CaseStudyGrid } from "@/components/projects/CaseStudyGrid";
import { FactsBlock } from "@/components/sections/FactsBlock";
import { ApprovalsList, BrandGrid } from "@/components/sections/Credentials";
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
        <SectionHead id="story-h" title={home.story.title} intro={home.story.intro} />
        <DesignStory steps={steps} />
      </Section>

      <Section aria-labelledby="trades-h">
        <SectionHead id="trades-h" title={home.trades.title} intro={home.trades.intro} />
        {buildTrades.map((trade) => (
          <TradeRow key={trade} trade={trade} />
        ))}
      </Section>

      <HeritageBand />

      <Section aria-labelledby="work-h">
        <SectionHead id="work-h" title={home.featured.title} intro={home.featured.intro} />
        <CaseStudyGrid items={featured} featured />
        <p>
          <TextLink href={href(locale, routes.projects)}>{home.featured.more}</TextLink>
        </p>
      </Section>

      <Section aria-labelledby="approvals-h">
        <SectionHead id="approvals-h" title={home.approvals.title} intro={home.approvals.intro} />
        <ApprovalsList label={home.approvals.title} />
      </Section>

      <Section aria-labelledby="brands-h">
        <SectionHead id="brands-h" title={home.brands.title} intro={home.brands.intro} />
        <BrandGrid label={home.brands.title} />
      </Section>

      <CtaBand title={home.cta.title} body={home.cta.body} />
    </>
  );
}
