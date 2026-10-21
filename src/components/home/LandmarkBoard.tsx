import { getDictionary, getLocale } from "@/i18n/get-dictionary";
import { landmarks } from "@/content/landmarks";
import { scopes } from "@/content/register";
import { sectors } from "@/content/sectors";
import { pick } from "@/content/localized";
import { ProjectBoard } from "./ProjectBoard";

/** Resolves the landmark projects into the visitor's language and hands them to the board. */
export async function LandmarkBoard() {
  const [{ home }, locale] = await Promise.all([getDictionary(), getLocale()]);

  return (
    <ProjectBoard
      locale={locale}
      rtl={locale === "ar"}
      labels={home.board}
      projects={landmarks.map((l) => ({
        id: l.id,
        title: pick(l.title, locale),
        short: pick(l.short, locale),
        place: l.location,
        period: l.period,
        sector: pick(sectors[l.sector], locale),
        consultant: l.consultant || undefined,
        contractor: l.contractor || undefined,
        scopes: l.scope.map((k) => ({ key: k, label: pick(scopes[k], locale) })),
        logo: l.logo,
      }))}
    />
  );
}
