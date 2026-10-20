import type { Metadata } from "next";
import { getDictionary, getLocale } from "@/i18n/get-dictionary";
import { routes } from "@/i18n/routing";
import { buildMetadata } from "@/lib/metadata";
import { Hero } from "@/components/home/Hero";
import { DesignStory, type StoryStep } from "@/components/home/DesignStory";
import { TradeTiles } from "@/components/home/TradeTiles";
import { HeritageBand } from "@/components/home/HeritageBand";
import { WorksShowcase } from "@/components/home/WorksShowcase";
import { TrustMarquee } from "@/components/home/TrustMarquee";
import { FactsBlock } from "@/components/sections/FactsBlock";
import { CtaBand } from "@/components/sections/CtaBand";
import { Container } from "@/components/ui/Container";
import { Section, SectionHead } from "@/components/ui/Section";

export async function generateMetadata(): Promise<Metadata> {
  const [dict, locale] = await Promise.all([getDictionary(), getLocale()]);
  return buildMetadata(locale, routes.home, dict.home.meta);
}

/**
 * One corridor through every stage: our sketch, the white model, the finished render, then a
 * ceiling our teams built. The sketch and model are drawn from the render itself.
 */
const storyImages: Omit<StoryStep["image"], "alt">[] = [
  { src: "/images/story/sketch.jpg", width: 1024, height: 1024 },
  { src: "/images/story/clay.jpg", width: 1024, height: 1024 },
  { src: "/images/story/render.jpg", width: 1024, height: 1024 },
  { src: "/images/story/built.jpg", width: 1024, height: 1024 },
];

/** Picked out of the render: stone, oak, walnut and the brass of the door pulls. */
const storyPalette = ["#ded1be", "#c5b59e", "#9d8567", "#765a3f", "#b8925a"];

/**
 * The home page is deliberately light on reading: a statement, a few numbers, and then images
 * and motion carry the story. Detail lives on Services, Projects and About.
 */
export default async function HomePage() {
  const [{ home }, locale] = await Promise.all([getDictionary(), getLocale()]);

  const steps: StoryStep[] = home.story.steps.map((s, i) => ({
    title: s.title,
    body: s.body,
    tag: s.tag,
    image: { ...storyImages[i], alt: s.alt },
    swatches: i === 2 ? storyPalette : undefined,
  }));

  return (
    <>
      <Hero />

      <Container>
        <FactsBlock overlap />
      </Container>

      <Section aria-labelledby="story-h">
        <DesignStory title={home.story.title} steps={steps} rtl={locale === "ar"} labels={home.story} />
      </Section>

      <WorksShowcase />

      <Section aria-labelledby="tiles-h">
        <SectionHead id="tiles-h" title={home.tilesTitle} intro={home.tilesIntro} />
        <TradeTiles />
      </Section>

      <HeritageBand />

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
