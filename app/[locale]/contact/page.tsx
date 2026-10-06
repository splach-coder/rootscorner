import Image from "next/image";
import { ChannelMark } from "@/components/Social";
import { pageMeta } from "@/lib/seo";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import PieceLabel from "@/components/PieceLabel";
import InquiryForm, { type InquiryField } from "@/components/InquiryForm";
import ClosingBand from "@/components/ClosingBand";
import { getDictionary, isLocale, type Locale } from "@/lib/dictionaries";
import { accession, imagePath, pieceBySlug } from "@/lib/catalog";
import { displayName } from "@/lib/specs";
import {
  CONTACT_EMAIL,
  INSTAGRAM,
  INSTAGRAM_HANDLE,
  PLACE,
  WHATSAPP,
  whatsappDigits,
  whatsappHref,
} from "@/lib/site";

/**
 * The piece shown when nobody arrived from one.
 *
 * A deliberate choice, not the first record: the Baule chair is the only frame
 * in the set that reads architecturally at hero scale — a whole object, upright,
 * on warm plaster with its own shadow. It is also still available, so the
 * photograph on this page is always something a visitor could actually ask for.
 * Replace the slug if it sells.
 */
const DEFAULT_SUBJECT = "baule-chair-cote-d-ivoire";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = getDictionary(locale);

  return pageMeta({
    locale,
    path: "/contact",
    title: `${t.nav.contact} | The Roots Corner`,
    description: t.contactPage.lede,
  });
}

