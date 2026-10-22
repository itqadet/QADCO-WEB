import type { Metadata } from "next";
import { getDictionary, getLocale } from "@/i18n/get-dictionary";
import { routes } from "@/i18n/routing";
import { buildMetadata } from "@/lib/metadata";
import { getProducts } from "@/lib/content";
import { productCategories, suppliers } from "@/content/products";
import { ProductsHero } from "@/components/products/ProductsHero";
import { CtaBand } from "@/components/sections/CtaBand";
import { GroupNav } from "@/components/products/GroupNav";
import { ProductGrid } from "@/components/products/ProductGrid";
import { SupplierWall } from "@/components/products/SupplierWall";
import { Section, SectionHead } from "@/components/ui/Section";

export async function generateMetadata(): Promise<Metadata> {
  const [dict, locale] = await Promise.all([getDictionary(), getLocale()]);
  return buildMetadata(locale, routes.products, dict.products.meta);
}

/** Leaves room for the sticky header and the group bar when jumping to a group. */
const jumpOffset = { scrollMarginTop: "calc(var(--header-h) + 72px)" };

export default async function ProductsPage() {
  const [{ products: t }, all] = await Promise.all([getDictionary(), getProducts()]);
  const groups = productCategories
    .map((c) => ({ id: c, title: t.categories[c].title, intro: t.categories[c].intro, items: all.filter((p) => p.category === c) }))
    .filter((g) => g.items.length > 0);

  return (
    <>
      <ProductsHero
        made={all.filter((p) => p.role === "made").length}
        supplied={all.filter((p) => p.role === "supplied").length}
        suppliers={Object.keys(suppliers).length}
        groups={groups.map((g) => ({ id: g.id, title: g.title, count: g.items.length, image: g.items
            .map((p) => p.image)
            .filter((im) => im !== undefined)
            // the sharpest photo in the group stands for it
            .sort((x, y) => y.width - x.width)[0] }))}
      />

      <div>
        <GroupNav label={t.jumpLabel} groups={groups.map((g) => ({ id: g.id, title: g.title, count: g.items.length }))} />

        {groups.map((g, i) => (
          <Section key={g.id} id={g.id} aria-labelledby={`${g.id}-h`} tight={i === 0} style={jumpOffset}>
            <SectionHead id={`${g.id}-h`} title={g.title} intro={g.intro} />
            <ProductGrid items={g.items} />
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
