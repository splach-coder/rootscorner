import { notFound } from "next/navigation";
import type { Metadata } from "next";
import PageHead from "@/components/PageHead";
import CheckoutOrder from "@/components/CheckoutOrder";
import { getDictionary, isLocale, locales, type Locale } from "@/lib/dictionaries";
import { CONTACT_EMAIL, INSTAGRAM } from "@/lib/site";

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
    title: `${t.checkout.heading} — The Roots Corner`,
    description: t.checkout.lede,
    // A cart is personal and its contents are in the visitor's browser; there
    // is nothing here for an index to hold.
    robots: { index: false, follow: true },
    alternates: { canonical: `/${locale}/checkout` },
  };
}

/**
 * Checkout — the review step, and the handover.
 *
 * This page collects nothing. Shopify's checkout is hosted: the correct
 * integration creates a cart through the Storefront API and sends the buyer to
 * Shopify's own domain, which takes the address, calculates shipping and
 * handles payment under its own PCI compliance.
 *
 * So there are no card fields here and there never will be — see lib/checkout.ts
 * for the full reasoning and the one function left to write. What this page
 * does is show the order back, state plainly where the money is taken, and hand
 * over.
 *
 * Until a processor is connected, the action says so in as many words and
 * offers the channel that does work today.
 */
export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale as Locale);

  return (
    <>
      <PageHead
        eyebrow={t.checkout.eyebrow}
        heading={t.checkout.heading}
        lede={t.checkout.lede}
      />

      <section className="section checkout">
        <CheckoutOrder
          locale={locale as Locale}
          t={t.checkout}
          cart={t.cart}
          contactEmail={CONTACT_EMAIL}
          instagram={INSTAGRAM}
        />
      </section>
    </>
  );
}
