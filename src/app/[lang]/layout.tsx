import type { Metadata, Viewport } from "next";
import "@/styles/globals.css";
import { locales, localeDirection } from "@/i18n/config";
import { getDictionary, getLocale } from "@/i18n/get-dictionary";
import { fontVariables } from "@/lib/fonts";
import { site } from "@/content/site";
import { SkipLink } from "@/components/layout/SkipLink";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { RevealObserver } from "@/components/layout/RevealObserver";
import { ChatHelp } from "@/components/layout/ChatHelp";

/** Only /en and /ar exist; any other first segment is a 404. */
export const dynamicParams = false;

/** Pages refresh with content published in the Studio at most this often (seconds). */
export const revalidate = 60;

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata(): Promise<Metadata> {
  const { meta } = await getDictionary();
  return {
    metadataBase: new URL(site.url),
    title: { default: meta.siteName, template: `%s` },
    description: meta.defaultDescription,
    // a preview copy (e.g. /preview on Bluehost) must stay out of search results
    ...(process.env.NEXT_PUBLIC_NOINDEX === "1" ? { robots: { index: false, follow: false } } : {}),
  };
}

export const viewport: Viewport = {
  themeColor: "#f3f3f0",
};

export default async function RootLayout({ children }: LayoutProps<"/[lang]">) {
  const [locale, { common, chat }] = await Promise.all([getLocale(), getDictionary()]);

  return (
    <html lang={locale} dir={localeDirection[locale]} className={fontVariables}>
      <body>
        <SkipLink label={common.skipToContent} />
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
        <ChatHelp number={site.whatsapp} chatApi={process.env.NEXT_PUBLIC_CHAT_ENDPOINT || "/api/chat"} hours={site.officeHours} locale={locale} t={chat} />
        <RevealObserver />
      </body>
    </html>
  );
}
