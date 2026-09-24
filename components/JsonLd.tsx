/**
 * A schema.org block (lib/seo.ts). Server-rendered, so crawlers and AI answer
 * engines read it without running any script. `<` is escaped so a value can
 * never close the tag it sits in.
 */
export default function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\u003c") }}
    />
  );
}
