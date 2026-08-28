import type { Metadata, Viewport } from "next";
import { Marcellus, Jost } from "next/font/google";
import { notFound } from "next/navigation";
import "../globals.css";
import "../sections.css";
import "../pages.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Ground from "@/components/Ground";
import Intro from "@/components/Intro";
import CartProvider from "@/components/CartProvider";
import CartPanel from "@/components/CartPanel";
import { getDictionary, isLocale, locales, type Locale } from "@/lib/dictionaries";

/**
 * Marcellus — an inscriptional roman with a single weight. Chosen over the
 * high-contrast display serifs this brief would normally attract: its carved,
 * low-contrast letterforms belong to the same world as the carved wood in the
 * photography, and having no bold to reach for forces hierarchy to come from
 * size and spacing, which keeps every heading quiet.
 */
const display = Marcellus({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
});

/**
 * Jost — geometric humanist, echoing the circular construction of the ROOTS
 * wordmark. Reads cleanly at the small sizes this site actually needs it for:
 * wall labels, dimensions, prices.
 */
const body = Jost({
  weight: ["300", "400", "500"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
});

const SITE = "https://www.therootscorner.com";

/**
 * The intro gate. Runs before first paint.
 *
 * Shown once per session — a 1.5s veil on every reload is exactly the
 * "excessive animation" the brief bans — and never under prefers-reduced-motion.
 * Append ?intro to any URL to replay it.
 *
 * The timeout is a failsafe, not the schedule — it is deliberately far longer
 * than the ~1.55s sequence, so it only ever fires if Intro never got to run.
 */
const INTRO_GATE = `(function(){var r=document.documentElement;try{if(location.search.indexOf("intro")<0){if(sessionStorage.getItem("trc:intro"))return;sessionStorage.setItem("trc:intro","1")}}catch(e){}if(window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches)return;r.dataset.intro="run";setTimeout(function(){if(r.dataset.intro==="run"){r.dataset.intro="done";window.dispatchEvent(new Event("trc:intro-done"))}},5000)})();`;

/** Browser chrome takes the page ground rather than defaulting to white. */
export const viewport: Viewport = {
  themeColor: "#f7f5f2",
  colorScheme: "light",
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = getDictionary(locale);

  return {
    metadataBase: new URL(SITE),
    title: t.meta.title,
    description: t.meta.description,
    alternates: {
      canonical: `/${locale}`,
      languages: { fr: "/fr", en: "/en", "x-default": "/fr" },
    },
    openGraph: {
      type: "website",
      siteName: "The Roots Corner",
      title: t.meta.title,
      description: t.meta.description,
      locale: locale === "fr" ? "fr_FR" : "en_GB",
      url: `/${locale}`,
    },
    icons: { icon: "/brand/picto.svg" },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const t = getDictionary(locale as Locale);

  return (
    <html
      lang={locale}
      className={`${display.variable} ${body.variable}`}
      // data-intro is stamped on <html> by the script below, before React
      // hydrates. Without this the added attribute reads as a mismatch.
      suppressHydrationWarning
    >
      <body
        // Browser extensions write their own attributes onto <body> before
        // React hydrates — ColorZilla adds cz-shortcut-listen, Grammarly adds
        // data-gr-*, and there is nothing the page can do to stop them. React
        // then reports the tree as mismatched, which buries real hydration bugs
        // under noise a visitor's extensions caused.
        //
        // suppressHydrationWarning is shallow: it covers the element it is on
        // and NOT its descendants, so this is scoped to attributes written onto
        // <body> itself and cannot hide a mismatch inside the page. <html>
        // carries its own for the same reason — the intro gate stamps
        // data-intro on it before first paint.
        suppressHydrationWarning
      >
        {/* Decides before first paint whether the intro runs, so the veil is
            never painted on a visit that should not have it. Inline and
            synchronous on purpose: doing this in an effect would show one frame
            of the page first, which is the flash the intro exists to avoid.

            It also arms a failsafe. Whatever happens to React afterwards, the
            page is unlocked and the reveal signal is sent — a broken bundle
            must not be able to leave a visitor staring at a blank veil. */}
        <script
          dangerouslySetInnerHTML={{
            __html: INTRO_GATE,
          }}
        />

        <a href="#main" className="sr-only">
          {locale === "fr" ? "Aller au contenu" : "Skip to content"}
        </a>
        {/* Scroll-driven ground behind everything. Sections stay transparent. */}
        <Ground />
        <Intro />
        {/* The cart is client state shared by the header handle, the panel and
            every piece page, so the provider has to sit above all three. */}
        <CartProvider>
          <Header locale={locale as Locale} labels={t.nav} cart={t.cart.name} />
          <main id="main">{children}</main>
          <Footer locale={locale as Locale} t={t.footer} legal={t.legal} />
          <CartPanel locale={locale as Locale} t={t.cart} />
        </CartProvider>
      </body>
    </html>
  );
}
