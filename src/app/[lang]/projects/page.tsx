import type { Metadata } from "next";
import { getDictionary, getLocale } from "@/i18n/get-dictionary";
import { routes } from "@/i18n/routing";
import { buildMetadata } from "@/lib/metadata";
import { getCaseStudies, getRegister, getTowers } from "@/lib/content";
import { scopes } from "@/content/register";
import { sectorKeys, sectors } from "@/content/sectors";
import { pick } from "@/content/localized";
import { PageIntro } from "@/components/sections/PageIntro";
import { CtaBand } from "@/components/sections/CtaBand";
import { Skyline } from "@/components/projects/Skyline";
import { CaseStudyGrid } from "@/components/projects/CaseStudyGrid";
import { ProjectRegister, type RegisterRow } from "@/components/projects/ProjectRegister";
import { Section, SectionHead } from "@/components/ui/Section";

export async function generateMetadata(): Promise<Metadata> {
  const [dict, locale] = await Promise.all([getDictionary(), getLocale()]);
  return buildMetadata(locale, routes.projects, dict.projects.meta);
}

export default async function ProjectsPage() {
  const [{ projects: copy, nav }, locale, towers, register, caseStudies] = await Promise.all([
    getDictionary(),
    getLocale(),
    getTowers(),
    getRegister(),
    getCaseStudies(),
  ]);

  // Resolve language-independent content into this locale's strings before it reaches the client.
  const skyline = towers.map((t) => ({
    ...t,
    name: pick(t.name, locale),
    location: pick(t.location, locale),
    scope: pick(t.scope, locale),
  }));

  const rows: RegisterRow[] = register.map((r) => ({
    ...r,
    sectorLabel: pick(sectors[r.sector], locale),
    scope: r.scope.map((s) => pick(scopes[s], locale)).join(locale === "ar" ? "، " : ", "),
  }));

  const sectorOptions = sectorKeys
    .filter((k) => register.some((r) => r.sector === k))
    .map((k) => ({ key: k, label: pick(sectors[k], locale) }));

  return (
    <>
      <PageIntro crumb={nav.projects} title={copy.title} lede={copy.lede} />

      <Section aria-labelledby="skyline-h" tight>
        <h2 id="skyline-h" className="visually-hidden">
          {copy.skyline.title}
        </h2>
        <Skyline
          towers={skyline}
          initial={skyline.find((t) => t.name.includes("AKH"))?.id ?? skyline[0]?.id}
          labels={{
            hint: copy.skyline.hint,
            notToScale: copy.skyline.notToScale,
            listLabel: copy.skyline.listLabel,
            scopeLabel: copy.skyline.scopeLabel,
            locationLabel: copy.skyline.locationLabel,
          }}
        />
      </Section>

      <Section aria-labelledby="cases-h">
        <SectionHead id="cases-h" title={copy.caseStudies.title} intro={copy.caseStudies.intro} />
        <CaseStudyGrid items={caseStudies} />
      </Section>

      <Section aria-labelledby="register-h" id="register">
        <SectionHead id="register-h" title={copy.register.title} intro={copy.register.intro} />
        <ProjectRegister rows={rows} sectors={sectorOptions} labels={copy.register} />
      </Section>

      <CtaBand title={copy.cta.title} body={copy.cta.body} />
    </>
  );
}
