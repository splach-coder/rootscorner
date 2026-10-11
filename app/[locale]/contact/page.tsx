import { pageMeta } from "@/lib/seo";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import InquiryForm, { type InquiryField } from "@/components/InquiryForm";
import { getDictionary, isLocale, type Locale } from "@/lib/dictionaries";
import { pieceBySlug } from "@/lib/catalog";
import { displayName } from "@/lib/specs";
import { CONTACT, PRODUCT } from "@/lib/copy-v2";
import { INSTAGRAM, whatsappDigits } from "@/lib/site";
import { fill } from "@/lib/dictionaries";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const lang = locale as Locale;

  return pageMeta({
    locale,
    path: "/contact",
    title: `${CONTACT.title[lang]} | The Roots Corner`,
    description: `${CONTACT.intro[lang]} ${CONTACT.intro2[lang]}`,
  });
}

/**
 * Contact — V2 (10 Oct).
 *
 * The client's redesign: a title, one sentence, three fields and one button,
 * centred, with no photograph, no piece and no coordinates. A small way on to
 * the collection underneath.
 *
 * Piece pages still link here as `?piece=<slug>`: the message then opens
 * already naming the piece, so nobody has to describe an object they were
 * just looking at. Nothing else on the page changes.
 */
export default async function ContactPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const lang = locale as Locale;
  const t = getDictionary(lang);

  const query = await searchParams;
  const asked = typeof query.piece === "string" ? pieceBySlug(query.piece) : undefined;
  const opener = asked
    ? `${fill(PRODUCT.pieceNo[lang], { n: String(asked.index).padStart(3, "0") })} · ${displayName(asked, lang)}`
    : undefined;

  const fields: InquiryField[] = [
    { name: "name", label: CONTACT.name[lang], required: true },
    { name: "email", label: CONTACT.email[lang], kind: "email", required: true },
    { name: "message", label: CONTACT.message[lang], kind: "textarea", required: true, defaultValue: opener },
  ];

  return (
    <section className="contact-v2">
      <div className="shell contact-v2-inner">
        <Reveal className="contact-v2-head">
          <h1 className="display d-1 contact-v2-title">{CONTACT.title[lang]}</h1>
          <p className="contact-v2-intro">
            {CONTACT.intro[lang]}
            <br />
            {CONTACT.intro2[lang]}
          </p>
        </Reveal>

        <Reveal delay={100} className="contact-v2-form">
          <InquiryForm
            fields={fields}
            topic="message"
            instagram={INSTAGRAM}
            whatsappDigits={whatsappDigits()}
            labels={{
              send: CONTACT.send[lang],
              sending: CONTACT.sending[lang],
              sent: t.form.sent,
              error: t.form.error,
              optional: t.form.optional,
              viaInstagram: t.form.viaInstagram,
              viaWhatsapp: t.form.viaWhatsapp,
              photoTooBig: t.form.photoTooBig,
            }}
          />
        </Reveal>

        <p className="contact-v2-more">
          <Link href={`/${locale}/collection`} className="link label">
            {CONTACT.collectionCta[lang]}
          </Link>
        </p>
      </div>
    </section>
  );
}
