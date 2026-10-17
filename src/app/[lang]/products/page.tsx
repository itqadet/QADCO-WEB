import type { Metadata } from "next";
import { getDictionary, getLocale } from "@/i18n/get-dictionary";
import { routes } from "@/i18n/routing";
import { buildMetadata } from "@/lib/metadata";
import { getProducts } from "@/lib/content";
import { productCategories } from "@/content/products";
import { PageIntro } from "@/components/sections/PageIntro";
import { CtaBand } from "@/components/sections/CtaBand";
import { GroupNav } from "@/components/products/GroupNav";
import { ProductGrid } from "@/components/products/ProductGrid";
import { BoardsList } from "@/components/products/BoardsList";
import { SupplierWall } from "@/components/products/SupplierWall";
import { Section, SectionHead } from "@/components/ui/Section";

export async function generateMetadata(): Promise<Metadata> {
  const [dict, locale] = await Promise.all([getDictionary(), getLocale()]);
  return buildMetadata(locale, routes.products, dict.products.meta);
}

/** Leaves room for the sticky header and the group bar when jumping to a group. */
const jumpOffset = { scrollMarginTop: "calc(var(--header-h) + 72px)" };

export default async function ProductsPage() {
  const [{ products: t, nav }, all] = await Promise.all([getDictionary(), getProducts()]);
  const groups = productCategories
    .map((c) => ({ id: c, title: t.categories[c].title, intro: t.categories[c].intro, items: all.filter((p) => p.category === c) }))
    .filter((g) => g.items.length > 0);

  return (
    <>
      <PageIntro crumb={nav.products} title={t.title} lede={t.lede} />

      <div>
        <GroupNav label={t.jumpLabel} groups={groups.map((g) => ({ id: g.id, title: g.title, count: g.items.length }))} />

        {groups.map((g, i) => (
          <Section key={g.id} id={g.id} aria-labelledby={`${g.id}-h`} tight={i === 0} style={jumpOffset}>
            <SectionHead id={`${g.id}-h`} title={g.title} intro={g.intro} />
            {g.id === "boards" ? <BoardsList items={g.items} /> : <ProductGrid items={g.items} />}
            {g.id === "ornamental" ? <p style={{ marginTop: "1.5rem", color: "var(--muted)" }}>{t.samplesNote}</p> : null}
          </Section>
        ))}
      </div>

      <Section aria-labelledby="suppliers-h">
        <SectionHead id="suppliers-h" title={t.suppliers.title} intro={t.suppliers.intro} />
        <SupplierWall />
      </Section>

      <CtaBand title={t.cta.title} body={t.cta.body} />
    </>
  );
}