/**
 * Contact.
 *
 * A contact page on a gallery site is the last step of the sale, not a support
 * desk, so this one is built around the object rather than around the form. The
 * page opens on a piece at full height with its wall label beside the address —
 * and when the visitor arrived from a piece page, THAT is the piece shown, with
 * "you are asking about" over it. The enquiry is about something you can see.
 *
 * That is also why the piece pages link here as `?piece=<slug>` rather than
 * passing a display string: a slug resolves to the real record, so the page can
 * show the photograph, the label and the price, and prefill the message with the
 * piece's own number.
 *
 * Everything factual on the page is something we hold. The Instagram account is
 * the client's own and is their primary channel; the coordinates are
 * Marrakech's, shown as the city the collection is put together in, not as the
 * address of premises nobody has told us about. There is no telephone number and
 * no street because we have neither, and contact details are the one kind of
 * invented information a visitor would actually act on (CLAUDE.md §5).
 *
 * The delivery route names the client's own shipping zones and no times: their
 * product pages say 1–2 weeks and their FAQ says 3–8 (§9.3), and until that is
 * resolved the site states neither.
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
  const t = getDictionary(locale as Locale);

  const query = await searchParams;
  const asked = typeof query.piece === "string" ? pieceBySlug(query.piece) : undefined;
  const subject = asked ?? pieceBySlug(DEFAULT_SUBJECT);
  const shot = subject?.images[0];
  const shotSrc = imagePath(shot);

  // Arriving from a piece page, the message opens already saying which piece —
  // in the form, and in the WhatsApp chat, so the visitor never has to describe
  // an object they were just looking at.
  const opener = asked
    ? `${t.piece.accession} ${accession(asked)} · ${displayName(asked, locale as Locale)}`
    : undefined;

  const whatsapp = whatsappHref(opener);

  const c = t.contactPage;
  const fields: InquiryField[] = [
    /* What the message is about — the four routes that used to be a numbered
       list beside the form are now its first answer (client, 6 Oct). */
    {
      name: "topic",
      label: c.topicLabel,
      kind: "chips",
      options: [c.ways.piece, c.ways.rug, c.ways.delivery, c.topicOther].map((value) => ({ value })),
      defaultValue: asked ? c.ways.piece : undefined,
    },
    { name: "name", label: t.form.name, required: true, half: true },
    { name: "email", label: t.form.email, kind: "email", required: true, half: true },
    {
      name: "message",
      label: t.form.message,
      kind: "textarea",
      required: true,
      hint: t.contactPage.pieceRef,
      defaultValue: opener,
    },
    /*
      §2 — a piece is not always findable by a reference number.

      Someone who saw it on Instagram or Pinterest, or in a post that is no
      longer up, has a picture and nothing else. So the enquiry takes one, and
      it travels as an attachment on the same message rather than as a second
      thing they have to send somewhere else.
    */
    {
      name: "photo",
      label: t.form.photo,
      kind: "file",
      hint: t.form.photoHint,
      placeholder: c.photoAdd,
    },
  ];



  return (
    <>
      {/* --- The desk. Type on the left, the object at full height on the
           right. The page has to look like the rest of the site before it asks
           anyone for anything. --- */}
      <section className="desk">
        <div className="shell desk-inner">
          <Reveal className="desk-text">
            <p className="label">{t.nav.contact}</p>
            {/* Feedback, 25 Sept: "Écrivez-nous" and the paragraph about
                finding a piece seen on Instagram are off the page. The title
                stays for search engines and screen readers only — a page
                needs one real h1. The photo field on the form still does the
                job that paragraph described. */}
            <h1 className="sr-only">{t.contactPage.heading}</h1>
            <p className="lede desk-lede">{t.contactPage.lede}</p>

            {/* The channels, on the first screen and at full size. These are
                the things a visitor can act on immediately, so they sit above
                the fold rather than under it beside a form — and each carries
                its own key, the same label schema the pieces use.

                Every one of them is a real account. Nothing here is a
                placeholder: WhatsApp and the address appear only when the
                client has supplied them, because a wrong number is the single
                worst thing this page could publish (CLAUDE.md §5). */}
            <div className="desk-channel">
              <div className="desk-channel-item">
                <p className="label desk-channel-key"><ChannelMark channel="instagram" />Instagram</p>
                <a
                  href={INSTAGRAM}
                  className="link display d-3 desk-handle"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  {INSTAGRAM_HANDLE}
                </a>
                <p className="desk-note">{t.contactPage.instagramNote}</p>
              </div>

              {whatsapp && (
                <div className="desk-channel-item">
                  <p className="label desk-channel-key"><ChannelMark channel="whatsapp" />WhatsApp</p>
                  <a
                    href={whatsapp}
                    className="link display d-3 desk-handle"
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    {WHATSAPP}
                  </a>
                  <p className="desk-note">{t.contactPage.whatsappNote}</p>
                </div>
              )}

              {CONTACT_EMAIL && (
                <div className="desk-channel-item">
                  <p className="label desk-channel-key">
                    {t.contactPage.emailKey}
                  </p>
                  <a
                    href={`mailto:${CONTACT_EMAIL}`}
                    className="link display d-3 desk-handle"
                  >
                    {CONTACT_EMAIL}
                  </a>
                </div>
              )}
            </div>

            <p className="label desk-coords">
              {PLACE.city}, {PLACE.country[locale]}
              <span aria-hidden="true"> · </span>
              {PLACE.lat}
              <span aria-hidden="true"> · </span>
              {PLACE.lon}
            </p>
          </Reveal>

          <div className="desk-subject">
            <Reveal variant="frame" delay={120} className="frame desk-frame">
              {shotSrc && shot && subject && (
                <Image
                  src={shotSrc}
                  // Named only when it is genuinely the subject of the enquiry.
                  // Otherwise it is the room, and naming it would put a piece
                  // in the reading that the visitor never asked about.
                  alt={asked ? displayName(asked, locale as Locale) : ""}
                  width={shot.w}
                  height={shot.h}
                  priority
                  sizes="(max-width: 940px) 100vw, 38vw"
                />
              )}
            </Reveal>

            {/* The label appears only for a piece the visitor actually chose. */}
            {asked && (
              <Reveal delay={200} className="desk-plate">
                <p className="label desk-plate-key">{t.contactPage.subjectEyebrow}</p>
                <Link href={`/${locale}/piece/${asked.slug}`} className="desk-plate-link">
                  <PieceLabel
                    piece={asked}
                    locale={locale}
                    labels={t.pieceLabel}
                    variant="plate"
                  />
                </Link>
              </Reveal>
            )}
          </div>
        </div>
      </section>

      {/* --- The enquiry (redesigned 6 Oct).

           One composition instead of a list beside a form: the form takes the
           wide column and opens on what the message is about, and a room from
           the house stays in view beside it while you write, so the section
           shows a place rather than a column of text. --- */}
      <section className="section enquire">
        <div className="shell enquire-inner">
          <Reveal delay={60} className="enquire-form">
            <h2 className="display d-2 enquire-heading">{c.formHeading}</h2>
            <p className="prose enquire-lede">{c.formLede}</p>
            <InquiryForm
              fields={fields}
              topic="message"
              instagram={INSTAGRAM}
              whatsappDigits={whatsappDigits()}
              labels={{
                send: t.form.send,
                sending: t.form.sending,
                sent: t.form.sent,
                error: t.form.error,
                optional: t.form.optional,
                viaInstagram: t.form.viaInstagram,
                viaWhatsapp: t.form.viaWhatsapp,
                photoTooBig: t.form.photoTooBig,
                photoChange: c.photoChange,
                photoRemove: c.photoRemove,
              }}
            />
          </Reveal>

          <div className="enquire-room">
            <Reveal variant="frame" delay={140} className="frame enquire-room-frame">
              <Image
                src="/rugs/interior-lamp.jpg"
                alt={c.roomAlt}
                width={810}
                height={1256}
                sizes="(max-width: 939px) 100vw, 34vw"
              />
            </Reveal>
          </div>
        </div>
      </section>

      <ClosingBand
        locale={locale as Locale}
        t={t.closing}
        labels={t.pieceLabel}
        exclude={subject ? [subject.slug] : []}
      />
    </>
  );
}
